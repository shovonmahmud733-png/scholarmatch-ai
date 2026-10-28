import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Scale, X, ArrowRight } from 'lucide-react';

export const CompareTray: React.FC = () => {
  const { comparedScholarshipIds, scholarships, toggleCompare, clearCompare } = useApp();

  if (comparedScholarshipIds.length === 0) return null;

  const comparedScholarships = scholarships.filter(s => comparedScholarshipIds.includes(s.id));

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-3xl bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-3 sm:p-4 animate-in slide-in-from-bottom duration-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left items summary */}
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 shrink-0">
            <Scale className="w-4 h-4" />
            <span>Comparing ({comparedScholarshipIds.length}/4):</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {comparedScholarships.map(s => (
              <span 
                key={s.id} 
                className="inline-flex items-center gap-1 bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-700 shrink-0"
              >
                <span className="max-w-[120px] truncate">{s.title}</span>
                <button 
                  onClick={() => toggleCompare(s.id)}
                  className="text-slate-400 hover:text-white"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded transition"
          >
            Clear
          </button>
          
          <Link
            to="/compare"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
