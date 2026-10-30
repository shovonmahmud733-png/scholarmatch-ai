import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_api_tests():
    print("=== Running ScholarMatch AI Backend API Test Suite ===")
    passed = 0
    total = 0

    def assert_test(cond, name):
        nonlocal passed, total
        total += 1
        if cond:
            print(f"[PASS] {name}")
            passed += 1
        else:
            print(f"[FAIL] {name}")
            raise AssertionError(f"Test failed: {name}")

    # 1. Health check
    res = client.get("/api/health")
    assert_test(res.status_code == 200, "GET /api/health returns 200")
    assert_test(res.json()["status"] == "healthy", "Service status is healthy")

    # 2. Get all scholarships
    res = client.get("/api/scholarships")
    assert_test(res.status_code == 200, "GET /api/scholarships returns 200")
    scholarships = res.json()
    assert_test(len(scholarships) == 12, f"Returns all 12 verified scholarships (got {len(scholarships)})")

    # 3. Filter by country
    res = client.get("/api/scholarships?country=Germany")
    assert_test(res.status_code == 200, "Filter by Germany returns 200")
    assert_test(any("DAAD" in s["title"] for s in res.json()), "Germany results contain DAAD")

    # 4. Get scholarship details
    res = client.get("/api/scholarships/chevening-uk-2025")
    assert_test(res.status_code == 200, "GET /api/scholarships/chevening-uk-2025 returns 200")
    data = res.json()
    assert_test(data["title"] == "Chevening Master's Scholarship", "Correct scholarship title returned")
    assert_test(data["funding_details"]["funding_type"] == "fully_funded", "Funding type verified")

    # 5. AI Recommendation Match (Layer 1-4)
    # Qualified Master applicant
    master_profile = {
        "full_name": "Test Master",
        "citizenship": "Mexico",
        "residence_country": "Mexico",
        "current_education_level": "Bachelor Degree",
        "highest_completed_degree": "Bachelor of Science",
        "gpa": 3.75,
        "grading_scale": "4.0",
        "target_degree": "masters",
        "field_of_study": "Computer Science & AI",
        "preferred_countries": ["United Kingdom"],
        "language_test_status": "taken",
        "language_test_type": "IELTS",
        "language_test_score": 7.5,
        "funding_need": "full_only",
        "years_of_work_experience": 3.0,
        "has_research_experience": True,
        "publications_count": 1,
        "profile_completion_percentage": 95
    }

    res = client.post("/api/recommendations/match", json={
        "scholarship_id": "chevening-uk-2025",
        "profile": master_profile
    })
    assert_test(res.status_code == 200, "POST /api/recommendations/match returns 200")
    match_result = res.json()
    print("DEBUG missing_requirements:", match_result["missing_requirements"])
    print("DEBUG why_it_matches:", match_result["why_it_matches"])
    assert_test(match_result["eligibility_status"] in ["eligible", "potentially_eligible"], f"Status is valid eligible fit (got {match_result['eligibility_status']})")
    assert_test(match_result["match_score"] >= 80, f"Match score >= 80 (got {match_result['match_score']})")
    assert_test(len(match_result["why_it_matches"]) >= 3, "Why it matches list has >= 3 points")

    # 6. Hard Disqualification Check
    bachelor_profile = dict(master_profile)
    bachelor_profile["target_degree"] = "bachelors"
    res = client.post("/api/recommendations/match", json={
        "scholarship_id": "chevening-uk-2025",
        "profile": bachelor_profile
    })
    disqualified = res.json()
    assert_test(disqualified["eligibility_status"] == "ineligible", "Degree mismatch marked ineligible")
    assert_test(disqualified["match_score"] < 40, f"Disqualified score strictly capped below 40 (got {disqualified['match_score']})")
    assert_test(len(disqualified["failed_mandatory_requirements"]) > 0, "Failed mandatory list populated")

    # 7. Batch Ranking
    res = client.post("/api/recommendations/rank", json={
        "profile": master_profile
    })
    assert_test(res.status_code == 200, "POST /api/recommendations/rank returns 200")
    ranked = res.json()
    assert_test(len(ranked) == 12, "All scholarships ranked in batch")
    assert_test(ranked[0]["match_score"] >= ranked[-1]["match_score"], "Ranked in descending order")

    # 8. Profile API
    res = client.get("/api/profile")
    assert_test(res.status_code == 200, "GET /api/profile returns 200")
    assert_test(res.json()["user_id"] == "demo-student-001", "Default profile returned")

    # 9. Feedback submission
    res = client.post("/api/recommendations/feedback", json={
        "scholarship_id": "chevening-uk-2025",
        "feedback_type": "accurate_match",
        "notes": "Evaluation matches my target UK master plan"
    })
    assert_test(res.status_code == 200, "POST /api/recommendations/feedback returns 200")

    print(f"\n=== Test Summary: {passed}/{total} Passed ===")
    return passed == total

if __name__ == "__main__":
    success = run_api_tests()
    sys.exit(0 if success else 1)
