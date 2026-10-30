import { Scholarship, StudentProfile, RecommendationResult, RecommendationFeedback, ApplicationTrackerItem } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Checks if the FastAPI backend service is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(1500) });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}

/**
 * Fetch scholarships from the backend API
 */
export async function fetchScholarshipsApi(query?: string, country?: string, degree?: string, funding?: string): Promise<Scholarship[] | null> {
  try {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (country) params.set('country', country);
    if (degree) params.set('degree', degree);
    if (funding) params.set('funding', funding);

    const res = await fetch(`${API_BASE_URL}/scholarships?${params.toString()}`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Request recommendation ranking from the backend ML engine
 */
export async function fetchRecommendationRankApi(profile: StudentProfile | null): Promise<RecommendationResult[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/recommendations/rank`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Submit candidate feedback to the backend ML calibration queue
 */
export async function submitFeedbackApi(scholarshipId: string, feedbackType: RecommendationFeedback['feedback_type'], notes?: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/recommendations/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scholarship_id: scholarshipId,
        feedback_type: feedbackType,
        notes,
      }),
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
