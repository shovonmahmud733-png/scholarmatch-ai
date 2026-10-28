import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard';
import { evaluateScholarshipMatch } from '../services/recommendationEngine';
import { 
  Bookmark, 
  ArrowRight, 
  Trash2, 
  Download, 
  Search, 
  SlidersHorizontal 
} from 'lucide-react';

export const SavedScholarshipsPage: React.FC = () => {
  const { savedScholarshipIds, scholarships, profile, toggleSaveScholarship } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const savedScholarships = scholarships.filter(s => savedScholarshipIds.includes(s.id));

  const filtered = savedScholarships.filter(s => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || 
           s.destination_country.toLowerCase().includes(q) || 
           s.provider.toLowerCase().includes(q);
  });

  const exportSummary = () => {
    const summary = savedScholarships.map(s => 
      `Scholarship: ${s.title}\nCountry: ${s.destination_country}\nProvider: ${s.provider}\nDeadline: ${s.application_deadline}\nURL: ${s.official_url}\n------------------------`
    ).join('\n\n');

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ScholarMatch_Saved_Scholarships.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-7 h-7 text-amber-500 fill-amber-500" />
            <span>Saved Scholarships</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            You have bookmarked <strong className="text-slate-800">{savedScholarships.length}</strong> opportunities.
          </p>
        </div>

        {savedScholarships.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportSummary}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Summary</span>
            </button>
            <Link
              to="/scholarships"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Explore More</span>
            </Link>
          </div>
        )}
      </div>

      {savedScholarships.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900">No saved scholarships yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              When browsing scholarships or viewing your AI recommendations, tap the bookmark icon on any card to save it here for later review.
            </p>
          </div>
          <Link
            to="/scholarships"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <span>Discover Scholarships</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Quick filter input */}
          <div className="max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter saved scholarships..."
                className="w-full pl-9 pr-4 py-2 text-xs text-slate-900 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(s => {
              const rec = evaluateScholarshipMatch(s, profile);
              return (
                <ScholarshipCard
                  key={s.id}
                  scholarship={s}
                  recommendation={rec}
                  viewMode="grid"
                />
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
