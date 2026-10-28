import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, CheckCircle2, ArrowRight, BookOpen, Scale, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About ScholarMatch AI
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Democratizing access to higher education funding through verified data, transparent algorithmic eligibility, and personalized matching.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">The Problem We Solve</h2>
        <p>
          Every year, millions of high-potential students around the world give up on their dreams of studying abroad or pursuing graduate research simply because funding information is fragmented, outdated, and buried across hundreds of disparate embassy, university, and foundation portals.
        </p>
        <p>
          More critically, students waste dozens of hours assembling lengthy application portfolios for opportunities where they are disqualified by hard eligibility rules (such as nationality restrictions, specific grading scale conversions, or mandatory work hour minimums).
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">Our Core Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold">1. Zero Fabricated Opportunities</strong>
            <p className="text-xs text-slate-600">
              We never invent scholarships or use generative hallucinations. Every record is audited directly against published government or university decrees.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold">2. Honest Disqualification Guards</strong>
            <p className="text-xs text-slate-600">
              High preference scores can never override a mandatory eligibility failure. If a student does not meet a hard citizenship or GPA threshold, we state it transparently.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Ready to discover your matches?</span>
          <Link
            to="/scholarships"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5 shadow"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: January 2025</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-3 text-teal-900 font-semibold text-xs">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
          <span>We do not sell student profiles or share personal academic transcripts with advertising networks.</span>
        </div>

        <h3 className="text-base font-bold text-slate-900">1. Data We Collect</h3>
        <p>
          To calculate accurate eligibility scores, ScholarMatch AI collects self-reported academic attributes (CGPA, degree level, field of study), study country preferences, financial need requirements, and basic contact information.
        </p>

        <h3 className="text-base font-bold text-slate-900">2. How Data is Used</h3>
        <p>
          Information is solely utilized to compute match scores, assess citizenship compatibility, prioritize stipend coverage, and send user-scheduled application deadline alerts.
        </p>

        <h3 className="text-base font-bold text-slate-900">3. Data Retention & Deletion</h3>
        <p>
          Students can export their application records or completely wipe all profile data from the application settings page at any time with one click.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service & Disclaimer</h1>
        <p className="text-xs text-slate-500">Last updated: January 2025</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h3 className="text-base font-bold text-slate-900">1. Nature of the Service</h3>
        <p>
          ScholarMatch AI provides an informational and advisory recommendation engine. Calculated match scores (0–100%) reflect algorithmic compatibility against published public guidelines. A high match score does NOT guarantee selection, admission, or award disbursement.
        </p>

        <h3 className="text-base font-bold text-slate-900">2. Verification Requirement</h3>
        <p>
          Scholarship deadlines, quotas, and criteria are subject to change by host universities and foreign governments without prior notice. Applicants are legally responsible for verifying all prerequisites directly on official government or university portals prior to submitting formal applications.
        </p>

        <h3 className="text-base font-bold text-slate-900">3. No Application Submission Proxy</h3>
        <p>
          ScholarMatch AI does not submit applications on behalf of candidates. Application tracking tools are intended for personal candidate task management only.
        </p>
      </div>
    </div>
  );
};
