import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FundingBadge } from '../components/common/FundingBadge';
import { 
  Scale, 
  X, 
  Plus, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Bookmark, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  DollarSign
} from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { 
    scholarships, 
    comparedScholarshipIds, 
    toggleCompare, 
    clearCompare, 
    toggleSaveScholarship, 
    isSaved 
  } = useApp();

  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [addSelectorOpen, setAddSelectorOpen] = useState(false);

  // Selected scholarships for comparison
  const comparedScholarships = scholarships.filter(s => comparedScholarshipIds.includes(s.id));
  const availableToAdd = scholarships.filter(s => !comparedScholarshipIds.includes(s.id));

  if (comparedScholarships.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-sm">
          <Scale className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Scholarship Comparison Matrix
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Select up to 4 scholarships to compare their funding coverage, living stipends, academic GPA requirements, return-home visa rules, and deadlines side-by-side.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/scholarships"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition inline-flex items-center gap-2"
          >
            <span>Browse Catalog to Select Scholarships</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Demo compare suggestion */}
        <div className="pt-6 border-t border-slate-200 max-w-lg mx-auto">
          <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">
            Or try comparing these top global awards:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {scholarships.slice(0, 3).map(s => (
              <button
                key={s.id}
                onClick={() => toggleCompare(s.id)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-xs text-slate-700 font-medium transition shadow-sm"
              >
                + Add {s.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-7 h-7 text-blue-600" />
            <span>Scholarship Comparison</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comparing <strong className="text-slate-800">{comparedScholarships.length} of 4</strong> maximum opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Add scholarship dropdown */}
          {comparedScholarships.length < 4 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAddSelectorOpen(!addSelectorOpen)}
                className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-blue-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Scholarship ({4 - comparedScholarships.length} left)</span>
              </button>

              {addSelectorOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 max-h-60 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Available to add
                  </div>
                  {availableToAdd.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        toggleCompare(item.id);
                        setAddSelectorOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition truncate block"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={clearCompare}
            className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-semibold border border-slate-200 transition"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          
          {/* Header Row: Scholarship Titles & Actions */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-44 font-bold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                Criteria
              </th>
              {comparedScholarships.map(s => (
                <th key={s.id} className="p-4 min-w-[240px] max-w-[280px] align-top border-r border-slate-200 last:border-r-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase">
                        {s.destination_country}
                      </span>
                      <button
                        onClick={() => toggleCompare(s.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <Link 
                      to={`/scholarships/${s.id}`} 
                      className="font-bold text-slate-900 hover:text-blue-600 text-sm block leading-snug line-clamp-2"
                    >
                      {s.title}
                    </Link>

                    <div className="flex items-center gap-2 pt-1">
                      <FundingBadge type={s.funding_details.funding_type} size="sm" />
                      <button
                        type="button"
                        onClick={() => toggleSaveScholarship(s.id)}
                        className={`p-1 rounded text-xs border ${isSaved(s.id) ? 'bg-amber-50 text-amber-600 border-amber-300' : 'text-slate-400 border-slate-200'}`}
                        title={isSaved(s.id) ? 'Saved' : 'Save'}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            
            {/* 1. Host Organization & Destination */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                Provider & Host
              </td>
              {comparedScholarships.map(s => (
                <td key={s.id} className="p-4 text-slate-700 border-r border-slate-200 last:border-r-0">
                  <p className="font-semibold text-slate-900">{s.provider}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.host_university || 'Accredited Host Universities'}</p>
                </td>
              ))}
            </tr>

            {/* 2. Target Degrees */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                Eligible Degrees
              </td>
              {comparedScholarships.map(s => (
                <td key={s.id} className="p-4 text-slate-800 border-r border-slate-200 last:border-r-0 capitalize font-medium">
                  {s.target_degrees.join(', ')}
                </td>
              ))}
            </tr>

            {/* 3. Tuition Coverage */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                Tuition Coverage
              </td>
              {comparedScholarships.map(s => (
                <td key={s.id} className="p-4 border-r border-slate-200 last:border-r-0">
                  <span className="font-bold text-emerald-700 text-sm">
                    {s.funding_details.tuition_coverage_percent}% Full Waiver
                  </span>
                </td>
              ))}
            </tr>

            {/* 4. Living Stipend */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                Monthly Living Stipend
              </td>
              {comparedScholarships.map(s => (
                <td key={s.id} className="p-4 border-r border-slate-200 last:border-r-0">
                  {s.funding_details.monthly_stipend_amount ? (
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {s.funding_details.monthly_stipend_currency} {s.funding_details.monthly_stipend_amount.toLocaleString()} / mo
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {s.funding_details.living_stipend_details}
                      </p>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic">Tuition waiver only</span>
                  )}
                </td>
              ))}
            </tr>

            {/* 5. Travel & Airfare Allowance */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                Travel / Flights
              </td>
              {comparedScholarships.map(s => (
                <td key={s.id} className="p-4 text-slate-700 border-r border-slate-200 last:border-r-0 text-[11px] leading-relaxed">
                  {s.funding_details.travel_allowance_details || 'Not covered directly.'}
                </td>
              ))}
            </tr>

            {/* 6. Academic Requirements & Min GPA */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                Academic & GPA
              </td>
              {comparedScholarships.map(s => (
                <td key={s.id} className="p-4 text-slate-700 border-r border-slate-200 last:border-r-0 space-y-1">
                  {s.academic_requirements.min_gpa && (
                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold text-[11px]">
                      Min GPA: {s.academic_requirements.min_gpa} / 4.0
                    </span>
                  )}
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {s.academic_requirements.description}
                  </p>
                </td>
              ))}
            </tr>

            {/* 7. Language Proficiency */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                Language Test Criteria
              </td>
              {comparedScholarships.map(s => (
                <td key={s.id} className="p-4 text-slate-700 border-r border-slate-200 last:border-r-0 space-y-1">
                  <div className="flex flex-wrap gap-1">
                    {s.language_requirements.accepted_tests.map(t => (
                      <span key={t} className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                  {s.language_requirements.min_ielts && (
                    <p className="text-[11px] text-slate-800 font-semibold">
                      Min IELTS: {s.language_requirements.min_ielts}
                    </p>
                  )}
                </td>
              ))}
            </tr>

            {/* 8. Eligible Nationalities */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                Citizenship Restrictions
              </td>
              {comparedScholarships.map(s => (
                <td key={s.id} className="p-4 text-slate-700 border-r border-slate-200 last:border-r-0 text-[11px] leading-relaxed">
                  {s.eligible_nationalities.join('; ')}
                </td>
              ))}
            </tr>

            {/* 9. Application Deadline */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                Application Deadline
              </td>
              {comparedScholarships.map(s => (
                <td key={s.id} className="p-4 border-r border-slate-200 last:border-r-0">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(s.application_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </td>
              ))}
            </tr>

            {/* 10. Required Documents */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                Document Checklist
              </td>
              {comparedScholarships.map(s => (
                <td key={s.id} className="p-4 border-r border-slate-200 last:border-r-0">
                  <ul className="space-y-1 text-[11px] text-slate-700">
                    {s.required_documents.map(d => (
                      <li key={d.id} className="flex items-start gap-1">
                        <span className="text-blue-500">•</span>
                        <span>{d.name}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* 11. Official Links */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                Direct Application Link
              </td>
              {comparedScholarships.map(s => (
                <td key={s.id} className="p-4 border-r border-slate-200 last:border-r-0">
                  <a
                    href={s.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition inline-flex items-center gap-1 shadow-sm"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
};
