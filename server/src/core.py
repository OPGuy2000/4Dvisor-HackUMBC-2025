import os

from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    database=os.getenv("NEO4J_DATABASE"),
    auth=(
        os.getenv("NEO4J_USER"),
        os.getenv("NEO4J_PASSWORD")
    )
)

def get_student(sid):
    query = """
    MATCH (s:Student {id:$sid})-[:PURSUING]->(d:Degree)
    OPTIONAL MATCH (s)-[:COMPLETED]->(c:Course)
    WITH s, d, SUM(c.credits) AS creditsCompleted, COLLECT(DISTINCT c) AS completedCourses
    MATCH (d)<-[:PART_OF]-(r:RequirementGroup)<-[:FULFILLS]-(req:Course)
    WITH s, d, creditsCompleted, completedCourses, COLLECT(DISTINCT req) AS requiredCourses
    WITH s, d, 
        creditsCompleted,
        requiredCourses,
        SIZE([c IN completedCourses WHERE c IN requiredCourses]) AS requirementsCompleted,
        SIZE(requiredCourses) AS totalRequirements
    RETURN s.id AS id,
        s.name AS name,
        d.name AS degree,
        creditsCompleted,
        requirementsCompleted,
        totalRequirements,
        (requirementsCompleted / totalRequirements) AS percentRequirementsCompleted
    """
    with driver.session() as session:
        result = session.run(query, sid=sid)
        record = result.single()
        if record:
            return dict(record)
        else:
            return {}

def list_students():
    query = """
    MATCH (s:Student)-[:PURSUING]->(d:Degree)
    RETURN s.id AS id, s.name AS name, s.expectedGraduation AS expectedGraduation, d.name AS degree
    ORDER BY s.name
    """
    with driver.session() as session:
        return [dict(record) for record in session.run(query)]

def four_year_plan(sid, major):
    query = """
    MATCH (s:Student {id:$sid})-[:SIMILAR_TO]->(other:Student)
    WITH other LIMIT 20
    MATCH (req:Requirement {major:$major})-[:REQUIRES]->(c:Course)
    OPTIONAL MATCH (other)-[:COMPLETED]->(c)
    RETURN c.code AS course, c.term AS suggestedTerm, COUNT(other) AS popularity
    ORDER BY popularity DESC
    """
    with driver.session() as session:
        return [dict(record) for record in session.run(query, sid=sid, major=major)]

def switch_major(sid, new_major):
    query = """
    MATCH (d:Degree {name:$new_major})-[:LEADS_TO]->(:RequirementGroup)-[:REQUIRES]->(c:Course)
    WHERE NOT EXISTS { MATCH (s:Student {id:$sid})-[:COMPLETED]->(c) }
    RETURN c.id AS requiredCourse, 
           c.name AS courseName
    ORDER BY c.id
    """
    with driver.session() as session:
        return [dict(record) for record in session.run(query, sid=sid, new_major=new_major)]

# def suggest_clubs(driver, sid, category):
#     query = """
#     MATCH (s:Student {id:$sid})-[:SIMILAR_TO]->(other:Student)-[:MEMBER_OF]->(c:Club {category:$category})
#     RETURN c.name AS club, COUNT(other) AS popularity
#     ORDER BY popularity DESC
#     """
#     with driver.session() as session:
#         return [dict(record) for record in session.run(query, sid=sid, category=category)]

def add_repo(sid, url):
    query = """
    MERGE (s:Student {id:$sid})
    MERGE (r:Repo {url:$url})
    MERGE (s)-[:CONTRIBUTED_TO]->(r)
    """
    with driver.session() as session:
        session.run(query, sid=sid, url=url)
    return {"status": "Repo added"}
