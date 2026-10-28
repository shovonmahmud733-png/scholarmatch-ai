import React, { useState } from 'react';
import { ApplicationTrackerItem, ApplicationStage } from '../../types';
import { 
  X, 
  Calendar, 
  CheckSquare, 
  Square, 
  Trash2, 
  Save, 
  ExternalLink,
  Clock,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  application: ApplicationTrackerItem | null;
  onClose: () => void;
}

const STAGES: { value: ApplicationStage; label: string }[] = [
  { value: 'interested', label: 'Interested' },
  { value: 'planning_to_apply', label: 'Planning to Apply' },
  { value: 'preparing_documents', label: 'Preparing Documents' },
  { value: 'ready_to_submit', label: 'Ready to Submit' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview_assessment', label: 'Interview / Assessment' },
  { value: 'accepted', label: 'Accepted 🎉' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

export const ApplicationDetailModal: React.FC<Props> = ({ application, onClose }) => {
  const { 
    updateApplicationStage, 
    updateApplicationNotes, 
    updateApplicationDeadline, 
    toggleChecklistItem, 
    removeApplication 
  } = useApp();

  if (!application) return null;

  const [notes, setNotes] = useState(application.personal_notes);
  const [deadline, setDeadline] = useState(application.custom_deadline || '');
  const [stage, setStage] = useState(application.status);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateApplicationStage(application.id, stage);
    updateApplicationNotes(application.id, notes);
    updateApplicationDeadline(application.id, deadline);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const completedCount = application.checklist.filter(c => c.completed).length;
  const progressPercent = application.checklist.length > 0 
    ? Math.round((completedCount / application.checklist.length) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" />
            <span>Application Workspace</span>
          </div>

          <h3 className="text-xl font-bold pr-8 leading-snug">
            {application.scholarship.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {application.scholarship.provider} • {application.scholarship.destination_country}
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Stage Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Application Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as ApplicationStage)}
              className="w-full text-sm font-semibold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            >
              {STAGES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Internal Custom Deadline */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Target Submission Deadline</span>
              <span className="text-[11px] text-slate-400 font-normal">
                Official deadline: {application.scholarship.application_deadline}
              </span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
          </div>

          {/* Document Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Application Checklist ({completedCount}/{application.checklist.length})
              </label>
              <span className="text-xs font-bold text-blue-600">{progressPercent}% Ready</span>
            </div>

            {/* Checklist progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="space-y-2 pt-1">
              {application.checklist.map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleChecklistItem(application.id, item.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                    item.completed 
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-700 line-through' 
                      : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300'
                  }`}
                >
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs font-medium leading-relaxed">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Personal Notes, Tasks & Supervisor Contacts
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record essay outlines, professor communications, referee confirmation dates, or interview prep questions..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none transition leading-relaxed"
            ></textarea>
          </div>

          {/* Quick Notice */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Official Scholarship Portal:</span>
            <a 
              href={application.scholarship.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold inline-flex items-center gap-1"
            >
              Open Direct Application <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to remove this scholarship from your application tracker?')) {
                removeApplication(application.id);
                onClose();
              }
            }}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-50 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove from Tracker</span>
          </button>

          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs text-emerald-600 font-semibold animate-fade-in">
                Saved!
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Progress</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
