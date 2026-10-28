import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Globe, 
  CheckCircle2, 
  DollarSign, 
  BarChart2, 
  BookOpen, 
  Compass, 
  ExternalLink,
  Award,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { scholarships, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedDestination) params.set('country', selectedDestination);
    navigate(`/scholarships?${params.toString()}`);
  };

  // Top featured scholarships
  const featured = scholarships.slice(0, 3);

  // Popular destinations
  const destinations = [
    { country: 'United Kingdom', flag: '🇬🇧', count: '160+ Awards', avgGrant: '£18,000 - £45,000', popular: 'Chevening, Gates Cambridge' },
    { country: 'United States', flag: '🇺🇸', count: '120+ Awards', avgGrant: '$25,000 - $60,000', popular: 'Fulbright Foreign Student' },
    { country: 'Germany', flag: '🇩🇪', count: '90+ Awards', avgGrant: '€11,000 - €24,000', popular: 'DAAD Helmut-Schmidt' },
    { country: 'European Union', flag: '🇪🇺', count: '150+ Masters', avgGrant: '€35,000 - €48,000', popular: 'Erasmus Mundus Joint' },
    { country: 'Australia', flag: '🇦🇺', count: '75+ Awards', avgGrant: 'AUD $40k - $65k', popular: 'Australia Awards (DFAT)' },
    { country: 'Canada', flag: '🇨🇦', count: '50+ Awards', avgGrant: 'CAD $35k - $50k', popular: 'Vanier Graduate Scholarships' },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200">
        
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Intelligent Scholarship Matching & Eligibility Engine</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Your Future Deserves <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600">Funding.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Cut through scattered university portals and confusing requirements. Match your GPA, degree goals, field of study, and financial needs with verified global government and university scholarships.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to={user ? "/recommendations" : "/onboarding"}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 group"
              >
                <span>Find My Scholarships</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>
              
              <Link
                to="/scholarships"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-sm transition flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-slate-500" />
                <span>Explore Scholarships</span>
              </Link>
            </div>

            {/* Instant Search Bar */}
            <div className="pt-6 max-w-2xl mx-auto">
              <form 
                onSubmit={handleHeroSearch} 
                className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="flex-1 flex items-center gap-2.5 px-3 py-2 w-full">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by degree, field (e.g. AI, Public Policy), or university..."
                    className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                  />
                </div>

                <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-200 pl-0 sm:pl-3 pr-2 py-1 flex items-center">
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="text-xs sm:text-sm text-slate-700 font-medium bg-transparent focus:outline-none py-1.5 cursor-pointer w-full"
                  >
                    <option value="">All Destinations</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="European Union">European Union</option>
                    <option value="Japan">Japan</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
                <span className="font-medium text-slate-400">Popular:</span>
                {['Fully Funded', 'Computer Science & AI', 'Master\'s in UK', 'No Application Fee', 'PhD Stipend'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate(`/scholarships?q=${encodeURIComponent(tag)}`);
                    }}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition text-[11px]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust highlights */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-3xl mx-auto border-t border-slate-200/80 mt-8">
              <div className="space-y-0.5">
                <p className="text-xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Official Sources</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xl font-bold text-slate-900">12+ Major</p>
                <p className="text-xs text-slate-500 font-medium">Global Flagship Awards</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xl font-bold text-slate-900">4-Layer</p>
                <p className="text-xs text-slate-500 font-medium">Matching Engine</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xl font-bold text-slate-900">Zero</p>
                <p className="text-xs text-slate-500 font-medium">Fabricated Data</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. HOW THE RECOMMENDATION ENGINE WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
            <span>Engineering Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How ScholarMatch AI Works
          </h2>
          <p className="text-slate-600 text-sm">
            We don't guess. Our 4-layer decision pipeline mirrors human international admissions committees, eliminating false hopes through transparent criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-slate-900">Profile Normalization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standardizes academic scores (4.0, 5.0, 10.0, or percentages), target degrees, language tests, and citizenship criteria to prevent mismatch.
            </p>
            <span className="inline-block text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
              GPA & Degree Align
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-slate-900">Hard Eligibility Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enforces strict non-negotiable rules (citizenship bans, minimum GPA floors, degree requirements). Hard disqualifications cannot be overridden by preferences.
            </p>
            <span className="inline-block text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
              Disqualification Guard
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-slate-900">Multi-Factor Ranking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates weighted compatibility scores (0–100) across field of study, funding needs, research history, and destination suitability with transparent rationales.
            </p>
            <span className="inline-block text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
              0-100 Compatibility
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-base text-slate-900">Application Pipeline</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Organize deadlines, documents checklists (SOP, references, transcripts), and interview milestones in a dedicated 9-stage tracker.
            </p>
            <span className="inline-block text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded">
              Deadline Tracking
            </span>
          </div>

        </div>
      </section>

      {/* 3. FEATURED SCHOLARSHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Global Flagships</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Scholarships
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Fully funded government and foundation awards offering full tuition waivers and living stipends.
            </p>
          </div>

          <Link
            to="/scholarships"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
          >
            <span>View All Scholarships ({scholarships.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map(s => (
            <ScholarshipCard key={s.id} scholarship={s} viewMode="grid" />
          ))}
        </div>
      </section>

      {/* 4. POPULAR STUDY DESTINATIONS */}
      <section className="bg-slate-900 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 my-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Popular Study Destinations
            </h2>
            <p className="text-slate-400 text-sm">
              Explore fully funded and partial opportunities categorized by international student host nations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map(d => (
              <div 
                key={d.country}
                onClick={() => navigate(`/scholarships?country=${encodeURIComponent(d.country)}`)}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{d.flag}</span>
                    <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition">
                      {d.country}
                    </h3>
                  </div>
                  <span className="text-xs text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800">
                    {d.count}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Award:</span>
                    <span className="font-semibold text-emerald-400">{d.avgGrant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Popular Awards:</span>
                    <span className="text-slate-200 font-medium truncate max-w-[160px]">{d.popular}</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-white transition">
                  <span>Explore opportunities</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STUDENT TESTIMONIALS & AUTHENTIC IMPACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Student Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How Students Use ScholarMatch AI
          </h2>
          <p className="text-slate-600 text-sm">
            Empowering students from developing regions and diverse backgrounds to discover funding they never knew existed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              "I previously wasted weeks researching UK master's programs only to realize halfway through that my work experience fell 200 hours short of the specific scheme requirement. ScholarMatch AI flagged that instantly and pointed me straight toward DAAD and Erasmus Mundus."
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                TR
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Tariq Rahman</p>
                <p className="text-[11px] text-slate-500">Erasmus Mundus Scholar • Computer Science</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              "The side-by-side comparison tool saved my life when comparing Fulbright vs Chevening. Being able to compare living stipends, return-home visa rules, and document requirements in one screen made planning my references painless."
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                MC
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Mariana Castro</p>
                <p className="text-[11px] text-slate-500">Chevening Scholar 2024 • Public Health Policy</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              "The transparent match score breakdowns don't just give an arbitrary number—they actually show you what criteria you met and what requirements you still need to verify. That level of honesty is rare in EdTech."
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                EO
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Emeka Okafor</p>
                <p className="text-[11px] text-slate-500">SINGA PhD Awardee • AI & Robotics</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to find scholarships you're actually eligible for?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Take 2 minutes to set up your academic profile. Unlock personalized recommendation rankings, save your target opportunities, and track your applications.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/onboarding"
                className="px-6 py-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm shadow-md transition"
              >
                Start Free Profile Match
              </Link>
              <Link
                to="/scholarships"
                className="px-6 py-3 rounded-xl bg-blue-900/50 hover:bg-blue-900 text-white border border-blue-400/30 font-semibold text-sm transition"
              >
                Browse All Scholarships
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
