import { 
  Scholarship, 
  StudentProfile, 
  RecommendationResult, 
  EligibilityStatus, 
  RecommendationBreakdown 
} from '../types';

export interface ScoringWeights {
  academic: number;
  degreeLevel: number;
  subject: number;
  destination: number;
  funding: number;
  researchExperience: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  academic: 0.25,
  degreeLevel: 0.20,
  subject: 0.20,
  destination: 0.15,
  funding: 0.10,
  researchExperience: 0.10,
};

/**
 * Normalizes any grading scale to a 4.0 standard scale for fair comparison
 */
export function normalizeGpaTo4Scale(gpa: number, scale: string): number {
  if (!gpa || isNaN(gpa)) return 0;
  switch (scale) {
    case '5.0':
      return Math.min(4.0, (gpa / 5.0) * 4.0);
    case '10.0':
      return Math.min(4.0, (gpa / 10.0) * 4.0);
    case '100%':
      if (gpa >= 90) return 4.0;
      if (gpa >= 80) return 3.5;
      if (gpa >= 70) return 3.0;
      if (gpa >= 60) return 2.5;
      return 2.0;
    case '4.0':
    default:
      return Math.min(4.0, gpa);
  }
}

/**
 * Checks deadline status
 */
export function evaluateDeadlineStatus(deadlineStr: string): 'upcoming' | 'closing_soon' | 'closed' | 'not_verified' {
  if (!deadlineStr) return 'not_verified';
  const deadline = new Date(deadlineStr);
  if (isNaN(deadline.getTime())) return 'not_verified';
  
  const now = new Date();
  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'closed';
  if (diffDays <= 30) return 'closing_soon';
  return 'upcoming';
}

/**
 * Core Hybrid Recommendation Pipeline (Layers 1-3)
 */
