export type DegreeLevel = 'bachelors' | 'masters' | 'phd' | 'postdoc' | 'short_course';

export type FundingType = 'fully_funded' | 'partially_funded' | 'tuition_waiver';

export type EligibilityStatus = 
  | 'eligible' 
  | 'potentially_eligible' 
  | 'ineligible' 
  | 'needs_verification';

export type ApplicationStage = 
  | 'interested'
  | 'planning_to_apply'
  | 'preparing_documents'
  | 'ready_to_submit'
  | 'applied'
  | 'interview_assessment'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  created_at: string;
}

export interface StudentProfile {
  user_id: string;
  full_name: string;
  citizenship: string;
  residence_country: string;
  current_education_level: string;
  highest_completed_degree: string;
  gpa: number;
  grading_scale: '4.0' | '5.0' | '10.0' | '100%' | 'other';
  target_degree: DegreeLevel;
  field_of_study: string;
  target_intake_year: number;
  expected_graduation_date?: string;
  preferred_countries: string[];
  preferred_universities: string[];
  preferred_study_mode: 'on_campus' | 'hybrid' | 'online';
  preferred_language: string;
  language_test_status: 'none' | 'taken' | 'planning_to_take' | 'exempt';
  language_test_type?: 'IELTS' | 'TOEFL' | 'Duolingo' | 'PTE';
  language_test_score?: number;
  funding_need: 'full_only' | 'partial_acceptable' | 'flexible';
  tuition_waiver_required: boolean;
  living_stipend_required: boolean;
  travel_grant_preferred: boolean;
  application_budget_usd?: number;
  has_research_experience: boolean;
  publications_count: number;
  years_of_work_experience: number;
  leadership_extracurricular: string;
  relevant_skills: string[];
  profile_completion_percentage: number;
  updated_at: string;
}

export interface AcademicRequirement {
  min_gpa?: number;
  grading_scale?: string;
  required_degree?: string;
  subject_restrictions?: string[];
  description: string;
}

export interface LanguageRequirement {
  accepted_tests: string[];
  min_ielts?: number;
  min_toefl?: number;
  is_waivable: boolean;
  waiver_conditions?: string;
  description: string;
}

export interface FundingDetails {
  funding_type: FundingType;
  tuition_coverage_percent: number; // e.g. 100
  monthly_stipend_amount?: number;
  monthly_stipend_currency?: string;
  living_stipend_details: string;
  travel_allowance_details?: string;
  health_insurance_covered: boolean;
  accommodation_provided: boolean;
  visa_fee_covered?: boolean;
  other_allowances?: string;
  estimated_annual_value_usd?: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  required: boolean;
  description?: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string; // e.g., UK FCDO, IIE, DAAD
  host_university?: string;
  destination_country: string;
  destination_city?: string;
  eligible_nationalities: string[]; // e.g. ["All except UK", "Developing Countries", "Worldwide"]
  target_degrees: DegreeLevel[];
  eligible_subjects: string[]; // e.g. ["Engineering", "Public Policy", "Computer Science", "All Subjects"]
  academic_requirements: AcademicRequirement;
  language_requirements: LanguageRequirement;
  funding_details: FundingDetails;
  application_open_date: string;
  application_deadline: string;
  intake_year: number;
  official_url: string;
  source_url: string;
  last_verified_at: string;
  publication_status: 'open' | 'closing_soon' | 'closed' | 'archived';
  is_verified_data: boolean; // clearly distinguishes verified from demo records
  selection_criteria: string[];
  application_procedure: string[];
  required_documents: DocumentItem[];
  overview: string;
  competitiveness: 'Extremely High' | 'High' | 'Moderate';
  tags: string[];
}

export interface RecommendationBreakdown {
  academic_compatibility: number; // 0-100
  degree_level_compatibility: number;
  subject_relevance: number;
  destination_preference: number;
  funding_preference: number;
  research_experience_relevance: number;
  deadline_suitability: number;
}

export interface RecommendationResult {
  scholarship: Scholarship;
  match_score: number; // 0 - 100 normalized score
  eligibility_status: EligibilityStatus;
  breakdown: RecommendationBreakdown;
  why_it_matches: string[];
  missing_requirements: string[];
  failed_mandatory_requirements: string[];
  deadline_status: 'upcoming' | 'closing_soon' | 'closed' | 'not_verified';
  normalized_reasons: {
    factor: string;
    score: number;
    description: string;
  }[];
}

export interface ApplicationTrackerItem {
  id: string;
  scholarship_id: string;
  scholarship: Scholarship;
  status: ApplicationStage;
  personal_notes: string;
  custom_deadline?: string;
  checklist: {
    id: string;
    label: string;
    completed: boolean;
  }[];
  applied_date?: string;
  updated_at: string;
}

export interface RecommendationFeedback {
  id: string;
  scholarship_id: string;
  user_id: string;
  feedback_type: 'accurate_match' | 'not_relevant' | 'ineligible_reason_missed' | 'applied_already';
  notes?: string;
  created_at: string;
}

export interface FilterState {
  searchQuery: string;
  destinationCountry: string;
  degreeLevel: string;
  subject: string;
  fundingType: string;
  minGpa: number | null;
  requiresStipend: boolean;
  requiresFullTuition: boolean;
  sortBy: 'deadline' | 'match_score' | 'title' | 'stipend';
  viewMode: 'grid' | 'list';
  onlyOpen: boolean;
}
