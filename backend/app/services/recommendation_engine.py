import math
from datetime import datetime
from typing import List, Dict, Any, Optional
from ..schemas import (
    ScholarshipSchema,
    StudentProfileSchema,
    RecommendationResultSchema,
    RecommendationBreakdown,
    ReasonItem,
    EligibilityStatus
)

DEFAULT_WEIGHTS = {
    "academic": 0.25,
    "degree_level": 0.20,
    "subject": 0.20,
    "destination": 0.15,
    "funding": 0.10,
    "research_experience": 0.10,
}

def normalize_gpa_to_4_scale(gpa: float, scale: str) -> float:
    """Normalizes any grading scale to a 4.0 standard scale for fair comparison."""
    if not gpa or math.isnan(gpa):
        return 0.0
    scale_str = str(scale).strip()
    if scale_str == "5.0":
        return min(4.0, (gpa / 5.0) * 4.0)
    elif scale_str == "10.0":
        return min(4.0, (gpa / 10.0) * 4.0)
    elif scale_str == "100%":
        if gpa >= 90:
            return 4.0
        elif gpa >= 80:
            return 3.5
        elif gpa >= 70:
            return 3.0
        elif gpa >= 60:
            return 2.5
        return 2.0
    else:
        return min(4.0, float(gpa))

def evaluate_deadline_status(deadline_str: str) -> str:
    """Evaluates deadline relative to current date."""
    if not deadline_str:
        return "not_verified"
    try:
        deadline = datetime.strptime(deadline_str, "%Y-%m-%d")
        now = datetime.utcnow()
        diff_days = (deadline - now).days
        if diff_days < 0:
            return "closed"
        elif diff_days <= 30:
            return "closing_soon"
        return "upcoming"
    except Exception:
        return "not_verified"

