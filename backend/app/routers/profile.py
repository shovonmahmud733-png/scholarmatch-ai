import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import StudentProfileModel, User
from ..schemas import StudentProfileSchema

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("", response_model=StudentProfileSchema)
def get_profile(user_id: str = "demo-student-001", db: Session = Depends(get_db)):
    prof = db.query(StudentProfileModel).filter(StudentProfileModel.user_id == user_id).first()
    if not prof:
        # Return default demo profile schema
        return StudentProfileSchema(
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
            preferred_countries=["United Kingdom", "Germany", "United States", "Australia"],
            language_test_status="taken",
            language_test_type="IELTS",
            language_test_score=7.5,
            funding_need="full_only",
            years_of_work_experience=2.5,
            has_research_experience=True,
            publications_count=1,
            leadership_extracurricular="President of University AI Student Chapter",
            profile_completion_percentage=95
        )

    return StudentProfileSchema(
        user_id=prof.user_id,
        full_name=prof.full_name,
        citizenship=prof.citizenship,
        residence_country=prof.residence_country,
        current_education_level=prof.current_education_level,
        highest_completed_degree=prof.highest_completed_degree,
        gpa=prof.gpa,
        grading_scale=prof.grading_scale,
        target_degree=prof.target_degree,
        field_of_study=prof.field_of_study,
        target_intake_year=prof.target_intake_year,
        expected_graduation_date=prof.expected_graduation_date,
        preferred_countries=json.loads(prof.preferred_countries_json or "[]"),
        preferred_universities=json.loads(prof.preferred_universities_json or "[]"),
        preferred_study_mode=prof.preferred_study_mode,
        preferred_language=prof.preferred_language,
        language_test_status=prof.language_test_status,
        language_test_type=prof.language_test_type,
        language_test_score=prof.language_test_score,
        funding_need=prof.funding_need,
        tuition_waiver_required=prof.tuition_waiver_required,
        living_stipend_required=prof.living_stipend_required,
        travel_grant_preferred=prof.travel_grant_preferred,
        application_budget_usd=prof.application_budget_usd,
        has_research_experience=prof.has_research_experience,
        publications_count=prof.publications_count,
        years_of_work_experience=prof.years_of_work_experience,
        leadership_extracurricular=prof.leadership_extracurricular,
        relevant_skills=json.loads(prof.relevant_skills_json or "[]"),
        profile_completion_percentage=prof.profile_completion_percentage,
        updated_at=prof.updated_at.isoformat() if prof.updated_at else None
    )

@router.put("", response_model=StudentProfileSchema)
def update_profile(data: StudentProfileSchema, user_id: str = "demo-student-001", db: Session = Depends(get_db)):
    prof = db.query(StudentProfileModel).filter(StudentProfileModel.user_id == user_id).first()
    
    # Calculate profile completion
    score = 0
    if data.full_name: score += 10
    if data.citizenship: score += 10
    if data.gpa: score += 15
    if data.target_degree: score += 15
    if data.field_of_study: score += 15
    if data.preferred_countries: score += 10
    if data.language_test_status != 'none': score += 10
    if data.funding_need: score += 10
    if data.has_research_experience or data.years_of_work_experience > 0: score += 5
    completion_percentage = min(100, score)

    if not prof:
        # Ensure user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            user = User(id=user_id, email="alex.rivera@example.edu", name=data.full_name or "Alex Rivera")
            db.add(user)
            db.commit()

        prof = StudentProfileModel(
            user_id=user_id,
            full_name=data.full_name,
            citizenship=data.citizenship,
            residence_country=data.residence_country,
            current_education_level=data.current_education_level,
            highest_completed_degree=data.highest_completed_degree,
            gpa=data.gpa,
            grading_scale=data.grading_scale,
            target_degree=data.target_degree,
            field_of_study=data.field_of_study,
            target_intake_year=data.target_intake_year,
            preferred_countries_json=json.dumps(data.preferred_countries),
            language_test_status=data.language_test_status,
            language_test_type=data.language_test_type,
            language_test_score=data.language_test_score,
            funding_need=data.funding_need,
            tuition_waiver_required=data.tuition_waiver_required,
            living_stipend_required=data.living_stipend_required,
            travel_grant_preferred=data.travel_grant_preferred,
            has_research_experience=data.has_research_experience,
            publications_count=data.publications_count,
            years_of_work_experience=data.years_of_work_experience,
            leadership_extracurricular=data.leadership_extracurricular,
            relevant_skills_json=json.dumps(data.relevant_skills),
            profile_completion_percentage=completion_percentage,
            updated_at=datetime.utcnow()
        )
        db.add(prof)
    else:
        prof.full_name = data.full_name
        prof.citizenship = data.citizenship
        prof.residence_country = data.residence_country
        prof.current_education_level = data.current_education_level
        prof.highest_completed_degree = data.highest_completed_degree
        prof.gpa = data.gpa
        prof.grading_scale = data.grading_scale
        prof.target_degree = data.target_degree
        prof.field_of_study = data.field_of_study
        prof.target_intake_year = data.target_intake_year
        prof.preferred_countries_json = json.dumps(data.preferred_countries)
        prof.language_test_status = data.language_test_status
        prof.language_test_type = data.language_test_type
        prof.language_test_score = data.language_test_score
        prof.funding_need = data.funding_need
        prof.tuition_waiver_required = data.tuition_waiver_required
        prof.living_stipend_required = data.living_stipend_required
        prof.travel_grant_preferred = data.travel_grant_preferred
        prof.has_research_experience = data.has_research_experience
        prof.publications_count = data.publications_count
        prof.years_of_work_experience = data.years_of_work_experience
        prof.leadership_extracurricular = data.leadership_extracurricular
        prof.profile_completion_percentage = completion_percentage
        prof.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(prof)
    
    return StudentProfileSchema(
        user_id=prof.user_id,
        full_name=prof.full_name,
        citizenship=prof.citizenship,
        residence_country=prof.residence_country,
        current_education_level=prof.current_education_level,
        highest_completed_degree=prof.highest_completed_degree,
        gpa=prof.gpa,
        grading_scale=prof.grading_scale,
        target_degree=prof.target_degree,
        field_of_study=prof.field_of_study,
        target_intake_year=prof.target_intake_year,
        preferred_countries=json.loads(prof.preferred_countries_json or "[]"),
        language_test_status=prof.language_test_status,
        language_test_type=prof.language_test_type,
        language_test_score=prof.language_test_score,
        funding_need=prof.funding_need,
        tuition_waiver_required=prof.tuition_waiver_required,
        living_stipend_required=prof.living_stipend_required,
        travel_grant_preferred=prof.travel_grant_preferred,
        has_research_experience=prof.has_research_experience,
        publications_count=prof.publications_count,
        years_of_work_experience=prof.years_of_work_experience,
        leadership_extracurricular=prof.leadership_extracurricular,
        profile_completion_percentage=prof.profile_completion_percentage,
        updated_at=prof.updated_at.isoformat()
    )
