import json
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(32), default="student")
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("StudentProfileModel", back_populates="user", uselist=False, cascade="all, delete-orphan")
    applications = relationship("ApplicationModel", back_populates="user", cascade="all, delete-orphan")
    saved_scholarships = relationship("SavedScholarshipModel", back_populates="user", cascade="all, delete-orphan")


class StudentProfileModel(Base):
    __tablename__ = "student_profiles"

    user_id = Column(String(64), ForeignKey("users.id"), primary_key=True)
    full_name = Column(String(255), nullable=False)
    citizenship = Column(String(100), nullable=False)
    residence_country = Column(String(100), nullable=False)
    current_education_level = Column(String(100), nullable=False)
    highest_completed_degree = Column(String(150), nullable=False)
    gpa = Column(Float, nullable=False, default=3.5)
    grading_scale = Column(String(20), default="4.0")
    target_degree = Column(String(50), default="masters")
    field_of_study = Column(String(150), nullable=False)
    target_intake_year = Column(Integer, default=2026)
    expected_graduation_date = Column(String(50), nullable=True)
    
    # JSON-encoded lists & dicts
    preferred_countries_json = Column(Text, default="[]")
    preferred_universities_json = Column(Text, default="[]")
    preferred_study_mode = Column(String(30), default="on_campus")
    preferred_language = Column(String(50), default="English")
    
    language_test_status = Column(String(30), default="taken")
    language_test_type = Column(String(30), nullable=True)
    language_test_score = Column(Float, nullable=True)
    
    funding_need = Column(String(30), default="full_only")
    tuition_waiver_required = Column(Boolean, default=True)
    living_stipend_required = Column(Boolean, default=True)
    travel_grant_preferred = Column(Boolean, default=True)
    application_budget_usd = Column(Float, nullable=True)
    
    has_research_experience = Column(Boolean, default=False)
    publications_count = Column(Integer, default=0)
    years_of_work_experience = Column(Float, default=0.0)
    leadership_extracurricular = Column(Text, default="")
    relevant_skills_json = Column(Text, default="[]")
    profile_completion_percentage = Column(Integer, default=50)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")

    @property
    def preferred_countries(self):
        try:
            return json.loads(self.preferred_countries_json)
        except Exception:
            return []

    @preferred_countries.setter
    def preferred_countries(self, val):
        self.preferred_countries_json = json.dumps(val or [])


class ScholarshipModel(Base):
    __tablename__ = "scholarships"

    id = Column(String(100), primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    provider = Column(String(255), nullable=False, index=True)
    host_university = Column(String(255), nullable=True)
    destination_country = Column(String(100), nullable=False, index=True)
    destination_city = Column(String(100), nullable=True)
    
    # Target criteria & arrays stored as JSON
    eligible_nationalities_json = Column(Text, default="[]")
    target_degrees_json = Column(Text, default="[]")
    eligible_subjects_json = Column(Text, default="[]")
    
    # Complex fields stored as JSON
    academic_requirements_json = Column(Text, default="{}")
    language_requirements_json = Column(Text, default="{}")
    funding_details_json = Column(Text, default="{}")
    required_documents_json = Column(Text, default="[]")
    selection_criteria_json = Column(Text, default="[]")
    application_procedure_json = Column(Text, default="[]")
    tags_json = Column(Text, default="[]")

    application_open_date = Column(String(50), nullable=True)
    application_deadline = Column(String(50), nullable=False, index=True)
    intake_year = Column(Integer, default=2026)
    official_url = Column(String(500), nullable=False)
    source_url = Column(String(500), nullable=False)
    last_verified_at = Column(String(50), nullable=False)
    publication_status = Column(String(30), default="open")
    is_verified_data = Column(Boolean, default=True)
    competitiveness = Column(String(50), default="High")
    overview = Column(Text, nullable=False)


class SavedScholarshipModel(Base):
    __tablename__ = "saved_scholarships"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    scholarship_id = Column(String(100), ForeignKey("scholarships.id"), nullable=False)
    saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_scholarships")
    scholarship = relationship("ScholarshipModel")


class ApplicationModel(Base):
    __tablename__ = "applications"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    scholarship_id = Column(String(100), ForeignKey("scholarships.id"), nullable=False)
    status = Column(String(50), default="interested")
    personal_notes = Column(Text, default="")
    custom_deadline = Column(String(50), nullable=True)
    checklist_json = Column(Text, default="[]")
    applied_date = Column(String(50), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    scholarship = relationship("ScholarshipModel")


class RecommendationFeedbackModel(Base):
    __tablename__ = "recommendation_feedback"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), nullable=False)
    scholarship_id = Column(String(100), nullable=False)
    feedback_type = Column(String(50), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