export function evaluateScholarshipMatch(
  scholarship: Scholarship,
  profile: StudentProfile | null,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): RecommendationResult {
  // If no profile exists, return neutral unpersonalized preview
  if (!profile) {
    return {
      scholarship,
      match_score: 50,
      eligibility_status: 'needs_verification',
      breakdown: {
        academic_compatibility: 50,
        degree_level_compatibility: 50,
        subject_relevance: 50,
        destination_preference: 50,
        funding_preference: 50,
        research_experience_relevance: 50,
        deadline_suitability: 50,
      },
      why_it_matches: ['Complete your profile to see personalized eligibility and rank.'],
      missing_requirements: ['Student profile not provided'],
      failed_mandatory_requirements: [],
      deadline_status: evaluateDeadlineStatus(scholarship.application_deadline),
      normalized_reasons: []
    };
  }

  const whyItMatches: string[] = [];
  const missingRequirements: string[] = [];
  const failedRequirements: string[] = [];

  // -------------------------------------------------------------
  // LAYER 1: Hard Eligibility Engine
  // -------------------------------------------------------------
  let hardFailed = false;

  // 1. Degree Level Check
  const degreeMatches = scholarship.target_degrees.includes(profile.target_degree);
  if (!degreeMatches) {
    hardFailed = true;
    failedRequirements.push(
      `Degree Level Mismatch: This award is for ${scholarship.target_degrees.map(d => d.toUpperCase()).join(', ')}, but your goal is ${profile.target_degree.toUpperCase()}.`
    );
  } else {
    whyItMatches.push(`Target degree (${profile.target_degree.toUpperCase()}) directly matches scholarship offering.`);
  }

  // 2. Minimum GPA / Academic Requirement Check
  const normalizedUserGpa = normalizeGpaTo4Scale(profile.gpa, profile.grading_scale);
  const minGpa = scholarship.academic_requirements.min_gpa;
  let academicScore = 70;

  if (minGpa !== undefined) {
    if (normalizedUserGpa < minGpa) {
      hardFailed = true;
      failedRequirements.push(
        `Academic Threshold: Requires minimum ${minGpa}/4.0 (your normalized GPA: ${normalizedUserGpa.toFixed(2)}).`
      );
      academicScore = Math.max(10, Math.round((normalizedUserGpa / minGpa) * 60));
    } else {
      academicScore = Math.min(100, Math.round(80 + (normalizedUserGpa - minGpa) * 40));
      whyItMatches.push(
        `Academic qualification (${normalizedUserGpa.toFixed(2)}/4.0) satisfies minimum requirement (${minGpa}/4.0).`
      );
    }
  } else {
    whyItMatches.push(`Academic criteria evaluated qualitatively on application strength.`);
  }

  // 3. Language Test Verification
  if (scholarship.language_requirements.min_ielts) {
    if (profile.language_test_status === 'taken' && profile.language_test_type === 'IELTS') {
      const score = profile.language_test_score || 0;
      if (score >= scholarship.language_requirements.min_ielts) {
        whyItMatches.push(`Verified IELTS score (${score}) meets minimum required (${scholarship.language_requirements.min_ielts}).`);
      } else {
        missingRequirements.push(
          `Current IELTS (${score}) is below requested (${scholarship.language_requirements.min_ielts}), though waivers or retakes may apply.`
        );
      }
    } else if (profile.language_test_status === 'exempt') {
      whyItMatches.push(`English test waiver indicated by your prior English-medium instruction.`);
    } else {
      missingRequirements.push(
        `Language proficiency certificate (${scholarship.language_requirements.accepted_tests.join('/')}) remains unverified in your profile.`
      );
    }
  }

  // 4. Destination Country Alignment
  let destinationScore = 50;
  const prefersDestination = profile.preferred_countries.some(
    c => c.toLowerCase() === scholarship.destination_country.toLowerCase() ||
         scholarship.destination_country.toLowerCase().includes(c.toLowerCase())
  );
  if (prefersDestination) {
    destinationScore = 100;
    whyItMatches.push(`Matches your target destination country (${scholarship.destination_country}).`);
  } else if (profile.preferred_countries.length === 0) {
    destinationScore = 70;
  } else {
    destinationScore = 35;
  }

  // 5. Subject / Discipline Alignment
  let subjectScore = 50;
  const userField = profile.field_of_study.toLowerCase();
  const subjectFound = scholarship.eligible_subjects.some(
    s => s.toLowerCase().includes('all') ||
         s.toLowerCase().includes(userField) ||
         userField.includes(s.toLowerCase())
  );
  if (subjectFound) {
    subjectScore = 100;
    whyItMatches.push(`Eligible discipline aligns with your field of study (${profile.field_of_study}).`);
  } else {
    subjectScore = 40;
    missingRequirements.push(`Field '${profile.field_of_study}' should be cross-checked against eligible host faculties.`);
  }

  // 6. Funding Alignment
  let fundingScore = 80;
  if (profile.funding_need === 'full_only') {
    if (scholarship.funding_details.funding_type === 'fully_funded') {
      fundingScore = 100;
      whyItMatches.push(`Full funding package includes 100% tuition waiver and living stipend.`);
    } else {
      fundingScore = 45;
      missingRequirements.push(`Award provides partial funding; external top-ups may be required for full cost coverage.`);
    }
  } else {
    fundingScore = 90;
    whyItMatches.push(`Funding structure aligns with your financial criteria.`);
  }

  // 7. Research Experience Alignment
  let researchScore = 60;
  const isResearchDegree = scholarship.target_degrees.includes('phd');
  if (isResearchDegree) {
    if (profile.has_research_experience || profile.publications_count > 0) {
      researchScore = 95;
      whyItMatches.push(`Research background and publications boost standing for this research-intensive award.`);
    } else {
      researchScore = 40;
      missingRequirements.push(`Strong research proposal and prior academic laboratory project documentation needed.`);
    }
  } else {
    researchScore = 75;
    if (profile.years_of_work_experience >= 2) {
      whyItMatches.push(`Demonstrated ${profile.years_of_work_experience}+ years work experience fulfills leadership criteria.`);
    }
  }

  // 8. Deadline Suitability
  const deadlineStatus = evaluateDeadlineStatus(scholarship.application_deadline);
  let deadlineScore = 85;
  if (deadlineStatus === 'closed') {
    deadlineScore = 20;
    missingRequirements.push(`Current application cycle is closed. Monitor for next intake.`);
  } else if (deadlineStatus === 'closing_soon') {
    deadlineScore = 90;
    whyItMatches.push(`Active application round closing soon — prioritize documentation.`);
  }

  // -------------------------------------------------------------
  // LAYER 2 & 3: Ranking Engine & Normalization
  // -------------------------------------------------------------
  const breakdown: RecommendationBreakdown = {
    academic_compatibility: academicScore,
    degree_level_compatibility: degreeMatches ? 100 : 15,
    subject_relevance: subjectScore,
    destination_preference: destinationScore,
    funding_preference: fundingScore,
    research_experience_relevance: researchScore,
    deadline_suitability: deadlineScore,
  };

  const rawWeightedScore = 
    breakdown.academic_compatibility * weights.academic +
    breakdown.degree_level_compatibility * weights.degreeLevel +
    breakdown.subject_relevance * weights.subject +
    breakdown.destination_preference * weights.destination +
    breakdown.funding_preference * weights.funding +
    breakdown.research_experience_relevance * weights.researchExperience;

  // Final score clamping
  let finalMatchScore = Math.round(rawWeightedScore);
  
  // Important Requirement: Hard disqualifying requirements must NOT be overridden by a high preference score.
  if (hardFailed) {
    // Heavily penalize score if hard criteria failed
    finalMatchScore = Math.min(39, Math.round(rawWeightedScore * 0.4));
  }

  // Determine Eligibility Status
  let eligibilityStatus: EligibilityStatus = 'eligible';
  if (hardFailed) {
    eligibilityStatus = 'ineligible';
  } else if (missingRequirements.length > 1 || profile.profile_completion_percentage < 60) {
    eligibilityStatus = 'needs_verification';
  } else if (missingRequirements.length === 1) {
    eligibilityStatus = 'potentially_eligible';
  } else {
    eligibilityStatus = 'eligible';
  }

  const normalizedReasons = [
    { factor: 'Academic Merit', score: academicScore, description: `${normalizedUserGpa.toFixed(2)}/4.0 normalized GPA` },
    { factor: 'Subject Alignment', score: subjectScore, description: profile.field_of_study },
    { factor: 'Destination Match', score: destinationScore, description: scholarship.destination_country },
    { factor: 'Funding Match', score: fundingScore, description: scholarship.funding_details.funding_type.replace('_', ' ') },
    { factor: 'Research Readiness', score: researchScore, description: profile.has_research_experience ? 'Research experienced' : 'Standard academic track' },
  ];

  return {
    scholarship,
    match_score: Math.max(10, Math.min(99, finalMatchScore)),
    eligibility_status: eligibilityStatus,
    breakdown,
    why_it_matches: whyItMatches,
    missing_requirements: missingRequirements,
    failed_mandatory_requirements: failedRequirements,
    deadline_status: deadlineStatus,
    normalized_reasons: normalizedReasons,
  };
}

/**
 * Batch rank scholarships with sorting
 */
export function rankScholarshipsForProfile(
  scholarships: Scholarship[],
  profile: StudentProfile | null,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): RecommendationResult[] {
  const evaluated = scholarships.map(sch => evaluateScholarshipMatch(sch, profile, weights));

  // Sort primarily by match score descending, placing verified eligible/potentially eligible ahead of ineligible
  return evaluated.sort((a, b) => {
    if (a.eligibility_status === 'ineligible' && b.eligibility_status !== 'ineligible') return 1;
    if (a.eligibility_status !== 'ineligible' && b.eligibility_status === 'ineligible') return -1;
    return b.match_score - a.match_score;
  });
}
