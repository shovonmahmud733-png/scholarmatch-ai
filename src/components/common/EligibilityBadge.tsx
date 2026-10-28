import React from 'react';
import { EligibilityStatus } from '../../types';
import { CheckCircle2, AlertCircle, HelpCircle, XCircle } from 'lucide-react';

interface Props {
  status: EligibilityStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const EligibilityBadge: React.FC<Props> = ({ 
  status, 
  size = 'md', 
  showIcon = true 
}) => {
  const configs = {
    eligible: {
      label: 'Eligible',
      bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    potentially_eligible: {
      label: 'Potentially Eligible',
      bgColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: AlertCircle,
      iconColor: 'text-amber-600',
    },
    needs_verification: {
      label: 'Needs Verification',
      bgColor: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: HelpCircle,
      iconColor: 'text-blue-600',
    },
    ineligible: {
      label: 'Ineligible',
      bgColor: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: XCircle,
      iconColor: 'text-rose-600',
    },
  };

  const current = configs[status] || configs.needs_verification;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${current.bgColor} ${sizeClasses[size]}`}>
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{current.label}</span>
    </span>
  );
};
