import requests
import json

from rapidfuzz import fuzz, process

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
    RETURN s.id AS id, s.name AS name, s.expectedGraduation AS expectedGraduation, s.enrollmentDate as enrollmentDate, d.name AS degree
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
    MATCH (req:Requirement {major:$major})-[:REQUIRES]->(c:Course)
    OPTIONAL MATCH (other)-[:COMPLETED]->(c)
    RETURN c.code AS course, c.term AS suggestedTerm, COUNT(other) AS popularity
    ORDER BY popularity DESC
    """
    with driver.session() as session:
        return [dict(record) for record in session.run(query, sid=sid, major=major)]
    

def get_completed_courses(sid):
    query = """
    MATCH (s:Student {id:$sid})-[:COMPLETED]->(c:Course)
    OPTIONAL MATCH (other:Student)-[:COMPLETED]->(c)
    RETURN c.name AS name, COUNT(DISTINCT other) AS popularity
    ORDER BY popularity DESC
    """
    with driver.session() as session:
        return [dict(record) for record in session.run(query, sid=sid)]
    
def course_opportunity_scorer(opportunity, courses):
    opportunity = opportunity.get("title", "").lower()

    score = 0
    scoreCounter = 0
    for c in courses:
        # ratio = fuzz.partial_ratio(c.lower(), opportunity)
        ratio = fuzz.partial_ratio(c["name"].lower(), opportunity)
        if ratio > 60:
            scoreCounter += 1
            score += ratio/100.0
    return 0 if scoreCounter == 0 else (score/scoreCounter)



def opportunity_recommender (sid):
    completed_courses = get_completed_courses(sid)

    url = "https://raw.githubusercontent.com/SimplifyJobs/Summer2026-Internships/refs/heads/dev/.github/scripts/listings.json"
    response = requests.get(url)
    listings = list(filter(lambda listing: listing.get("active", False), response.json()))

    scored_listings = [
        (course_opportunity_scorer(listing, completed_courses), listing) for listing in listings
    ]

    sorted_top = sorted(
        scored_listings, 
        key=lambda l: l[0],
        reverse=True
    )

    sorted_top_listings = [listing for (score, listing) in sorted_top[:3]]
    return sorted_top_listings

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
