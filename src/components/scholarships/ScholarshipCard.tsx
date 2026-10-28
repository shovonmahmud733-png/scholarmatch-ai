import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scholarship, 
  RecommendationResult 
} from '../../types';
import { 
  MapPin, 
  Calendar, 
  Bookmark, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  Scale, 
  ShieldCheck 
} from 'lucide-react';
import { EligibilityBadge } from '../common/EligibilityBadge';
import { FundingBadge } from '../common/FundingBadge';
import { MatchScoreGauge } from './MatchScoreGauge';
import { useApp } from '../../context/AppContext';

interface Props {
  scholarship: Scholarship;
  recommendation?: RecommendationResult;
  viewMode?: 'grid' | 'list';
  onOpenExplain?: (rec: RecommendationResult) => void;
}

export const ScholarshipCard: React.FC<Props> = ({
  scholarship,
  recommendation,
  viewMode = 'grid',
  onOpenExplain
}) => {
  const { 
    isSaved, 
    toggleSaveScholarship, 
    comparedScholarshipIds, 
    toggleCompare, 
    addToTracker, 
    applications 
  } = useApp();

  const saved = isSaved(scholarship.id);
  const isCompared = comparedScholarshipIds.includes(scholarship.id);
  const isTracked = applications.some(a => a.scholarship_id === scholarship.id);

  // Format deadline date
  const deadlineDate = new Date(scholarship.application_deadline);
  const formattedDeadline = !isNaN(deadlineDate.getTime()) 
    ? deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : scholarship.application_deadline;

  // Destination flags helper
  const getFlag = (country: string) => {
    if (country.includes('United Kingdom')) return '🇬🇧';
    if (country.includes('United States')) return '🇺🇸';
    if (country.includes('Germany')) return '🇩🇪';
    if (country.includes('European Union') || country.includes('Europe')) return '🇪🇺';
    if (country.includes('Australia')) return '🇦🇺';
    if (country.includes('France')) return '🇫🇷';
    if (country.includes('Switzerland')) return '🇨🇭';
    if (country.includes('Singapore')) return '🇸🇬';
    if (country.includes('Japan')) return '🇯🇵';
    if (country.includes('Canada')) return '🇨🇦';
    return '🌍';
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition duration-200 p-5 flex flex-col md:flex-row gap-5 items-start justify-between relative group">
        <div className="flex-1 space-y-3">
          
          {/* Header Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm">{getFlag(scholarship.destination_country)}</span>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {scholarship.destination_country}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-600 font-medium">
              {scholarship.provider}
            </span>
            {scholarship.is_verified_data && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                Verified
              </span>
            )}
          </div>

          {/* Title & Degrees */}
          <div>
            <Link 
              to={`/scholarships/${scholarship.id}`}
              className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug"
            >
              {scholarship.title}
            </Link>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {scholarship.overview}
            </p>
          </div>

          {/* Key metadata chips */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-1 font-medium">
              <FundingBadge type={scholarship.funding_details.funding_type} size="sm" />
              {scholarship.funding_details.monthly_stipend_amount && (
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {scholarship.funding_details.monthly_stipend_currency} {scholarship.funding_details.monthly_stipend_amount.toLocaleString()}/mo
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Deadline: <strong className="text-slate-800">{formattedDeadline}</strong></span>
            </div>

            <div className="flex items-center gap-1 text-slate-500">
              <span className="font-semibold text-slate-700">Degree:</span>
              <span className="capitalize">{scholarship.target_degrees.join(', ')}</span>
            </div>
          </div>

          {/* Recommendation note if present */}
          {recommendation && (
            <div className="flex items-center gap-2 pt-1">
              <EligibilityBadge status={recommendation.eligibility_status} size="sm" />
              {recommendation.why_it_matches.length > 0 && (
                <span className="text-xs text-slate-600 truncate max-w-md">
                  💡 {recommendation.why_it_matches[0]}
                </span>
              )}
              {onOpenExplain && (
                <button
                  type="button"
                  onClick={() => onOpenExplain(recommendation)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline shrink-0"
                >
                  Why this matches
                </button>
              )}
            </div>
          )}

        </div>

        {/* Right Action Column */}
        <div className="w-full md:w-48 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          {recommendation && (
            <div className="flex items-center md:flex-col md:items-end">
              <MatchScoreGauge score={recommendation.match_score} size="md" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleCompare(scholarship.id)}
              className={`p-2 rounded-lg text-xs font-medium border transition ${
                isCompared 
                  ? 'bg-blue-50 text-blue-700 border-blue-300' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Add to Comparison Matrix"
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={`p-2 rounded-lg text-xs font-medium border transition ${
                saved 
                  ? 'bg-amber-50 text-amber-700 border-amber-300' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title={saved ? 'Remove Bookmark' : 'Save Scholarship'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-600' : ''}`} />
            </button>

            <Link
              to={`/scholarships/${scholarship.id}`}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition inline-flex items-center gap-1 shadow-sm"
            >
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (Default)
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative group overflow-hidden">
      
      {/* Top Banner with Badges */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-base">{getFlag(scholarship.destination_country)}</span>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {scholarship.destination_country}
            </span>
            <FundingBadge type={scholarship.funding_details.funding_type} size="sm" />
          </div>

          {/* Bookmark & Compare buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleCompare(scholarship.id)}
              className={`p-1.5 rounded-md text-xs transition ${
                isCompared 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={isCompared ? 'In Comparison Matrix' : 'Compare'}
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={`p-1.5 rounded-md text-xs transition ${
                saved 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={saved ? 'Bookmarked' : 'Save'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link 
          to={`/scholarships/${scholarship.id}`}
          className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition leading-snug line-clamp-2"
        >
          {scholarship.title}
        </Link>
        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
          {scholarship.provider}
        </p>

        {/* Overview snippet */}
        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {scholarship.overview}
        </p>
      </div>

      {/* Middle Specs Box */}
      <div className="px-5 py-3 bg-slate-50/70 border-y border-slate-100 text-xs space-y-1.5">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-slate-400">Target Degree:</span>
          <span className="font-semibold text-slate-800 capitalize">
            {scholarship.target_degrees.join(', ')}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="text-slate-400">Living Allowance:</span>
          <span className="font-semibold text-emerald-700">
            {scholarship.funding_details.monthly_stipend_amount 
              ? `${scholarship.funding_details.monthly_stipend_currency} ${scholarship.funding_details.monthly_stipend_amount.toLocaleString()}/mo` 
              : 'Institutional Waiver'}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="text-slate-400">Deadline:</span>
          <span className="font-semibold text-slate-800 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            {formattedDeadline}
          </span>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 bg-white flex items-center justify-between gap-3">
        {recommendation ? (
          <div className="flex items-center gap-2">
            <MatchScoreGauge score={recommendation.match_score} size="sm" />
            <EligibilityBadge status={recommendation.eligibility_status} size="sm" showIcon={false} />
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Verified Source</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {recommendation && onOpenExplain && (
            <button
              type="button"
              onClick={() => onOpenExplain(recommendation)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Why
            </button>
          )}

          <Link
            to={`/scholarships/${scholarship.id}`}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition inline-flex items-center gap-1 shadow-sm"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

    </div>
  );
};
