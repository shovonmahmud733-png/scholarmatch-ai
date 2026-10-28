import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { rankScholarshipsForProfile } from '../services/recommendationEngine';
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard';
import { RecommendationExplanationModal } from '../components/scholarships/RecommendationExplanationModal';
import { RecommendationResult, EligibilityStatus } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  XCircle, 
  Sliders, 
  ArrowRight, 
  Info,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const { scholarships, profile, resetToDemoProfile } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'eligible' | 'potentially_eligible' | 'high_match' | 'ineligible'>('all');
  const [activeExplainRec, setActiveExplainRec] = useState<RecommendationResult | null>(null);

  // Compute ranked recommendations
  const rankedResults = useMemo(() => {
    return rankScholarshipsForProfile(scholarships, profile);
  }, [scholarships, profile]);

  // Tab filtering
  const filteredResults = useMemo(() => {
    switch (activeTab) {
      case 'eligible':
        return rankedResults.filter(r => r.eligibility_status === 'eligible');
      case 'potentially_eligible':
        return rankedResults.filter(r => r.eligibility_status === 'potentially_eligible' || r.eligibility_status === 'needs_verification');
      case 'high_match':
        return rankedResults.filter(r => r.match_score >= 80 && r.eligibility_status !== 'ineligible');
      case 'ineligible':
        return rankedResults.filter(r => r.eligibility_status === 'ineligible');
      case 'all':
      default:
        return rankedResults;
    }
  }, [rankedResults, activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        
        {/* Glow circle */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 border border-blue-600/50 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Hybrid Recommendation Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Personalized Scholarship Matches
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Ranked through our 4-layer eligibility pipeline based on your target degree ({profile?.target_degree.toUpperCase() || 'Master\'s'}), GPA ({profile?.gpa.toFixed(2) || '3.65'}/4.0), and preferred destination countries.
          </p>

          {/* Profile snapshot stats */}
          {profile && (
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
                👤 Student: <strong className="text-white">{profile.full_name}</strong>
              </span>
              <span className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
                🎓 Field: <strong className="text-white">{profile.field_of_study}</strong>
              </span>
              <span className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
                🌍 Citizenship: <strong className="text-white">{profile.citizenship}</strong>
              </span>
              <Link 
                to="/profile"
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium ml-2"
              >
                Edit Preferences
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Transparent Disclaimer Box */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-950">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Recommendation Principles:</strong> A match score is a multi-factor compatibility index, not a probability of winning an award. Hard disqualifying conditions strictly override high preference scores.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={resetToDemoProfile}
            className="px-3 py-1 bg-white hover:bg-slate-50 text-blue-800 rounded-lg border border-blue-200 text-xs font-semibold shadow-sm transition flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Load Demo Student</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            { id: 'all', label: 'All Ranked', count: rankedResults.length },
            { id: 'high_match', label: 'High Match (>80%)', count: rankedResults.filter(r => r.match_score >= 80 && r.eligibility_status !== 'ineligible').length },
            { id: 'eligible', label: 'Fully Eligible', count: rankedResults.filter(r => r.eligibility_status === 'eligible').length },
            { id: 'potentially_eligible', label: 'Needs Verification', count: rankedResults.filter(r => r.eligibility_status === 'potentially_eligible' || r.eligibility_status === 'needs_verification').length },
            { id: 'ineligible', label: 'Ineligible / Disqualified', count: rankedResults.filter(r => r.eligibility_status === 'ineligible').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredResults.length}</strong> matching awards
        </span>

      </div>

      {/* Recommendation Results Grid */}
      {filteredResults.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-sm text-slate-600 font-medium">No scholarships found under this filter tab.</p>
          <button
            onClick={() => setActiveTab('all')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Show All Ranked Matches
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map(rec => (
            <ScholarshipCard
              key={rec.scholarship.id}
              scholarship={rec.scholarship}
              recommendation={rec}
              viewMode="grid"
              onOpenExplain={(r) => setActiveExplainRec(r)}
            />
          ))}
        </div>
      )}

      {/* Explanation Rationale Modal */}
      {activeExplainRec && (
        <RecommendationExplanationModal
          recommendation={activeExplainRec}
          onClose={() => setActiveExplainRec(null)}
        />
      )}

    </div>
  );
};
