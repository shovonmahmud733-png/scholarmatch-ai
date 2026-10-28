import React, { useState } from 'react';
import { RecommendationResult, RecommendationFeedback } from '../../types';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle,
  ShieldAlert,
  Info
} from 'lucide-react';
import { EligibilityBadge } from '../common/EligibilityBadge';
import { MatchScoreGauge } from './MatchScoreGauge';
import { useApp } from '../../context/AppContext';

interface Props {
  recommendation: RecommendationResult | null;
  onClose: () => void;
}

export const RecommendationExplanationModal: React.FC<Props> = ({ 
  recommendation, 
  onClose 
}) => {
  const { submitFeedback } = useApp();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState<string | null>(null);

  if (!recommendation) return null;

  const { scholarship, match_score, eligibility_status, breakdown, why_it_matches, missing_requirements, failed_mandatory_requirements } = recommendation;

  const handleFeedback = (type: RecommendationFeedback['feedback_type']) => {
    submitFeedback(scholarship.id, type);
    setFeedbackType(type);
    setFeedbackSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Recommendation Rationale & Breakdown</span>
          </div>

          <h3 className="text-xl font-bold pr-8 leading-snug">
            {scholarship.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {scholarship.provider} • {scholarship.destination_country}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400">Calculated Match:</span>
              <span className="text-base font-extrabold text-emerald-400">{match_score}%</span>
            </div>
            <EligibilityBadge status={eligibility_status} size="md" />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Transparent Notice */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Algorithmic Integrity Notice:</strong> A match score measures profile compatibility against published eligibility parameters. It is <em>never</em> a guarantee of admission or award. Hard disqualifying conditions strictly prevent high rankings.
            </div>
          </div>

          {/* Hard Disqualifying Failures (if any) */}
          {failed_mandatory_requirements.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wide">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Disqualifying Criterion Detected</span>
              </div>
              <ul className="space-y-1.5 text-xs text-rose-900 pl-6 list-disc">
                {failed_mandatory_requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Why it matches */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Why This Matches Your Profile</span>
            </h4>
            <div className="space-y-2">
              {why_it_matches.map((point, index) => (
                <div key={index} className="flex items-start gap-2.5 text-xs text-slate-700 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing or Unverified Requirements */}
          {missing_requirements.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Items Requiring Verification</span>
              </h4>
              <div className="space-y-2">
                {missing_requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs text-amber-900 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                    <span className="text-amber-600 font-bold">!</span>
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weighted Factor Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Multi-Factor Scoring Matrix
              </h4>
              <span className="text-[11px] text-slate-400">Configured weights</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { label: 'Academic Compatibility', weight: '25%', score: breakdown.academic_compatibility },
                { label: 'Target Degree Level Fit', weight: '20%', score: breakdown.degree_level_compatibility },
                { label: 'Field of Study Relevance', weight: '20%', score: breakdown.subject_relevance },
                { label: 'Destination Alignment', weight: '15%', score: breakdown.destination_preference },
                { label: 'Funding Requirement Match', weight: '10%', score: breakdown.funding_preference },
                { label: 'Research & Experience Score', weight: '10%', score: breakdown.research_experience_relevance },
              ].map((factor, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{factor.label} <span className="text-slate-400 font-normal">({factor.weight})</span></span>
                    <span className="font-bold text-slate-900">{factor.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        factor.score >= 80 ? 'bg-emerald-500' :
                        factor.score >= 60 ? 'bg-blue-500' :
                        factor.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section (Layer 4) */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl">
            <span className="text-xs text-slate-600 font-medium">
              Did our engine evaluate this scholarship accurately for you?
            </span>
            {feedbackSubmitted ? (
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-3 py-1 rounded-full">
                Thank you! Feedback recorded for engine calibration.
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFeedback('accurate_match')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 text-xs font-semibold transition flex items-center gap-1 shadow-sm"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Accurate
                </button>
                <button
                  type="button"
                  onClick={() => handleFeedback('ineligible_reason_missed')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-300 hover:text-rose-700 text-xs font-semibold transition flex items-center gap-1 shadow-sm"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Missed Requirement
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href={scholarship.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
          >
            Visit Official Portal <ExternalLink className="w-3 h-3" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Explanation
          </button>
        </div>

      </div>
    </div>
  );
};
