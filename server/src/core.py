import requests
import json

from rapidfuzz import fuzz, process

import requests
import json

from rapidfuzz import fuzz, process

import os

from dotenv import load_dotenv
from neo4j import GraphDatabase

from datetime import datetime, timedelta


load_dotenv()

driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    database=os.getenv("DATABASE_NAME"),
    auth=(os.getenv("NEO4J_USER"), os.getenv("NEO4J_PASSWORD")),
)


def deepseekcall():
    api_key = os.getenv("DEEPSEEK_API_KEY")

    url = "https://api.deepseek.com/v1/chat/completions"

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    payload = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": "Hello, DeepSeek!"}],
        "temperature": 0.7,
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        print("DeepSeek Response:", response.json()["choices"][0]["message"]["content"])
    else:
        print(f"Error: {response.status_code} - {response.text}")


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
            score += ratio / 100.0
    return 0 if scoreCounter == 0 else (score / scoreCounter)


def opportunity_recommender(sid):
    completed_courses = get_completed_courses(sid)

    url = "https://raw.githubusercontent.com/SimplifyJobs/Summer2026-Internships/refs/heads/dev/.github/scripts/listings.json"
    response = requests.get(url)
    listings = list(
        filter(lambda listing: listing.get("active", False), response.json())
    )

    scored_listings = [
        (course_opportunity_scorer(listing, completed_courses), listing)
        for listing in listings
    ]

    sorted_top = sorted(scored_listings, key=lambda l: l[0], reverse=True)

    sorted_top_listings = [listing for (score, listing) in sorted_top[:4]]
    return sorted_top_listings

def get_similar_students(sid):
    query = """
    MATCH (s1:Student {id:$sid})-[simP:SIMILAR_PERFORMANCE]->(s2:Student)
    OPTIONAL MATCH (s1)-[simL:SIMILAR_LEARNING_STYLE]->(s2)
    RETURN s1.id AS sid1, s1.name AS sname, s2.id AS sid2, s2.name AS s2name, simP.similarity AS similarPerformance, simL.similarity AS similarLearning
    """
    with driver.session() as session:
        return [dict(record) for record in session.run(query, sid=sid)]
    
def determine_buddies(sid):
    similarity_data = get_similar_students(sid)
    similar_students = [
        (record["sid1"], record["sid2"], ((float(record["similarPerformance"]) + float(record["similarLearning"]))/2))
        for record in similarity_data
    ]

    sorted_similar = sorted(similar_students, key=lambda l: l[0], reverse=True)
    similar_top = [student for (student, other, simValue) in sorted_similar[:4]]
    return similar_top



