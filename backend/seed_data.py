import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.database import SessionLocal, Base, engine
from app.models import ScholarshipModel, User, StudentProfileModel

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def seed_database():
    json_path = os.path.join(os.path.dirname(__file__), "scholarships.json")
    with open(json_path, "r", encoding="utf-8") as f:
        scholarships_data = json.load(f)

    db = SessionLocal()
    try:
        print(f"Seeding {len(scholarships_data)} verified scholarships into database...")
        for s in scholarships_data:
            existing = db.query(ScholarshipModel).filter(ScholarshipModel.id == s["id"]).first()
            if not existing:
                model = ScholarshipModel(
                    id=s["id"],
                    title=s["title"],
                    provider=s["provider"],
                    host_university=s.get("host_university"),
                    destination_country=s["destination_country"],
                    destination_city=s.get("destination_city"),
                    eligible_nationalities_json=json.dumps(s.get("eligible_nationalities", [])),
                    target_degrees_json=json.dumps(s.get("target_degrees", [])),
                    eligible_subjects_json=json.dumps(s.get("eligible_subjects", [])),
                    academic_requirements_json=json.dumps(s.get("academic_requirements", {})),
                    language_requirements_json=json.dumps(s.get("language_requirements", {})),
                    funding_details_json=json.dumps(s.get("funding_details", {})),
                    application_open_date=s.get("application_open_date"),
                    application_deadline=s["application_deadline"],
                    intake_year=s.get("intake_year", 2026),
                    official_url=s["official_url"],
                    source_url=s["source_url"],
                    last_verified_at=s["last_verified_at"],
                    publication_status=s.get("publication_status", "open"),
                    is_verified_data=s.get("is_verified_data", True),
                    selection_criteria_json=json.dumps(s.get("selection_criteria", [])),
                    application_procedure_json=json.dumps(s.get("application_procedure", [])),
                    required_documents_json=json.dumps(s.get("required_documents", [])),
                    overview=s["overview"],
                    competitiveness=s.get("competitiveness", "High"),
                    tags_json=json.dumps(s.get("tags", []))
                )
                db.add(model)

        # Seed default demo student
        demo_user = db.query(User).filter(User.id == "demo-student-001").first()
        if not demo_user:
            demo_user = User(
                id="demo-student-001",
                email="alex.rivera@example.edu",
                name="Alex Rivera",
                role="student"
            )
            db.add(demo_user)

        demo_profile = db.query(StudentProfileModel).filter(StudentProfileModel.user_id == "demo-student-001").first()
        if not demo_profile:
            demo_profile = StudentProfileModel(
                user_id="demo-student-001",
                full_name="Alex Rivera",
                citizenship="Mexico",
                residence_country="Mexico",
                current_education_level="Bachelor Degree",
                highest_completed_degree="Bachelor of Science in Computer Science",
                gpa=3.65,
                grading_scale="4.0",
                target_degree="masters",
                field_of_study="Computer Science & AI",
                target_intake_year=2026,
                preferred_countries_json=json.dumps(["United Kingdom", "Germany", "United States", "Australia"]),
                language_test_status="taken",
                language_test_type="IELTS",
                language_test_score=7.5,
                funding_need="full_only",
                tuition_waiver_required=True,
                living_stipend_required=True,
                travel_grant_preferred=True,
                has_research_experience=True,
                publications_count=1,
                years_of_work_experience=2.5,
                leadership_extracurricular="President of University AI Student Chapter",
                profile_completion_percentage=95
            )
            db.add(demo_profile)

        db.commit()
        count = db.query(ScholarshipModel).count()
        print(f"[OK] Database seeding complete! Total scholarships in DB: {count}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
