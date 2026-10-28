import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { evaluateScholarshipMatch } from '../services/recommendationEngine';
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard';
import { RecommendationExplanationModal } from '../components/scholarships/RecommendationExplanationModal';
import { RecommendationResult, DegreeLevel, FundingType } from '../types';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Grid, 
  List, 
  X, 
  RotateCcw, 
  Sparkles, 
  Calendar, 
  DollarSign,
  GraduationCap
} from 'lucide-react';

export const ScholarshipsPage: React.FC = () => {
  const { scholarships, profile } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state initialized from URL search params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || '');
  const [selectedDegree, setSelectedDegree] = useState(searchParams.get('degree') || '');
  const [selectedFunding, setSelectedFunding] = useState(searchParams.get('funding') || '');
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || '');
  const [requiresStipend, setRequiresStipend] = useState(false);
  const [minGpaFilter, setMinGpaFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'deadline' | 'match_score' | 'title' | 'stipend'>('deadline');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Explanation Modal state
  const [activeExplainRec, setActiveExplainRec] = useState<RecommendationResult | null>(null);

  // Distinct countries and subjects from data
  const countries = useMemo(() => {
    const list = Array.from(new Set(scholarships.map(s => s.destination_country)));
    return list.sort();
  }, [scholarships]);

  const subjects = useMemo(() => {
    const allSubs = scholarships.flatMap(s => s.eligible_subjects);
    const unique = Array.from(new Set(allSubs)).filter(s => !s.toLowerCase().includes('all'));
    return unique.sort().slice(0, 15);
  }, [scholarships]);

  // Compute recommendation matches for all scholarships
  const evaluatedMap = useMemo(() => {
    const map = new Map<string, RecommendationResult>();
    scholarships.forEach(s => {
      map.set(s.id, evaluateScholarshipMatch(s, profile));
    });
    return map;
  }, [scholarships, profile]);

  // Filtered and sorted scholarships
  const filteredScholarships = useMemo(() => {
    return scholarships.filter(scholarship => {
      // 1. Text Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = scholarship.title.toLowerCase().includes(q);
        const inProvider = scholarship.provider.toLowerCase().includes(q);
        const inCountry = scholarship.destination_country.toLowerCase().includes(q);
        const inOverview = scholarship.overview.toLowerCase().includes(q);
        const inSubjects = scholarship.eligible_subjects.some(sub => sub.toLowerCase().includes(q));
        const inTags = scholarship.tags.some(tag => tag.toLowerCase().includes(q));
        if (!inTitle && !inProvider && !inCountry && !inOverview && !inSubjects && !inTags) {
          return false;
        }
      }

      // 2. Destination Country
      if (selectedCountry && scholarship.destination_country !== selectedCountry) {
        return false;
      }

      // 3. Degree Level
      if (selectedDegree && !scholarship.target_degrees.includes(selectedDegree as DegreeLevel)) {
        return false;
      }

      // 4. Funding Type
      if (selectedFunding && scholarship.funding_details.funding_type !== selectedFunding) {
        return false;
      }

      // 5. Monthly Stipend requirement
      if (requiresStipend && !scholarship.funding_details.monthly_stipend_amount) {
        return false;
      }

      // 6. Minimum GPA requirement
      if (minGpaFilter !== null) {
        if (scholarship.academic_requirements.min_gpa && scholarship.academic_requirements.min_gpa > minGpaFilter) {
          return false;
        }
      }

      // 7. Subject
      if (selectedSubject) {
        const hasSub = scholarship.eligible_subjects.some(
          sub => sub.toLowerCase().includes('all') || sub.toLowerCase().includes(selectedSubject.toLowerCase())
        );
        if (!hasSub) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match_score') {
        const scoreA = evaluatedMap.get(a.id)?.match_score || 0;
        const scoreB = evaluatedMap.get(b.id)?.match_score || 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'deadline') {
        return new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'stipend') {
        const stipendA = a.funding_details.monthly_stipend_amount || 0;
        const stipendB = b.funding_details.monthly_stipend_amount || 0;
        return stipendB - stipendA;
      }
      return 0;
    });
  }, [
    scholarships, 
    searchQuery, 
    selectedCountry, 
    selectedDegree, 
    selectedFunding, 
    requiresStipend, 
    minGpaFilter, 
    selectedSubject, 
    sortBy, 
    evaluatedMap
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('');
    setSelectedDegree('');
    setSelectedFunding('');
    setSelectedSubject('');
    setRequiresStipend(false);
    setMinGpaFilter(null);
    setSortBy('deadline');
    setSearchParams({});
  };

  const activeFiltersCount = [
    selectedCountry, 
    selectedDegree, 
    selectedFunding, 
    selectedSubject, 
    requiresStipend, 
    minGpaFilter !== null
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Scholarships
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Browse verified global opportunities with official application links and transparent eligibility.
            </p>
          </div>

          {/* View Mode & Sort toggles */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-blue-50 text-blue-700' : 'text-slate-400 hover:text-slate-700'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'text-slate-400 hover:text-slate-700'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>
          </div>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, provider, keyword or degree..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-between md:justify-end">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="deadline">Application Deadline (Soonest)</option>
              <option value="match_score">AI Match Score (Highest)</option>
              <option value="stipend">Monthly Living Stipend (Highest)</option>
              <option value="title">Scholarship Title (A–Z)</option>
            </select>
          </div>

        </div>

        {/* Active Filter Pills Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-medium">Active filters:</span>
            {selectedCountry && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                Country: {selectedCountry}
                <button onClick={() => setSelectedCountry('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedDegree && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium capitalize">
                Degree: {selectedDegree}
                <button onClick={() => setSelectedDegree('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedFunding && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium capitalize">
                Funding: {selectedFunding.replace('_', ' ')}
                <button onClick={() => setSelectedFunding('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedSubject && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                Subject: {selectedSubject}
                <button onClick={() => setSelectedSubject('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {requiresStipend && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                Includes Living Stipend
                <button onClick={() => setRequiresStipend(false)}><X className="w-3 h-3" /></button>
              </span>
            )}
            {minGpaFilter !== null && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                Max Min GPA: {minGpaFilter}
                <button onClick={() => setMinGpaFilter(null)}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-20`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-sm text-slate-900">Filters</h3>
            </div>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Reset
              </button>
            )}
          </div>

          {/* Destination Country */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Destination Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-600"
            >
              <option value="">All Countries</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Degree Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Degree Level
            </label>
            <div className="space-y-1.5 text-xs text-slate-700">
              {[
                { id: '', label: 'Any Degree' },
                { id: 'masters', label: 'Master\'s Degree' },
                { id: 'phd', label: 'Doctorate (PhD)' },
                { id: 'bachelors', label: 'Bachelor\'s Degree' },
              ].map(d => (
                <label key={d.id} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input
                    type="radio"
                    name="degreeLevel"
                    checked={selectedDegree === d.id}
                    onChange={() => setSelectedDegree(d.id)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span>{d.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Funding Coverage */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Funding Coverage
            </label>
            <div className="space-y-1.5 text-xs text-slate-700">
              {[
                { id: '', label: 'All Funding Types' },
                { id: 'fully_funded', label: 'Fully Funded (100% + Stipend)' },
                { id: 'partially_funded', label: 'Partially Funded' },
                { id: 'tuition_waiver', label: 'Tuition Waiver' },
              ].map(f => (
                <label key={f.id} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input
                    type="radio"
                    name="fundingType"
                    checked={selectedFunding === f.id}
                    onChange={() => setSelectedFunding(f.id)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span>{f.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Specific Requirements toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Benefits & Stipends
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={requiresStipend}
                onChange={(e) => setRequiresStipend(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Must Include Monthly Living Stipend</span>
            </label>
          </div>

          {/* Field of Study */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Popular Fields
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-600"
            >
              <option value="">All Fields / Open to Any</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Quick Profile Prompt */}
          {!profile && (
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 text-xs text-blue-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Want personalized match scores?</span>
              </div>
              <p className="text-[11px] text-blue-700 leading-snug">
                Set up your academic profile to see real eligibility fit and custom rankings.
              </p>
            </div>
          )}

        </aside>

        {/* Scholarships Content List / Grid */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Results summary count */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-800 font-semibold">{filteredScholarships.length}</strong> scholarships
            </span>
            <span>All records verified directly from official sources</span>
          </div>

          {/* Empty State */}
          {filteredScholarships.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">No scholarships match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Try broadening your search query, clearing specific country filters, or removing the stipend requirement.
                </p>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "space-y-4"}>
              {filteredScholarships.map(s => (
                <ScholarshipCard
                  key={s.id}
                  scholarship={s}
                  recommendation={evaluatedMap.get(s.id)}
                  viewMode={viewMode}
                  onOpenExplain={(rec) => setActiveExplainRec(rec)}
                />
              ))}
            </div>
          )}

        </div>

      </div>

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
