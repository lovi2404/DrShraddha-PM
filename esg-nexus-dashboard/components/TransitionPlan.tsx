
import React, { useMemo } from 'react';
import { TRANSITION_PLAN } from '../constants';
import Tooltip from './Tooltip';

interface TransitionPlanProps {
  globalYear: string;
  globalStandard: string;
}

const TransitionPlan: React.FC<TransitionPlanProps> = ({ globalYear, globalStandard }) => {
  const filteredSteps = useMemo(() => {
    return TRANSITION_PLAN.filter(step => {
      const yearMatch = parseInt(step.year) <= parseInt(globalYear);
      const standardMatch = !step.standard || step.standard.includes(globalStandard);
      return yearMatch && standardMatch;
    });
  }, [globalYear, globalStandard]);

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'Assured': return "Independently verified by third-party auditors.";
      case 'Active': return "Currently being implemented in this fiscal year.";
      case 'Planned': return "Scheduled for future implementation phase.";
      case 'Budgeting': return "Awaiting financial approval and resource allocation.";
      case 'Completed': return "Successfully executed and documented.";
      default: return "Current status of the milestone.";
    }
  };

  return (
    <div className="xl:col-span-1 rounded-xl bg-[#1d2a25] border border-[#283933] p-0 overflow-hidden flex flex-col transition-all duration-500">
      <div className="p-5 border-b border-[#283933] bg-[#1d2a25]">
        <h3 className="text-white text-lg font-bold">Transition Plan</h3>
        <p className="text-[#9db9b0] text-xs">Milestones achieved up to <span className="text-primary font-bold">{globalYear}</span></p>
      </div>
      <div className="flex flex-col relative overflow-y-auto max-h-[400px] scrollbar-hide">
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#283933]"></div>
        {filteredSteps.length > 0 ? (
          filteredSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-3 p-4 hover:bg-[#283933]/30 transition-all relative z-10 group animate-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <div 
                className="mt-1 size-4 rounded-full border-4 border-[#1d2a25]"
                style={{ 
                  backgroundColor: step.color,
                  boxShadow: `0 0 0 1px ${step.color}`
                }}
              ></div>
              <div className="flex-1">
                <p className="text-white text-sm font-bold group-hover:text-primary transition-colors">{step.title}</p>
                <p className="text-[#9db9b0] text-[10px] mb-1">{step.date}</p>
                <div className="flex flex-wrap gap-2">
                  <Tooltip content={getStatusInfo(step.status)} position="right">
                    <span 
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded border cursor-help"
                      style={{ 
                        color: step.color, 
                        backgroundColor: `${step.color}1A`, 
                        borderColor: `${step.color}33`
                      }}
                    >
                      {step.status}
                    </span>
                  </Tooltip>
                  {step.tags?.map(tag => (
                    <span key={tag} className="text-[#9db9b0] text-[10px] bg-[#283933] px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-[#5c736a] text-3xl mb-2">history</span>
            <p className="text-[#9db9b0] text-xs font-medium italic">No milestones found for this filter combination.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransitionPlan;
