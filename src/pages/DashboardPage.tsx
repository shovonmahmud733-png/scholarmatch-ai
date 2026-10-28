import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { rankScholarshipsForProfile } from '../services/recommendationEngine';
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard';
import { 
  Sparkles, 
  Bookmark, 
  Layers, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  GraduationCap, 
  Scale, 
  User as UserIcon,
  ChevronRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, profile, scholarships, savedScholarshipIds, applications } = useApp();

  const ranked = rankScholarshipsForProfile(scholarships, profile);
  const topRecommendations = ranked.slice(0, 3);
  const savedScholarships = scholarships.filter(s => savedScholarshipIds.includes(s.id));

  // Upcoming application deadlines
  const upcomingDeadlines = [...scholarships]
    .sort((a, b) => new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime())
    .slice(0, 4);

  const profileCompletion = profile?.profile_completion_percentage || 50;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Scholar'}
            </h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Targeting <strong className="text-slate-800">{profile?.target_degree.toUpperCase() || 'Master\'s'}</strong> in <strong className="text-slate-800">{profile?.field_of_study || 'Computer Science'}</strong> for Intake {profile?.target_intake_year || 2026}.
          </p>
        </div>

        {/* Profile Completion Card */}
        <div className="w-full md:w-72 bg-slate-50 rounded-2xl p-4 border border-slate-200 shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Profile Completion</span>
            <span className="font-extrabold text-blue-600">{profileCompletion}%</span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              {profileCompletion >= 90 ? 'High matching accuracy' : 'Add test scores to boost'}
            </span>
            <Link 
              to="/profile" 
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Link 
          to="/recommendations"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm transition space-y-1 block group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <Sparkles className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
            <ChevronRight className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {ranked.filter(r => r.match_score >= 80).length}
          </p>
          <p className="text-xs font-semibold text-slate-500">High Match Awards (≥80%)</p>
        </Link>

        <Link 
          to="/applications"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-400 shadow-sm transition space-y-1 block group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <Layers className="w-5 h-5 text-purple-600 group-hover:scale-110 transition" />
            <ChevronRight className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {applications.length}
          </p>
          <p className="text-xs font-semibold text-slate-500">Active Applications</p>
        </Link>

        <Link 
          to="/saved"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 shadow-sm transition space-y-1 block group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <Bookmark className="w-5 h-5 text-amber-500 group-hover:scale-110 transition" />
            <ChevronRight className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {savedScholarshipIds.length}
          </p>
          <p className="text-xs font-semibold text-slate-500">Saved Opportunities</p>
        </Link>

        <Link 
          to="/scholarships?funding=fully_funded"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm transition space-y-1 block group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <GraduationCap className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition" />
            <ChevronRight className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {scholarships.filter(s => s.funding_details.funding_type === 'fully_funded').length}
          </p>
          <p className="text-xs font-semibold text-slate-500">Fully Funded in Catalog</p>
        </Link>

      </div>

      {/* 3. Main Dashboard Grid: Top Recommendations & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Top Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Top Recommended Scholarships</span>
              </h2>
              <p className="text-xs text-slate-500">Ranked by degree compatibility, GPA fit, and preferred countries.</p>
            </div>
            <Link 
              to="/recommendations" 
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All ({ranked.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {topRecommendations.map(rec => (
              <ScholarshipCard
                key={rec.scholarship.id}
                scholarship={rec.scholarship}
                recommendation={rec}
                viewMode="list"
              />
            ))}
          </div>

          {/* Applications in progress preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Application Tracker Status</span>
              </h3>
              <Link to="/applications" className="text-xs text-blue-600 hover:underline font-semibold">
                Open Kanban Board
              </Link>
            </div>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                No active applications tracked yet. Click "Add to Tracker" on any scholarship card.
              </p>
            ) : (
              <div className="space-y-3">
                {applications.map(app => (
                  <div key={app.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{app.scholarship.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Target deadline: {app.custom_deadline || app.scholarship.application_deadline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 capitalize">
                        {app.status.replace(/_/g, ' ')}
                      </span>
                      <Link 
                        to="/applications" 
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Upcoming Deadlines & Saved Quick List */}
        <div className="space-y-6">
          
          {/* Upcoming Deadlines Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Upcoming Deadlines</span>
              </h3>
              <span className="text-[11px] text-slate-400">Chronological</span>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.map(sch => (
                <div key={sch.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      {sch.destination_country}
                    </span>
                    <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(sch.application_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <Link 
                    to={`/scholarships/${sch.id}`}
                    className="font-bold text-xs text-slate-800 hover:text-blue-600 block truncate"
                  >
                    {sch.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white">Next Steps</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Explore side-by-side comparisons or update your test scores to unlock higher verified eligibility ratings.
            </p>
            <div className="pt-2 space-y-2">
              <Link 
                to="/compare"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-center block transition shadow-sm"
              >
                Launch Scholarship Comparison
              </Link>
              <Link 
                to="/profile"
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-center block transition border border-slate-700"
              >
                Review Academic Profile
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
