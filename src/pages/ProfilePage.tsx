import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentProfile, DegreeLevel } from '../types';
import { 
  User, 
  GraduationCap, 
  Globe, 
  DollarSign, 
  BookOpen, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  RotateCcw,
  Award
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, resetToDemoProfile, clearProfile } = useApp();

  const [formData, setFormData] = useState<Partial<StudentProfile>>(profile || {});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof StudentProfile, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleCountryToggle = (country: string) => {
    const list = formData.preferred_countries || [];
    if (list.includes(country)) {
      handleChange('preferred_countries', list.filter(c => c !== country));
    } else {
      handleChange('preferred_countries', [...list, country]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const loadPreset = (preset: 'masters_ai' | 'phd_stem' | 'undergrad') => {
    if (preset === 'masters_ai') {
      const p: Partial<StudentProfile> = {
        full_name: 'Alex Rivera',
        citizenship: 'Mexico',
        residence_country: 'Mexico',
        current_education_level: 'Bachelor Degree',
        highest_completed_degree: 'BSc in Software Engineering',
        gpa: 3.75,
        grading_scale: '4.0',
        target_degree: 'masters',
        field_of_study: 'Computer Science & AI',
        preferred_countries: ['United Kingdom', 'Germany', 'United States'],
        language_test_status: 'taken',
        language_test_type: 'IELTS',
        language_test_score: 7.5,
        funding_need: 'full_only',
        years_of_work_experience: 2.5,
        has_research_experience: true,
        publications_count: 1,
        profile_completion_percentage: 95
      };
      setFormData(p);
      updateProfile(p);
    } else if (preset === 'phd_stem') {
      const p: Partial<StudentProfile> = {
        full_name: 'Dr. Aspirant Chen',
        citizenship: 'Singapore',
        residence_country: 'Singapore',
        current_education_level: 'Master Degree',
        highest_completed_degree: 'MSc in Physics',
        gpa: 3.92,
        grading_scale: '4.0',
        target_degree: 'phd',
        field_of_study: 'Quantum Science & Nanotechnology',
        preferred_countries: ['Switzerland', 'Singapore', 'Canada', 'United Kingdom'],
        language_test_status: 'exempt',
        funding_need: 'full_only',
        years_of_work_experience: 1.0,
        has_research_experience: true,
        publications_count: 3,
        profile_completion_percentage: 100
      };
      setFormData(p);
      updateProfile(p);
    } else {
      const p: Partial<StudentProfile> = {
        full_name: 'Sara Tanaka',
        citizenship: 'Brazil',
        residence_country: 'Brazil',
        current_education_level: 'High School',
        highest_completed_degree: 'High School Diploma',
        gpa: 3.8,
        grading_scale: '4.0',
        target_degree: 'bachelors',
        field_of_study: 'Environmental Engineering',
        preferred_countries: ['Japan', 'Australia', 'United Kingdom'],
        language_test_status: 'planning_to_take',
        funding_need: 'full_only',
        years_of_work_experience: 0,
        has_research_experience: false,
        publications_count: 0,
        profile_completion_percentage: 75
      };
      setFormData(p);
      updateProfile(p);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const popularCountries = [
    'United Kingdom', 'United States', 'Germany', 'European Union', 
    'Australia', 'Canada', 'Japan', 'Singapore', 'Switzerland', 'France'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-7 h-7 text-blue-600" />
            <span>Academic Profile & Preferences</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Updating your qualifications and preferences automatically recalculates your AI recommendation scores.
          </p>
        </div>

        {/* Profile Completion Indicator */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completion</span>
            <span className="text-sm font-extrabold text-blue-600">{profile?.profile_completion_percentage || 50}%</span>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500 flex items-center justify-center font-bold text-xs text-slate-800">
            {profile?.profile_completion_percentage || 50}%
          </div>
        </div>
      </div>

      {/* Profile Preset Switcher */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-blue-900">⚡ Test Instant Student Presets:</span>
          <p className="text-blue-700 text-[11px] mt-0.5">Quickly toggle candidate personas to test how the ranking algorithms react.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => loadPreset('masters_ai')}
            className="px-2.5 py-1.5 bg-white border border-blue-300 text-blue-800 hover:bg-blue-50 rounded-lg font-semibold transition"
          >
            Master's AI Seeker
          </button>
          <button
            type="button"
            onClick={() => loadPreset('phd_stem')}
            className="px-2.5 py-1.5 bg-white border border-blue-300 text-blue-800 hover:bg-blue-50 rounded-lg font-semibold transition"
          >
            PhD STEM Researcher
          </button>
          <button
            type="button"
            onClick={() => loadPreset('undergrad')}
            className="px-2.5 py-1.5 bg-white border border-blue-300 text-blue-800 hover:bg-blue-50 rounded-lg font-semibold transition"
          >
            Undergrad Aspirant
          </button>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
        
        {/* Section 1: Personal & Degree */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Academic Standing & Target Degree</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                value={formData.full_name || ''}
                onChange={(e) => handleChange('full_name', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Country of Citizenship</label>
              <input
                type="text"
                value={formData.citizenship || ''}
                onChange={(e) => handleChange('citizenship', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Target Degree</label>
              <select
                value={formData.target_degree || 'masters'}
                onChange={(e) => handleChange('target_degree', e.target.value as DegreeLevel)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
              >
                <option value="masters">Master's (Taught or Research)</option>
                <option value="phd">PhD / Doctoral Fellowship</option>
                <option value="bachelors">Bachelor's Degree</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Current / Latest GPA</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={formData.gpa ?? 3.5}
                  onChange={(e) => handleChange('gpa', parseFloat(e.target.value) || 0)}
                  className="w-2/3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
                <select
                  value={formData.grading_scale || '4.0'}
                  onChange={(e) => handleChange('grading_scale', e.target.value)}
                  className="w-1/3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="4.0">/ 4.0</option>
                  <option value="5.0">/ 5.0</option>
                  <option value="10.0">/ 10.0</option>
                  <option value="100%">100%</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Field of Study / Major</label>
              <input
                type="text"
                value={formData.field_of_study || ''}
                onChange={(e) => handleChange('field_of_study', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Preferred Destinations */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Target Study Destinations</span>
          </h2>

          <div className="space-y-2 text-xs">
            <label className="font-bold text-slate-700">Selected Countries:</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {popularCountries.map(c => {
                const active = (formData.preferred_countries || []).includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCountryToggle(c)}
                    className={`p-2 rounded-xl font-medium border text-xs transition ${
                      active 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Financial & Language */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Funding & Test Requirements</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Financial Funding Need</label>
              <select
                value={formData.funding_need || 'full_only'}
                onChange={(e) => handleChange('funding_need', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
              >
                <option value="full_only">Full Funding Only (100% Tuition + Living Stipend)</option>
                <option value="partial_acceptable">Partial Funding Acceptable</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Language Test Status</label>
              <select
                value={formData.language_test_status || 'taken'}
                onChange={(e) => handleChange('language_test_status', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
              >
                <option value="taken">Exam Taken</option>
                <option value="planning_to_take">Planning to Take</option>
                <option value="exempt">Exempt (English medium prior degree)</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Work & Research */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Research & Work Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Years of Work Experience</label>
              <input
                type="number"
                step="0.5"
                value={formData.years_of_work_experience ?? 1}
                onChange={(e) => handleChange('years_of_work_experience', parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Peer-Reviewed Publications</label>
              <input
                type="number"
                value={formData.publications_count ?? 0}
                onChange={(e) => handleChange('publications_count', parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={resetToDemoProfile}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Student</span>
          </button>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Updated! Recalculating recommendations...
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Recommendations</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
