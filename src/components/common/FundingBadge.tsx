import React from 'react';
import { FundingType } from '../../types';
import { Sparkles, DollarSign, Award } from 'lucide-react';

interface Props {
  type: FundingType;
  size?: 'sm' | 'md';
}

export const FundingBadge: React.FC<Props> = ({ type, size = 'sm' }) => {
  const configs = {
    fully_funded: {
      label: 'Fully Funded',
      bg: 'bg-emerald-100/80 text-emerald-900 border-emerald-300',
      icon: Sparkles,
      iconColor: 'text-emerald-700'
    },
    partially_funded: {
      label: 'Partially Funded',
      bg: 'bg-blue-100/80 text-blue-900 border-blue-300',
      icon: DollarSign,
      iconColor: 'text-blue-700'
    },
    tuition_waiver: {
      label: 'Tuition Waiver',
      bg: 'bg-purple-100/80 text-purple-900 border-purple-300',
      icon: Award,
      iconColor: 'text-purple-700'
    }
  };

  const current = configs[type] || configs.fully_funded;
  const Icon = current.icon;
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1 font-semibold';

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border font-medium ${current.bg} ${sizeClass}`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span>{current.label}</span>
    </span>
  );
};
