import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ApplicationTrackerItem, ApplicationStage } from '../types';
import { ApplicationDetailModal } from '../components/tracker/ApplicationDetailModal';
import { 
  Layers, 
  Plus, 
  Calendar, 
  CheckSquare, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Kanban,
  List,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const STAGES: { id: ApplicationStage; label: string; color: string }[] = [
  { id: 'interested', label: 'Interested', color: 'border-slate-300 bg-slate-50' },
  { id: 'planning_to_apply', label: 'Planning to Apply', color: 'border-blue-300 bg-blue-50/50' },
  { id: 'preparing_documents', label: 'Preparing Documents', color: 'border-amber-300 bg-amber-50/50' },
  { id: 'ready_to_submit', label: 'Ready to Submit', color: 'border-purple-300 bg-purple-50/50' },
  { id: 'applied', label: 'Applied', color: 'border-indigo-300 bg-indigo-50/50' },
  { id: 'interview_assessment', label: 'Interview / Assessment', color: 'border-cyan-300 bg-cyan-50/50' },
  { id: 'accepted', label: 'Accepted 🎉', color: 'border-emerald-300 bg-emerald-50/50' },
  { id: 'rejected', label: 'Rejected', color: 'border-rose-300 bg-rose-50/50' },
  { id: 'withdrawn', label: 'Withdrawn', color: 'border-gray-300 bg-gray-50/50' },
];

export const ApplicationsPage: React.FC = () => {
  const { applications, updateApplicationStage, scholarships, addToTracker } = useApp();
  const [activeModalApp, setActiveModalApp] = useState<ApplicationTrackerItem | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const getAppsForStage = (stage: ApplicationStage) => {
    return applications.filter(a => a.status === stage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-blue-600" />
            <span>Scholarship Application Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize personal deadlines, document checklists, and submission milestones across all 9 application stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'kanban' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <Link
            to="/scholarships"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Opportunity</span>
          </Link>
        </div>
      </div>

      {/* Honest Tracking Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 flex items-center justify-between gap-2">
        <span>
          💡 <strong>Personal Tracking Workspace:</strong> ScholarMatch AI organizes your materials and milestones. Applications must be officially submitted directly via each provider's portal.
        </span>
        <span className="text-[11px] text-slate-400 shrink-0 font-medium">
          {applications.length} Tracked
        </span>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900">Your application tracker is empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Explore our verified scholarship catalog or AI recommendations and click "Add to Application Tracker" to begin organizing your submissions.
            </p>
          </div>
          <Link
            to="/scholarships"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <span>Browse Scholarships</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="flex gap-4 overflow-x-auto pb-6 items-start">
          {STAGES.map(stage => {
            const stageApps = getAppsForStage(stage.id);
            return (
              <div 
                key={stage.id}
                className="w-72 shrink-0 bg-slate-100/80 rounded-2xl border border-slate-200 p-3 space-y-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-xs text-slate-800 truncate">
                    {stage.label}
                  </h3>
                  <span className="text-xs font-bold bg-white text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards List in this stage */}
                <div className="space-y-2.5 min-h-[120px]">
                  {stageApps.length === 0 ? (
                    <div className="h-24 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-[11px] text-slate-400">
                      Drop items here
                    </div>
                  ) : (
                    stageApps.map(app => {
                      const completedCount = app.checklist.filter(c => c.completed).length;
                      return (
                        <div
                          key={app.id}
                          onClick={() => setActiveModalApp(app)}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition cursor-pointer space-y-2.5 group"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              {app.scholarship.destination_country}
                            </span>
                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 leading-snug line-clamp-2">
                              {app.scholarship.title}
                            </h4>
                          </div>

                          {/* Quick checklist count */}
                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                            <span className="flex items-center gap-1">
                              <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                              <span>{completedCount}/{app.checklist.length} Tasks</span>
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {new Date(app.custom_deadline || app.scholarship.application_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          {/* Stage mover dropdown */}
                          <div onClick={(e) => e.stopPropagation()} className="pt-1">
                            <select
                              value={app.status}
                              onChange={(e) => updateApplicationStage(app.id, e.target.value as ApplicationStage)}
                              className="w-full text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-1 cursor-pointer focus:outline-none"
                            >
                              {STAGES.map(s => (
                                <option key={s.id} value={s.id}>Move to: {s.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-200">
          {applications.map(app => {
            const completedCount = app.checklist.filter(c => c.completed).length;
            return (
              <div 
                key={app.id} 
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {app.scholarship.destination_country}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-600">{app.scholarship.provider}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{app.scholarship.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Target deadline: {app.custom_deadline || app.scholarship.application_deadline}
                    </span>
                    <span className="flex items-center gap-1 text-blue-700 font-medium">
                      <CheckSquare className="w-3.5 h-3.5" />
                      {completedCount} of {app.checklist.length} documents ready
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <select
                    value={app.status}
                    onChange={(e) => updateApplicationStage(app.id, e.target.value as ApplicationStage)}
                    className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer"
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setActiveModalApp(app)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Manage Tasks</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Detail / Checklist Modal */}
      {activeModalApp && (
        <ApplicationDetailModal
          application={activeModalApp}
          onClose={() => setActiveModalApp(null)}
        />
      )}

    </div>
  );
};