# def suggest_clubs(driver, sid, category):
#     query = """
#     MATCH (s:Student {id:$sid})-[:SIMILAR_TO]->(other:Student)-[:MEMBER_OF]->(c:Club {category:$category})
#     RETURN c.name AS club, COUNT(other) AS popularity
#     ORDER BY popularity DESC
#     """
#     with driver.session() as session:
#         return [dict(record) for record in session.run(query, sid=sid, category=category)]


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
        d.id AS degreeId,
        d.coreCreditsRequired AS coreCreditsRequired,
        d.electiveCreditsRequired AS electiveCreditsRequired,
        s.enrollmentDate AS enrollmentDate,
        s.expectedGraduation AS expectedGraduation,
        s.learningStyle AS learningStyle,
        s.preferredPace AS preferredPace,
        creditsCompleted,
        requirementsCompleted,
        totalRequirements,
        (requirementsCompleted / totalRequirements) AS percentRequirementsCompleted
    """
    with driver.session() as session:
        result = session.run(query, sid=sid)
        record = result.single()
        return dict(record) if record else {}


def get_requirement_group_status(sid):
    """
    Returns a list of dicts:
    [
      {
        "requirementGroupId": "...",
        "requirementGroupName": "...",
        "minCredits": 9,
        "creditsCompleted": 3,
        "completedCourseIds": [...]
      }, ...
    ]
    """
    query = """
    MATCH (s:Student {id: $sid})-[:PURSUING]->(d:Degree)
    MATCH (rg:RequirementGroup)-[:PART_OF]->(d)
    OPTIONAL MATCH (s)-[:COMPLETED]->(completed:Course)-[:FULFILLS]->(rg)
    WITH rg,
         rg.id AS requirementGroupId,
         rg.name AS requirementGroupName,
         rg.minimumCredits AS minCredits,
         SUM(completed.credits) AS creditsCompleted,
         COLLECT(DISTINCT completed.id) AS completedCourseIds
    RETURN requirementGroupId,
           requirementGroupName,
           minCredits,
           creditsCompleted,
           completedCourseIds
    ORDER BY requirementGroupName
    """
    with driver.session() as session:
        return [dict(record) for record in session.run(query, sid=sid)]


def get_elective_credits_completed(sid):
    """
    Returns total elective credits the student has completed
    (courses not fulfilling any RequirementGroup of their degree)
    """
    query = """
    MATCH (s:Student {id: $sid})-[:PURSUING]->(d:Degree)
    MATCH (s)-[:COMPLETED]->(c:Course)
    WHERE NOT (c)-[:FULFILLS]->(:RequirementGroup)-[:PART_OF]->(d)
    RETURN COALESCE(SUM(c.credits),0) AS electiveCreditsCompleted
    """
    with driver.session() as session:
        record = session.run(query, sid=sid).single()
        return record["electiveCreditsCompleted"] if record else 0


def get_possible_courses(sid):
    possibleCoursesQuery = """
        MATCH (s:Student {id: $sid})-[:PURSUING]->(d:Degree)
        MATCH (c:Course)
        OPTIONAL MATCH (c)-[:FULFILLS]->(rg:RequirementGroup)-[:PART_OF]->(d)
        WHERE NOT (s)-[:COMPLETED]->(c)
          AND NOT (s)-[:ENROLLED_IN]->(c)
        RETURN DISTINCT 
            c.id AS courseId,
            c.name AS courseName,
            c.credits AS credits,
            c.department AS department,
            c.level AS level,
            c.termAvailability AS termAvailability,
            c.kinestheticLearnerSuccess AS kinestheticSuccess,
            c.readingLearnerSuccess AS readingWritingSuccess,
            c.visualLearnerSuccess AS visualSuccess,
            c.auditoryLearnerSuccess AS auditorySuccess,
            c.avgDifficulty AS difficulty,
            rg.id AS requirementGroupId
        ORDER BY level, courseId;
    """
    with driver.session() as session:
        return [dict(record) for record in session.run(possibleCoursesQuery, sid=sid)]


def compute_score(course, learning_style):
    success_map = {
        "Kinesthetic": course.get("kinestheticSuccess", 0),
        "Reading-Writing": course.get("readingWritingSuccess", 0),
        "Visual": course.get("visualSuccess", 0),
        "Auditory": course.get("auditorySuccess", 0),
    }
    success = success_map.get(learning_style, 0)
    difficulty = int(course.get("difficulty", 3))
    ease = 6 - difficulty
    return success * ease


def pick_courses_for_group(sorted_courses, min_credits):
    picked = []
    total = 0
    for c in sorted_courses:
        if total >= min_credits:
            break
        picked.append(c)
        total += c["credits"]
    return picked, total


def get_min_credits_for_group(group_id):
    query = """
    MATCH (rg:RequirementGroup {id: $group_id})
    RETURN rg.minimumCredits AS minCredits
    """
    with driver.session() as session:
        result = session.run(query, group_id=group_id)
        record = result.single()
        if record:
            return record["minCredits"]
        else:
            return 0  # default if not found


def get_course_recommendations(sid):
    student = get_student(sid)
    if not student:
        return {"core_courses": [], "requirement_group_courses": [], "electives": []}

    learning_style = student.get("learningStyle", "")
    reqCreditsRequired = student.get("coreCreditsRequired", 0)
    electiveCreditsRequired = student.get("electiveCreditsRequired", 0)
    creditsCompleted = student.get("creditsCompleted", 0)

    # Get group & elective info
    req_group_status = get_requirement_group_status(sid)
    elective_completed = get_elective_credits_completed(sid)

    # All remaining courses (only ones not completed/enrolled)
    all_remaining_courses = get_possible_courses(sid)

    # Utility to compute score from course dict
    def course_info(course):
        score = compute_score(
            {
                "kinestheticSuccess": course.get("kinestheticSuccess", 0),
                "readingWritingSuccess": course.get("readingWritingSuccess", 0),
                "visualSuccess": course.get("visualSuccess", 0),
                "auditorySuccess": course.get("auditorySuccess", 0),
                "difficulty": course.get("difficulty", 3),
            },
            learning_style,
        )
        return {
            "courseId": course.get("courseId"),
            "courseName": course.get("courseName"),
            "department": course.get("department"),
            "credits": course.get("credits"),
            "score": score,
            "requirementGroupId": course.get("requirementGroupId"),
        }

    # Score all courses up front
    scored_courses = [course_info(c) for c in all_remaining_courses]

    core_selected = []
    req_selected = []
    electives_selected = []

    # ---- 1. Core groups first (requirementGroupId containing '-CORE-') ----
    for group in [
        g for g in req_group_status if "-CORE-" in (g["requirementGroupId"] or "")
    ]:
        credits_needed = max(
            0, (group["minCredits"] or 0) - (group["creditsCompleted"] or 0)
        )
        if credits_needed <= 0:
            continue
        # courses for this group
        group_courses = [
            c
            for c in scored_courses
            if c["requirementGroupId"] == group["requirementGroupId"]
        ]
        group_courses.sort(key=lambda c: c["score"], reverse=True)
        credits_accum = 0
        for c in group_courses:
            if credits_accum >= credits_needed:
                break
            core_selected.append(c)
            credits_accum += c["credits"]

    # ---- 2. Non-core requirement groups ----
    for group in [
        g for g in req_group_status if "-CORE-" not in (g["requirementGroupId"] or "")
    ]:
        credits_needed = max(
            0, (group["minCredits"] or 0) - (group["creditsCompleted"] or 0)
        )
        if credits_needed <= 0:
            continue
        group_courses = [
            c
            for c in scored_courses
            if c["requirementGroupId"] == group["requirementGroupId"]
        ]
        group_courses.sort(key=lambda c: c["score"], reverse=True)
        credits_accum = 0
        for c in group_courses:
            if credits_accum >= credits_needed:
                break
            req_selected.append(c)
            credits_accum += c["credits"]

    # ---- 3. Electives ----
    # compute total elective credits remaining
    elective_needed = max(0, electiveCreditsRequired - elective_completed)
    if elective_needed > 0:
        elective_courses = [c for c in scored_courses if not c["requirementGroupId"]]
        elective_courses.sort(key=lambda c: c["score"], reverse=True)
        credits_accum = 0
        for c in elective_courses:
            if credits_accum >= elective_needed:
                break
            electives_selected.append(c)
            credits_accum += c["credits"]

    return {
        "core_courses": core_selected,
        "requirement_group_courses": req_selected,
        "electives": electives_selected,
    }


def plan_semesters(courses, prereq_map, max_credits_per_sem=20):
    """
    courses: list of dicts {courseId, credits, ...}
    prereq_map: dict courseId -> list of prereq courseIds
    returns: list of semesters, each a list of course dicts
    """
    # build in-degree map
    indegree = {c["courseId"]: 0 for c in courses}
    graph = {c["courseId"]: [] for c in courses}
    course_dict = {c["courseId"]: c for c in courses}

    # build graph edges from prereq_map
    for course_id, prereqs in prereq_map.items():
        for p in prereqs:
            if p in indegree and course_id in indegree:
                indegree[course_id] += 1
                graph[p].append(course_id)

    # initial queue
    available = [cid for cid, deg in indegree.items() if deg == 0]
    semesters = []

    while available:
        sem_courses = []
        sem_credits = 0
        next_available = []

        # sort available by some priority (score, etc.)
        available.sort(key=lambda cid: course_dict[cid].get("score", 0), reverse=True)

        for cid in available:
            credits = course_dict[cid]["credits"]
            if sem_credits + credits <= max_credits_per_sem:
                sem_courses.append(course_dict[cid])
                sem_credits += credits
            else:
                next_available.append(cid)  # push to next semester

        # after taking sem_courses, update indegree
        for c in sem_courses:
            for dep in graph[c["courseId"]]:
                indegree[dep] -= 1
                if indegree[dep] == 0:
                    next_available.append(dep)

        semesters.append(
            {
                "semester": len(semesters) + 1,
                "courses": sem_courses,
                "totalCredits": sem_credits,
            }
        )
        available = next_available

    return semesters


def estimate_graduation_date(student, total_credits_remaining, max_credits_per_sem):
    """
    Estimate graduation date by adding the needed semesters to enrolledDate.
    Assumes 2 semesters per year (fall/spring) ~6 months apart.
    """
    # If you store enrolledDate as a string like '2023-08-20':
    enrolled_str = student.get("enrollmentDate")
    if not enrolled_str:
        return None  # can't compute

    try:
        start_date = datetime.fromisoformat(enrolled_str)
    except Exception:
        return None

    semesters_needed = int(
        (total_credits_remaining + max_credits_per_sem - 1) // max_credits_per_sem
    )
    # each semester ~6 months (182 days) apart
    est_grad_date = start_date + timedelta(days=semesters_needed * 182)
    return est_grad_date.date().isoformat()


def four_year_plan(sid):
    student = get_student(sid)
    if not student:
        return {"error": "Student not found"}

    preferred_pace = (student.get("preferredPace") or "").strip().lower()
    if preferred_pace == "part-time":
        max_credits_per_sem = 13
    elif preferred_pace == "accelerated":
        max_credits_per_sem = 20
    else:
        max_credits_per_sem = 17

    # get recommendations
    recommendations = get_course_recommendations(sid)

    # combine courses
    all_courses = (
        recommendations["core_courses"]
        + recommendations["requirement_group_courses"]
        + recommendations["electives"]
    )

    # total credits still needed
    credits_remaining = sum(c["credits"] for c in all_courses)

    # prereq map as before…
    prereq_map = {}
    with driver.session() as session:
        for c in all_courses:
            q = """
            MATCH (p:Course)-[:PREREQ_FOR]->(c:Course {id:$cid})
            RETURN COLLECT(p.id) AS prereqs
            """
            rec = session.run(q, cid=c["courseId"]).single()
            prereq_map[c["courseId"]] = rec["prereqs"] if rec else []

    semesters = plan_semesters(all_courses, prereq_map, max_credits_per_sem)

    predicted_grad = estimate_graduation_date(
        student, credits_remaining, max_credits_per_sem
    )

    return {
        "student": student,
        "preferredPace": preferred_pace,
        "maxCreditsPerSemester": max_credits_per_sem,
        "recommendations": recommendations,
        "semesters": semesters,
        "predictedGraduation": predicted_grad,
    }
