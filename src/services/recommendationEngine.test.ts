import { 
  normalizeGpaTo4Scale, 
  evaluateScholarshipMatch, 
  rankScholarshipsForProfile 
} from './recommendationEngine';
import { SCHOLARSHIPS_DATA } from '../data/scholarships';
import { StudentProfile } from '../types';

export function runRecommendationEngineTests() {
  console.log('--- Starting Recommendation Engine Unit Tests ---');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${testName}`);
    }
  }

  // Test 1: GPA Normalization
  assert(normalizeGpaTo4Scale(3.8, '4.0') === 3.8, 'Normalizes 4.0 scale accurately');
  assert(normalizeGpaTo4Scale(4.5, '5.0') === 3.6, 'Normalizes 5.0 scale to 3.6');
  assert(normalizeGpaTo4Scale(8.5, '10.0') === 3.4, 'Normalizes 10.0 scale to 3.4');
  assert(normalizeGpaTo4Scale(92, '100%') === 4.0, 'Normalizes 92% to 4.0');

  // Test 2: Ineligible degree level rejection (Hard Rule)
  const bachelorsStudent: StudentProfile = {
    user_id: 'test_ug',
    full_name: 'Test UG',
    citizenship: 'Nigeria',
    residence_country: 'Nigeria',
    current_education_level: 'High School',
    highest_completed_degree: 'High School Diploma',
    gpa: 3.9,
    grading_scale: '4.0',
    target_degree: 'bachelors', // Undergraduate degree
    field_of_study: 'Computer Science',
    target_intake_year: 2026,
    preferred_countries: ['United Kingdom'],
    preferred_universities: [],
    preferred_study_mode: 'on_campus',
    preferred_language: 'English',
    language_test_status: 'taken',
    funding_need: 'full_only',
    tuition_waiver_required: true,
    living_stipend_required: true,
    travel_grant_preferred: true,
    has_research_experience: false,
    publications_count: 0,
    years_of_work_experience: 0,
    leadership_extracurricular: '',
    relevant_skills: [],
    profile_completion_percentage: 90,
    updated_at: new Date().toISOString(),
  };

  const cheveningScholarship = SCHOLARSHIPS_DATA.find(s => s.id === 'chevening-uk-2025')!;
  const cheveningResult = evaluateScholarshipMatch(cheveningScholarship, bachelorsStudent);

  assert(
    cheveningResult.eligibility_status === 'ineligible',
    'Hard rule: Chevening (Master-only) strictly classifies Bachelor student as ineligible'
  );
  assert(
    cheveningResult.failed_mandatory_requirements.length > 0,
    'Hard rule: Failed mandatory requirement list is populated with degree mismatch explanation'
  );
  assert(
    cheveningResult.match_score < 40,
    'Hard rule: Disqualifying criterion caps match score below 40 even with high GPA'
  );

  // Test 3: High match for qualified master applicant
  const mastersStudent: StudentProfile = {
    ...bachelorsStudent,
    highest_completed_degree: 'Bachelor of Science',
    target_degree: 'masters',
    gpa: 3.8,
    years_of_work_experience: 3.0,
    language_test_score: 7.5,
    language_test_type: 'IELTS'
  };

  const mastersResult = evaluateScholarshipMatch(cheveningScholarship, mastersStudent);
  assert(
    mastersResult.eligibility_status === 'eligible',
    'Eligible candidate receives status "eligible"'
  );
  assert(
    mastersResult.match_score >= 85,
    `Qualified candidate receives high match score (scored: ${mastersResult.match_score})`
  );
  assert(
    mastersResult.why_it_matches.length >= 3,
    'Provides multi-criteria explanation why it matches'
  );

  // Test 4: Missing profile data handles gracefully
  const emptyResult = evaluateScholarshipMatch(cheveningScholarship, null);
  assert(
    emptyResult.eligibility_status === 'needs_verification',
    'Null profile returns "needs_verification" without crashing'
  );

  // Test 5: Batch ranking ordering
  const ranked = rankScholarshipsForProfile(SCHOLARSHIPS_DATA, mastersStudent);
  assert(ranked.length === SCHOLARSHIPS_DATA.length, 'All scholarships evaluated in batch ranking');
  assert(ranked[0].match_score >= ranked[ranked.length - 1].match_score, 'Ranked descending by match score');

  console.log(`--- Unit Tests Completed: ${passed}/${total} Passed ---`);
  return { passed, total };
}
