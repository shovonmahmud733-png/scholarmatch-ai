import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { evaluateScholarshipMatch } from '../services/recommendationEngine';
import { EligibilityBadge } from '../components/common/EligibilityBadge';
import { FundingBadge } from '../components/common/FundingBadge';
import { MatchScoreGauge } from '../components/scholarships/MatchScoreGauge';
import { 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowLeft, 
  Scale, 
  FileText, 
  DollarSign, 
  Plane, 
  Heart, 
  Clock, 
  Sparkles,
  Award,
  BookOpen,
  Share2
} from 'lucide-react';

export const ScholarshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    scholarships, 
    profile, 
    isSaved, 
    toggleSaveScholarship, 
    comparedScholarshipIds, 
    toggleCompare, 
    addToTracker, 
    applications 
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);

  const scholarship = scholarships.find(s => s.id === id);

  if (!scholarship) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Scholarship Not Found</h2>
        <p className="text-sm text-slate-500">The requested scholarship opportunity could not be located in our verified catalog.</p>
        <Link to="/scholarships" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-block">
          Return to Discovery
        </Link>
      </div>
    );
  }

  const evaluation = evaluateScholarshipMatch(scholarship, profile);
  const saved = isSaved(scholarship.id);
  const isCompared = comparedScholarshipIds.includes(scholarship.id);
  const isTracked = applications.some(a => a.scholarship_id === scholarship.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formattedDeadline = new Date(scholarship.application_deadline).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to list</span>
        </button>

        <div className="flex items-center gap-2">
          {copiedLink && (
            <span className="text-xs text-emerald-600 font-semibold">Link copied!</span>
          )}
          <button
            type="button"
            onClick={handleShare}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium border border-slate-200 transition"
            title="Share Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Header Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Top Badges row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
              {scholarship.destination_country}
            </span>
            <FundingBadge type={scholarship.funding_details.funding_type} size="md" />
            {scholarship.is_verified_data && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Verified Official Source
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleCompare(scholarship.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                isCompared 
                  ? 'bg-blue-50 text-blue-700 border-blue-300' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{isCompared ? 'In Compare Matrix' : 'Compare'}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                saved 
                  ? 'bg-amber-50 text-amber-700 border-amber-300' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-600' : ''}`} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Title & Host info */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {scholarship.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Offered by <strong className="text-slate-800">{scholarship.provider}</strong>
            {scholarship.host_university && ` • Host: ${scholarship.host_university}`}
          </p>
        </div>

        {/* Key Quick-Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Degree Level</span>
            <p className="font-bold text-slate-900 capitalize mt-0.5 text-sm">
              {scholarship.target_degrees.join(', ')}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Monthly Living Stipend</span>
            <p className="font-bold text-emerald-700 mt-0.5 text-sm">
              {scholarship.funding_details.monthly_stipend_amount 
                ? `${scholarship.funding_details.monthly_stipend_currency} ${scholarship.funding_details.monthly_stipend_amount.toLocaleString()}/mo`
                : 'Tuition Waiver'}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Application Deadline</span>
            <p className="font-bold text-slate-900 mt-0.5 text-sm flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {formattedDeadline}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Target Intake Year</span>
            <p className="font-bold text-slate-900 mt-0.5 text-sm">
              Fall / Academic {scholarship.intake_year}
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <a
              href={scholarship.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition inline-flex items-center gap-2"
            >
              <span>Visit Official Application Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => {
                addToTracker(scholarship.id, 'planning_to_apply');
                navigate('/applications');
              }}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition inline-flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>{isTracked ? 'View in Application Tracker' : 'Add to Application Tracker'}</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400">
            Last verified: {scholarship.last_verified_at}
          </span>
        </div>

      </div>

      {/* Main Grid: Details (Left 2 cols) & Personalized AI Match (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Full Specifications */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Overview */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Program Overview</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {scholarship.overview}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {scholarship.tags.map(tag => (
                <span key={tag} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          {/* 2. Funding Coverage Details */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Comprehensive Funding Breakdown</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">Tuition Coverage</span>
                <p className="text-xl font-extrabold text-emerald-700">
                  {scholarship.funding_details.tuition_coverage_percent}% Waiver
                </p>
                <p className="text-xs text-emerald-800">
                  Full institutional tuition & examination fees paid directly to host university.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">Living Allowance</span>
                <p className="text-xl font-extrabold text-blue-700">
                  {scholarship.funding_details.monthly_stipend_amount 
                    ? `${scholarship.funding_details.monthly_stipend_currency} ${scholarship.funding_details.monthly_stipend_amount.toLocaleString()}/mo`
                    : 'Institutional Support'}
                </p>
                <p className="text-xs text-blue-800">
                  {scholarship.funding_details.living_stipend_details}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-700 divide-y divide-slate-100">
              {scholarship.funding_details.travel_allowance_details && (
                <div className="pt-2 flex items-start gap-2">
                  <Plane className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Airfare & Travel Allowance: </strong>
                    <span>{scholarship.funding_details.travel_allowance_details}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-start gap-2">
                <Heart className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Health Coverage: </strong>
                  <span>
                    {scholarship.funding_details.health_insurance_covered 
                      ? 'Comprehensive health insurance / national health service surcharge included.' 
                      : 'Applicant is responsible for independent student health cover.'}
                  </span>
                </div>
              </div>

              {scholarship.funding_details.other_allowances && (
                <div className="pt-2 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Additional Allowances: </strong>
                    <span>{scholarship.funding_details.other_allowances}</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 3. Academic & Language Eligibility */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Eligibility & Academic Criteria</span>
            </h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Academic Performance & GPA Standard:
                </span>
                <p className="text-slate-700">
                  {scholarship.academic_requirements.description}
                </p>
                {scholarship.academic_requirements.min_gpa && (
                  <p className="text-xs font-semibold text-blue-700">
                    Baseline minimum GPA: {scholarship.academic_requirements.min_gpa} / 4.0 scale
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Language Proficiency Requirement:
                </span>
                <p className="text-slate-700">
                  {scholarship.language_requirements.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                  <span className="font-medium text-slate-700">Accepted exams:</span>
                  {scholarship.language_requirements.accepted_tests.map(t => (
                    <span key={t} className="bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-800">
                      {t}
                    </span>
                  ))}
                  {scholarship.language_requirements.min_ielts && (
                    <span className="font-bold text-slate-900">
                      (Min IELTS: {scholarship.language_requirements.min_ielts})
                    </span>
                  )}
                </div>
                {scholarship.language_requirements.waiver_conditions && (
                  <p className="text-[11px] text-slate-500 italic pt-1">
                    Note on waivers: {scholarship.language_requirements.waiver_conditions}
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Eligible Nationalities:
                </span>
                <ul className="list-disc pl-5 text-slate-700 space-y-1">
                  {scholarship.eligible_nationalities.map((nat, i) => (
                    <li key={i}>{nat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Required Documents */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Required Application Dossier</span>
            </h2>

            <div className="space-y-2">
              {scholarship.required_documents.map(doc => (
                <div key={doc.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{doc.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    doc.required ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {doc.required ? 'Mandatory' : 'Optional / Specific'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Step-by-Step Procedure */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <span>Application Procedure & Timeline</span>
            </h2>

            <ol className="relative border-l border-blue-200 ml-4 space-y-4 text-xs sm:text-sm">
              {scholarship.application_procedure.map((step, index) => (
                <li key={index} className="ml-6 space-y-1">
                  <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold ring-4 ring-white">
                    {index + 1}
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>

        </div>

        {/* Right Column: AI Match Scorecard & Source Provenance */}
        <div className="space-y-6">
          
          {/* Personalized Compatibility Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 sticky top-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Your Compatibility</span>
              </div>
              <EligibilityBadge status={evaluation.eligibility_status} size="sm" />
            </div>

            <div className="flex items-center justify-center py-2">
              <MatchScoreGauge score={evaluation.match_score} size="lg" />
            </div>

            <p className="text-xs text-slate-500 text-center leading-relaxed">
              Calculated based on your active profile: degree level ({profile?.target_degree || 'unspecified'}), GPA ({profile?.gpa || 'unspecified'}), and country preference.
            </p>

            {/* Why it matches list */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Matching Criteria
              </span>
              <div className="space-y-1.5 text-xs text-slate-700">
                {evaluation.why_it_matches.map((w, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing or failed items */}
            {evaluation.missing_requirements.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Items to Verify
                </span>
                <div className="space-y-1.5 text-xs text-amber-900">
                  {evaluation.missing_requirements.map((m, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-amber-50/70 p-2 rounded-lg border border-amber-200">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/profile"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold text-center block transition"
              >
                Update Profile to Refine Match
              </Link>
            </div>
          </div>

          {/* Official Provenance & Integrity Card */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 text-xs space-y-3">
            <div className="flex items-center gap-1.5 text-teal-400 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Data Provenance Guarantee</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              This record was audited directly against published government statutes and university portals.
            </p>
            <div className="space-y-1 text-slate-400 text-[11px]">
              <p><strong>Primary Source:</strong> {scholarship.provider}</p>
              <p><strong>Verification URL:</strong> <a href={scholarship.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline truncate block">{scholarship.source_url}</a></p>
              <p><strong>Last Audited:</strong> {scholarship.last_verified_at}</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
