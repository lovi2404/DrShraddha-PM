
import React, { useMemo } from 'react';
import { StatData } from '../types';
import Tooltip from './Tooltip';

interface Props {
  data: StatData;
  globalScope: string;
  globalStandard: string;
}

const StatCard: React.FC<Props> = ({ data, globalScope, globalStandard }) => {
  const isUp = data.trend === 'up';

  // Dynamic value logic
  const displayValue = useMemo(() => {
    const rawValue = parseFloat(data.value.replace(/[^0-9.]/g, ''));
    const isCurrency = data.value.includes('$');
    const isPercentage = data.value.includes('%');
    
    let scaledValue = rawValue;
    
    // Scale based on scope size
    if (globalScope !== 'Global') {
      const scopeMultiplier: Record<string, number> = {
        'United States': 0.25,
        'Europe': 0.3,
        'Asia': 0.35,
        'United Kingdom': 0.08,
        'Oceania': 0.02
      };
      scaledValue = rawValue * (scopeMultiplier[globalScope] || 0.1);
    }

    // Format output
    if (isPercentage) return `${scaledValue.toFixed(0)}%`;
    if (isCurrency) return `$${scaledValue.toFixed(1)}M`;
    return scaledValue.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }, [data.value, globalScope]);

  // Check if standard matches
  const isRelevantToStandard = !data.standard || data.standard.includes(globalStandard);

  const getStatInfo = (label: string) => {
    if (label.includes('GHG')) return "Direct and indirect emissions across the entire value chain.";
    if (label.includes('Financial')) return "Projected capital expenditure required for climate transition.";
    if (label.includes('Governance')) return "Alignment of board compensation with ESG targets.";
    if (label.includes('Carbon Price')) return "Internal shadow price used to evaluate investment risk.";
    return "Key performance indicator for sustainability monitoring.";
  };

  return (
    <div 
      className={`p-5 rounded-xl bg-[#1d2a25] border transition-all duration-500 group relative overflow-hidden ${
        isRelevantToStandard ? 'border-[#283933] hover:border-primary/30' : 'border-dashed opacity-50 grayscale border-[#283933]'
      }`} 
      tabIndex={0}
    >
      <div className="absolute right-0 top-0 p-2 opacity-5" aria-hidden="true">
        <span className="material-symbols-outlined text-9xl">{data.bgIcon}</span>
      </div>
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex items-center gap-1.5">
          <h3 className="text-[#9db9b0] text-sm font-medium">{data.label}</h3>
          <Tooltip content={getStatInfo(data.label)}>
            <span className="material-symbols-outlined text-[14px] text-[#5c736a] hover:text-primary transition-colors cursor-help">info</span>
          </Tooltip>
        </div>
        <span className={`${data.color} bg-current/10 rounded p-1 text-[20px] material-symbols-outlined`} aria-hidden="true">
          {data.icon}
        </span>
      </div>
      <p className="text-white text-2xl font-bold mb-1 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {displayValue} <span className="text-base text-[#9db9b0] font-normal">{data.unit}</span>
      </p>
      <div className="flex items-center gap-1 relative z-10">
        {data.trend !== 'neutral' && (
          <>
            <span className={`material-symbols-outlined text-[16px] ${data.color}`} aria-hidden="true">
              {isUp ? 'trending_up' : 'trending_down'}
            </span>
          </>
        )}
        <span className={`${data.color} text-xs font-bold`}>{data.percentage}</span>
        <span className="text-muted-text text-xs ml-1">{globalScope} View</span>
      </div>
    </div>
  );
};

export default StatCard;
