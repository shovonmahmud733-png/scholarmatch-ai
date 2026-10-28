import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StudentProfile, DegreeLevel } from '../types';
import { 
  User, 
  GraduationCap, 
  Globe, 
  DollarSign, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle,
  Save
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, resetToDemoProfile } = useApp();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<StudentProfile>>({
    full_name: profile?.full_name || '',
    citizenship: profile?.citizenship || 'India',
    residence_country: profile?.residence_country || 'India',
    current_education_level: profile?.current_education_level || 'Bachelor Degree',
    highest_completed_degree: profile?.highest_completed_degree || 'Bachelor of Science',
    gpa: profile?.gpa || 3.5,
    grading_scale: profile?.grading_scale || '4.0',
    target_degree: profile?.target_degree || 'masters',
    field_of_study: profile?.field_of_study || 'Computer Science & AI',
    target_intake_year: profile?.target_intake_year || 2026,
    preferred_countries: profile?.preferred_countries || ['United Kingdom', 'Germany', 'United States'],
    preferred_study_mode: profile?.preferred_study_mode || 'on_campus',
    language_test_status: profile?.language_test_status || 'taken',
    language_test_type: profile?.language_test_type || 'IELTS',
    language_test_score: profile?.language_test_score || 7.0,
    funding_need: profile?.funding_need || 'full_only',
    tuition_waiver_required: profile?.tuition_waiver_required ?? true,
    living_stipend_required: profile?.living_stipend_required ?? true,
    travel_grant_preferred: profile?.travel_grant_preferred ?? true,
    has_research_experience: profile?.has_research_experience ?? false,
    publications_count: profile?.publications_count || 0,
    years_of_work_experience: profile?.years_of_work_experience || 1,
    leadership_extracurricular: profile?.leadership_extracurricular || '',
  });

  const [savedNotice, setSavedNotice] = useState(false);

  // Field explanation tooltips
  const explanations = {
    gpa: 'Normalizes your academic score against minimum eligibility cutoffs used by university boards.',
    citizenship: 'Filters out scholarships with bilateral government restrictions or designated eligible country lists (e.g., DAC list).',
    target_degree: 'Separates undergraduate grants from master\'s and doctoral fellowships.',
    funding_need: 'Prioritizes scholarships that cover living stipends and flight tickets for students who need 100% financial support.',
    research: 'Enables matching with doctoral research grants like SINGA, Swiss Excellence, or Vanier.',
  };

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

  const handleSaveProgress = () => {
    updateProfile(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    navigate('/recommendations');
  };

  const popularCountries = [
    'United Kingdom', 'United States', 'Germany', 'European Union', 
    'Australia', 'Canada', 'Japan', 'Singapore', 'Switzerland', 'France'
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Profile Onboarding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Personalize Your Scholarship Matching
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Every field helps our recommendation engine eliminate opportunities you aren't eligible for and spotlight the ones where you have the highest standing.
        </p>

        {/* Quick Pre-fill helper */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              resetToDemoProfile();
              navigate('/recommendations');
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
          >
            <span>⚡ Or pre-fill with verified sample student profile (1-click test)</span>
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className={step >= 1 ? 'text-blue-600' : 'text-slate-400'}>1. Academics</span>
          <span className={step >= 2 ? 'text-blue-600' : 'text-slate-400'}>2. Destinations</span>
          <span className={step >= 3 ? 'text-blue-600' : 'text-slate-400'}>3. Financials</span>
          <span className={step >= 4 ? 'text-blue-600' : 'text-slate-400'}>4. Experience</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        {/* STEP 1: Personal and Academic */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>Personal & Academic Profile</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Essential background to verify GPA cutoffs and citizenship criteria.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name || ''}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Country of Citizenship</label>
                  <span className="text-[10px] text-blue-600 font-medium" title={explanations.citizenship}>Why needed?</span>
                </div>
                <input
                  type="text"
                  value={formData.citizenship || ''}
                  onChange={(e) => handleChange('citizenship', e.target.value)}
                  placeholder="e.g. Mexico, India, Kenya, Nigeria..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Target Degree Level</label>
                <select
                  value={formData.target_degree || 'masters'}
                  onChange={(e) => handleChange('target_degree', e.target.value as DegreeLevel)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="masters">Master's Degree (MSc, MA, LLM)</option>
                  <option value="phd">Doctorate (PhD / DPhil)</option>
                  <option value="bachelors">Bachelor's Degree (Undergraduate)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Cumulative GPA / Score</label>
                  <span className="text-[10px] text-blue-600 font-medium" title={explanations.gpa}>Scale normalized</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.gpa || ''}
                    onChange={(e) => handleChange('gpa', parseFloat(e.target.value) || 0)}
                    placeholder="3.5"
                    className="w-2/3 text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                  <select
                    value={formData.grading_scale || '4.0'}
                    onChange={(e) => handleChange('grading_scale', e.target.value)}
                    className="w-1/3 text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value="4.0">/ 4.0</option>
                    <option value="5.0">/ 5.0</option>
                    <option value="10.0">/ 10.0</option>
                    <option value="100%">100%</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Target Field of Study</label>
                <input
                  type="text"
                  value={formData.field_of_study || ''}
                  onChange={(e) => handleChange('field_of_study', e.target.value)}
                  placeholder="e.g. Computer Science, Public Policy, Energy..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Study Preferences */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span>Destination Preferences</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your preferred host study countries.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700">
                Preferred Study Countries (select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {popularCountries.map(country => {
                  const isSelected = (formData.preferred_countries || []).includes(country);
                  return (
                    <button
                      type="button"
                      key={country}
                      onClick={() => handleCountryToggle(country)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition flex items-center justify-between ${
                        isSelected 
                          ? 'bg-blue-50 text-blue-800 border-blue-400' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{country}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">English Language Test Status</label>
                <select
                  value={formData.language_test_status || 'none'}
                  onChange={(e) => handleChange('language_test_status', e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="taken">Exam Already Taken (IELTS / TOEFL)</option>
                  <option value="planning_to_take">Planning to Take Exam</option>
                  <option value="exempt">Native Speaker / Prior Degree in English</option>
                  <option value="none">No Exam Taken Yet</option>
                </select>
              </div>

              {formData.language_test_status === 'taken' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Exam Score (e.g. IELTS Overall)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.language_test_score || ''}
                    onChange={(e) => handleChange('language_test_score', parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 7.5"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Financial Preferences */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>Financial Funding Preferences</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Help us rank awards according to your real financial constraints.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700">Funding Coverage Requirement</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'full_only', label: '100% Full Funding', desc: 'Must include 100% tuition + monthly living stipend' },
                  { id: 'partial_acceptable', label: 'Partial Acceptable', desc: 'Tuition waiver acceptable with partial stipend' },
                  { id: 'flexible', label: 'Flexible Support', desc: 'Open to merit tuition discounts & external top-ups' },
                ].map(item => (
                  <label 
                    key={item.id}
                    className={`p-3.5 rounded-xl border cursor-pointer transition block ${
                      formData.funding_need === item.id 
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="funding_need"
                      checked={formData.funding_need === item.id}
                      onChange={() => handleChange('funding_need', item.id)}
                      className="sr-only"
                    />
                    <p className="font-bold text-xs">{item.label}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700">Non-Negotiable Needs</label>
              <div className="space-y-2 text-xs text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.living_stipend_required ?? true}
                    onChange={(e) => handleChange('living_stipend_required', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Require monthly cash living stipend for rent and food</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.travel_grant_preferred ?? true}
                    onChange={(e) => handleChange('travel_grant_preferred', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Prefer coverage of international round-trip airfare</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Experience & Research */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Experience & Leadership Qualifications</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Key differentiators for prestigious programs like Chevening, Gates, and Fulbright.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Work or Internship Experience (Years)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.years_of_work_experience ?? 1}
                  onChange={(e) => handleChange('years_of_work_experience', parseFloat(e.target.value) || 0)}
                  placeholder="2.0"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Peer-Reviewed Publications Count</label>
                <input
                  type="number"
                  value={formData.publications_count ?? 0}
                  onChange={(e) => handleChange('publications_count', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Leadership & Extracurricular Accomplishments</label>
                <textarea
                  rows={3}
                  value={formData.leadership_extracurricular || ''}
                  onChange={(e) => handleChange('leadership_extracurricular', e.target.value)}
                  placeholder="e.g. Student society president, NGO volunteering, hackathon awards, project leads..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveProgress}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savedNotice ? 'Saved Draft!' : 'Save Incomplete Profile'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Calculate My Scholarship Matches</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