def evaluate_scholarship_match(
    scholarship: ScholarshipSchema,
    profile: Optional[StudentProfileSchema],
    weights: Optional[Dict[str, float]] = None
) -> RecommendationResultSchema:
    """Core Hybrid Recommendation Pipeline (Layers 1-3)."""
    if weights is None:
        weights = DEFAULT_WEIGHTS

    # If no profile exists, return neutral unpersonalized preview
    if not profile:
        return RecommendationResultSchema(
            scholarship=scholarship,
            match_score=50,
            eligibility_status="needs_verification",
            breakdown=RecommendationBreakdown(
                academic_compatibility=50.0,
                degree_level_compatibility=50.0,
                subject_relevance=50.0,
                destination_preference=50.0,
                funding_preference=50.0,
                research_experience_relevance=50.0,
                deadline_suitability=50.0,
            ),
            why_it_matches=["Complete your profile to see personalized eligibility and rank."],
            missing_requirements=["Student profile not provided"],
            failed_mandatory_requirements=[],
            deadline_status=evaluate_deadline_status(scholarship.application_deadline),
            normalized_reasons=[],
        )

    why_it_matches: List[str] = []
    missing_requirements: List[str] = []
    failed_requirements: List[str] = []

    # -------------------------------------------------------------
    # LAYER 1: Hard Eligibility Engine
    # -------------------------------------------------------------
    hard_failed = False

    # 1. Degree Level Check
    degree_matches = profile.target_degree in scholarship.target_degrees
    if not degree_matches:
        hard_failed = True
        failed_requirements.append(
            f"Degree Level Mismatch: This award is for {', '.join([d.upper() for d in scholarship.target_degrees])}, "
            f"but your goal is {profile.target_degree.upper()}."
        )
    else:
        why_it_matches.append(
            f"Target degree ({profile.target_degree.upper()}) directly matches scholarship offering."
        )

    # 2. Minimum GPA / Academic Requirement Check
    normalized_user_gpa = normalize_gpa_to_4_scale(profile.gpa, profile.grading_scale)
    min_gpa = scholarship.academic_requirements.min_gpa
    academic_score = 70.0

    if min_gpa is not None:
        if normalized_user_gpa < min_gpa:
            hard_failed = True
            failed_requirements.append(
                f"Academic Threshold: Requires minimum {min_gpa}/4.0 (your normalized GPA: {normalized_user_gpa:.2f})."
            )
            academic_score = max(10.0, round((normalized_user_gpa / min_gpa) * 60.0, 1))
        else:
            academic_score = min(100.0, round(80.0 + (normalized_user_gpa - min_gpa) * 40.0, 1))
            why_it_matches.append(
                f"Academic qualification ({normalized_user_gpa:.2f}/4.0) satisfies minimum requirement ({min_gpa}/4.0)."
            )
    else:
        why_it_matches.append("Academic criteria evaluated qualitatively on application strength.")

    # 3. Language Test Verification
    if scholarship.language_requirements.min_ielts:
        if profile.language_test_status == "taken" and profile.language_test_type == "IELTS":
            score = profile.language_test_score or 0.0
            if score >= scholarship.language_requirements.min_ielts:
                why_it_matches.append(
                    f"Verified IELTS score ({score}) meets minimum required ({scholarship.language_requirements.min_ielts})."
                )
            else:
                missing_requirements.append(
                    f"Current IELTS ({score}) is below requested ({scholarship.language_requirements.min_ielts}), though waivers or retakes may apply."
                )
        elif profile.language_test_status == "exempt":
            why_it_matches.append("English test waiver indicated by your prior English-medium instruction.")
        else:
            missing_requirements.append(
                f"Language proficiency certificate ({'/'.join(scholarship.language_requirements.accepted_tests)}) remains unverified in your profile."
            )

    # 4. Destination Country Alignment
    destination_score = 50.0
    prefers_destination = any(
        c.lower() == scholarship.destination_country.lower() or scholarship.destination_country.lower() in c.lower()
        for c in profile.preferred_countries
    )
    if prefers_destination:
        destination_score = 100.0
        why_it_matches.append(f"Matches your target destination country ({scholarship.destination_country}).")
    elif not profile.preferred_countries:
        destination_score = 70.0
    else:
        destination_score = 35.0

    # 5. Subject / Discipline Alignment
    subject_score = 50.0
    user_field = profile.field_of_study.lower()
    subject_found = any(
        "all" in s.lower() or s.lower() in user_field or user_field in s.lower()
        for s in scholarship.eligible_subjects
    )
    if subject_found:
        subject_score = 100.0
        why_it_matches.append(f"Eligible discipline aligns with your field of study ({profile.field_of_study}).")
    else:
        subject_score = 40.0
        missing_requirements.append(f"Field '{profile.field_of_study}' should be cross-checked against eligible host faculties.")

    # 6. Funding Alignment
    funding_score = 80.0
    if profile.funding_need == "full_only":
        if scholarship.funding_details.funding_type == "fully_funded":
            funding_score = 100.0
            why_it_matches.append("Full funding package includes 100% tuition waiver and living stipend.")
        else:
            funding_score = 45.0
            missing_requirements.append("Award provides partial funding; external top-ups may be required for full cost coverage.")
    else:
        funding_score = 90.0
        why_it_matches.append("Funding structure aligns with your financial criteria.")

    # 7. Research Experience Alignment
    research_score = 60.0
    is_research_degree = "phd" in scholarship.target_degrees
    if is_research_degree:
        if profile.has_research_experience or profile.publications_count > 0:
            research_score = 95.0
            why_it_matches.append("Research background and publications boost standing for this research-intensive award.")
        else:
            research_score = 40.0
            missing_requirements.append("Strong research proposal and prior academic laboratory project documentation needed.")
    else:
        research_score = 75.0
        if profile.years_of_work_experience >= 2.0:
            why_it_matches.append(f"Demonstrated {profile.years_of_work_experience}+ years work experience fulfills leadership criteria.")

    # 8. Deadline Suitability
    deadline_status = evaluate_deadline_status(scholarship.application_deadline)
    deadline_score = 85.0
    if deadline_status == "closed":
        deadline_score = 20.0
        missing_requirements.append("Current application cycle is closed. Monitor for next intake.")
    elif deadline_status == "closing_soon":
        deadline_score = 90.0
        why_it_matches.append("Active application round closing soon — prioritize documentation.")

    # -------------------------------------------------------------
    # LAYER 2 & 3: Ranking Engine & Normalization
    # -------------------------------------------------------------
    breakdown = RecommendationBreakdown(
        academic_compatibility=academic_score,
        degree_level_compatibility=100.0 if degree_matches else 15.0,
        subject_relevance=subject_score,
        destination_preference=destination_score,
        funding_preference=funding_score,
        research_experience_relevance=research_score,
        deadline_suitability=deadline_score,
    )

    raw_weighted_score = (
        breakdown.academic_compatibility * weights["academic"] +
        breakdown.degree_level_compatibility * weights["degree_level"] +
        breakdown.subject_relevance * weights["subject"] +
        breakdown.destination_preference * weights["destination"] +
        breakdown.funding_preference * weights["funding"] +
        breakdown.research_experience_relevance * weights["research_experience"]
    )

    final_match_score = round(raw_weighted_score)

    # Disqualifying conditions strictly cap match score
    if hard_failed:
        final_match_score = min(39, round(raw_weighted_score * 0.4))

    # Determine eligibility status
    if hard_failed:
        eligibility_status: EligibilityStatus = "ineligible"
    elif len(missing_requirements) > 1 or profile.profile_completion_percentage < 60:
        eligibility_status = "needs_verification"
    elif len(missing_requirements) == 1:
        eligibility_status = "potentially_eligible"
    else:
        eligibility_status = "eligible"

    normalized_reasons = [
        ReasonItem(factor="Academic Merit", score=academic_score, description=f"{normalized_user_gpa:.2f}/4.0 normalized GPA"),
        ReasonItem(factor="Subject Alignment", score=subject_score, description=profile.field_of_study),
        ReasonItem(factor="Destination Match", score=destination_score, description=scholarship.destination_country),
        ReasonItem(factor="Funding Match", score=funding_score, description=scholarship.funding_details.funding_type.replace('_', ' ')),
        ReasonItem(factor="Research Readiness", score=research_score, description="Research experienced" if profile.has_research_experience else "Standard academic track"),
    ]

    return RecommendationResultSchema(
        scholarship=scholarship,
        match_score=max(10, min(99, final_match_score)),
        eligibility_status=eligibility_status,
        breakdown=breakdown,
        why_it_matches=why_it_matches,
        missing_requirements=missing_requirements,
        failed_mandatory_requirements=failed_requirements,
        deadline_status=deadline_status,
        normalized_reasons=normalized_reasons,
    )

def rank_scholarships_for_profile(
    scholarships: List[ScholarshipSchema],
    profile: Optional[StudentProfileSchema],
    weights: Optional[Dict[str, float]] = None
) -> List[RecommendationResultSchema]:
    """Batch rank scholarships with sorting."""
    evaluated = [evaluate_scholarship_match(s, profile, weights) for s in scholarships]

    def sort_key(rec: RecommendationResultSchema):
        # Eligible & potentially eligible appear before ineligible
        is_ineligible = 1 if rec.eligibility_status == "ineligible" else 0
        return (is_ineligible, -rec.match_score)

    return sorted(evaluated, key=sort_key)
