from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

DegreeLevel = Literal['bachelors', 'masters', 'phd', 'postdoc', 'short_course']
FundingType = Literal['fully_funded', 'partially_funded', 'tuition_waiver']
EligibilityStatus = Literal['eligible', 'potentially_eligible', 'ineligible', 'needs_verification']
ApplicationStage = Literal[
    'interested',
    'planning_to_apply',
    'preparing_documents',
    'ready_to_submit',
    'applied',
    'interview_assessment',
    'accepted',
    'rejected',
    'withdrawn'
]

class AcademicRequirement(BaseModel):
    min_gpa: Optional[float] = None
    grading_scale: Optional[str] = "4.0"
    required_degree: Optional[str] = None
    subject_restrictions: Optional[List[str]] = None
    description: str = ""

class LanguageRequirement(BaseModel):
    accepted_tests: List[str] = []
    min_ielts: Optional[float] = None
    min_toefl: Optional[float] = None
    is_waivable: bool = False
    waiver_conditions: Optional[str] = None
    description: str = ""

class FundingDetails(BaseModel):
    funding_type: FundingType = "fully_funded"
    tuition_coverage_percent: int = 100
    monthly_stipend_amount: Optional[float] = None
    monthly_stipend_currency: Optional[str] = None
    living_stipend_details: str = ""
    travel_allowance_details: Optional[str] = None
    health_insurance_covered: bool = True
    accommodation_provided: bool = False
    visa_fee_covered: Optional[bool] = None
    other_allowances: Optional[str] = None
    estimated_annual_value_usd: Optional[float] = None

class DocumentItem(BaseModel):
    id: str
    name: str
    required: bool
    description: Optional[str] = None

class ScholarshipSchema(BaseModel):
    id: str
    title: str
    provider: str
    host_university: Optional[str] = None
    destination_country: str
    destination_city: Optional[str] = None
    eligible_nationalities: List[str] = []
    target_degrees: List[DegreeLevel] = []
    eligible_subjects: List[str] = []
    academic_requirements: AcademicRequirement
    language_requirements: LanguageRequirement
    funding_details: FundingDetails
    application_open_date: Optional[str] = None
    application_deadline: str
    intake_year: int = 2026
    official_url: str
    source_url: str
    last_verified_at: str
    publication_status: Literal['open', 'closing_soon', 'closed', 'archived'] = 'open'
    is_verified_data: bool = True
    selection_criteria: List[str] = []
    application_procedure: List[str] = []
    required_documents: List[DocumentItem] = []
    overview: str
    competitiveness: Literal['Extremely High', 'High', 'Moderate'] = 'High'
    tags: List[str] = []

class StudentProfileSchema(BaseModel):
    user_id: Optional[str] = "guest"
    full_name: str = ""
    citizenship: str = ""
    residence_country: str = ""
    current_education_level: str = "Bachelor Degree"
    highest_completed_degree: str = "Bachelor of Science"
    gpa: float = 3.5
    grading_scale: Literal['4.0', '5.0', '10.0', '100%', 'other'] = "4.0"
    target_degree: DegreeLevel = "masters"
    field_of_study: str = ""
    target_intake_year: int = 2026
    expected_graduation_date: Optional[str] = None
    preferred_countries: List[str] = []
    preferred_universities: List[str] = []
    preferred_study_mode: Literal['on_campus', 'hybrid', 'online'] = "on_campus"
    preferred_language: str = "English"
    language_test_status: Literal['none', 'taken', 'planning_to_take', 'exempt'] = "taken"
    language_test_type: Optional[Literal['IELTS', 'TOEFL', 'Duolingo', 'PTE']] = "IELTS"
    language_test_score: Optional[float] = None
    funding_need: Literal['full_only', 'partial_acceptable', 'flexible'] = "full_only"
    tuition_waiver_required: bool = True
    living_stipend_required: bool = True
    travel_grant_preferred: bool = True
    application_budget_usd: Optional[float] = None
    has_research_experience: bool = False
    publications_count: int = 0
    years_of_work_experience: float = 0.0
    leadership_extracurricular: str = ""
    relevant_skills: List[str] = []
    profile_completion_percentage: int = 50
    updated_at: Optional[str] = None

class RecommendationBreakdown(BaseModel):
    academic_compatibility: float
    degree_level_compatibility: float
    subject_relevance: float
    destination_preference: float
    funding_preference: float
    research_experience_relevance: float
    deadline_suitability: float

class ReasonItem(BaseModel):
    factor: str
    score: float
    description: str

class RecommendationResultSchema(BaseModel):
    scholarship: ScholarshipSchema
    match_score: int
    eligibility_status: EligibilityStatus
    breakdown: RecommendationBreakdown
    why_it_matches: List[str]
    missing_requirements: List[str]
    failed_mandatory_requirements: List[str]
    deadline_status: Literal['upcoming', 'closing_soon', 'closed', 'not_verified']
    normalized_reasons: List[ReasonItem]

class MatchRequest(BaseModel):
    scholarship_id: str
    profile: Optional[StudentProfileSchema] = None

class BatchRankRequest(BaseModel):
    scholarship_ids: Optional[List[str]] = None
    profile: Optional[StudentProfileSchema] = None

class ChecklistItem(BaseModel):
    id: str
    label: str
    completed: bool = False

class ApplicationTrackerItemSchema(BaseModel):
    id: str
    scholarship_id: str
    scholarship: Optional[ScholarshipSchema] = None
    status: ApplicationStage = "interested"
    personal_notes: str = ""
    custom_deadline: Optional[str] = None
    checklist: List[ChecklistItem] = []
    applied_date: Optional[str] = None
    updated_at: Optional[str] = None

class FeedbackCreate(BaseModel):
    scholarship_id: str
    feedback_type: Literal['accurate_match', 'not_relevant', 'ineligible_reason_missed', 'applied_already']
    notes: Optional[str] = None
