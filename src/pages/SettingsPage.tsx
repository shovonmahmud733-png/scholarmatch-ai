import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Sliders, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetToDemoProfile, clearProfile } = useApp();
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-blue-600" />
          <span>Account Settings & Methodology</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage reminder notifications, inspect ML scoring parameters, and manage local data.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* 1. Notification Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Deadline & Recommendation Reminders</h2>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={deadlineReminders}
                onChange={(e) => setDeadlineReminders(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-bold text-slate-900">Upcoming Deadline Alerts</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Receive notifications 30 days and 7 days prior to saved scholarship deadlines.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-bold text-slate-900">New High-Match Scholarships</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Get notified whenever an newly audited scholarship matches your profile with score ≥85%.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* 2. Machine Learning Weighting Transparency */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">Scoring Model Weights (Layer 3 Ranking)</h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            ScholarMatch AI implements an explicit, transparent scoring model. Below are the verified feature weights applied in the multi-factor scoring matrix:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px]">Academic GPA Floor</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">25% Weight</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px]">Degree Level Compatibility</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">20% Weight</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px]">Discipline / Field Relevance</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">20% Weight</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px]">Destination Match</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">15% Weight</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px]">Funding Need Satisfaction</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">10% Weight</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px]">Research / Publications</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">10% Weight</p>
            </div>
          </div>
        </div>

        {/* 3. Demo Reset & Privacy Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Data Management & Reset</h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            All profile attributes and applications are stored locally in your browser storage. You can restore demo defaults or clear your profile at any time.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                resetToDemoProfile();
                alert('Default demo student profile and applications restored.');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Demo Student Data</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all local saved data, applications, and profile?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipe Local Browser Storage</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
