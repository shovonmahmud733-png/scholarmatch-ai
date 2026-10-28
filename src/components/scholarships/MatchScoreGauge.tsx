import React from 'react';

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MatchScoreGauge: React.FC<Props> = ({ 
  score, 
  size = 'md', 
  showLabel = true 
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (val >= 70) return 'text-blue-700 bg-blue-50 border-blue-300';
    if (val >= 50) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  const colorClass = getScoreColor(score);

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-1.5">
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${colorClass}`}>
          {score}%
        </span>
        {showLabel && <span className="text-[11px] text-slate-500 font-medium">Match</span>}
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
        <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-extrabold text-xl shadow-inner ${colorClass}`}>
          {score}%
        </div>
        {showLabel && (
          <span className="text-xs font-semibold text-slate-700 mt-2">
            Match Score
          </span>
        )}
        <span className="text-[10px] text-slate-400 mt-0.5">Eligibility fit</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`px-2.5 py-1 rounded-lg text-sm font-extrabold border ${colorClass}`}>
        {score}%
      </div>
      {showLabel && (
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-800 leading-tight">Match Score</span>
          <span className="text-[10px] text-slate-500 leading-none">Profile fit</span>
        </div>
      )}
    </div>
  );
};
