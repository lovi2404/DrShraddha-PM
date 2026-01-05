
import React from 'react';
import { CompanyRegistryEntry } from '../types';

interface PlanningViewProps {
  selectedData: CompanyRegistryEntry;
}

const PlanningView: React.FC<PlanningViewProps> = ({ selectedData }) => {
  const milestones = selectedData.milestones || [];
  
  const completedCount = milestones.filter(m => m.status === 'Completed').length;
  const progressPercentage = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div className="px-4 py-8 md:px-10 lg:px-20 max-w-[1600px] mx-auto w-full animate-in slide-in-from-right duration-500 relative">
      <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8 relative z-10">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="size-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border-2 border-primary/20 shadow-glow-primary">
              <span className="material-symbols-outlined text-[24px]">map</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight uppercase">Strategic Roadmap</h2>
          </div>
          <p className="text-text-secondary font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
             <span className="text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{selectedData.name}</span>
             • 1.5°C Pathway Alignment Strategy • {selectedData.region} Region
          </p>
        </div>

        <div className="flex items-center gap-8 p-6 rounded-3xl bg-surface-dark/40 border-2 border-border-dark shadow-2xl backdrop-blur-xl">
           <div className="flex flex-col items-center">
              <div className="relative size-16 flex items-center justify-center">
                 <svg className="size-full -rotate-90 transform">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-800" />
                    <circle 
                        cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" 
                        strokeDasharray={176} 
                        strokeDashoffset={176 - (176 * progressPercentage / 100)} 
                        className="text-primary transition-all duration-1000 ease-in-out shadow-glow-primary" 
                    />
                 </svg>
                 <span className="absolute text-sm font-black text-white">{progressPercentage}%</span>
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase mt-2 tracking-widest">Roadmap Execution</p>
           </div>
           <div className="h-12 w-px bg-white/10"></div>
           <div className="flex flex-col justify-center">
              <p className="text-xl font-black text-white leading-none tracking-tight">Vanguard Phase</p>
              <p className="text-[9px] font-black text-emerald-500 uppercase mt-2 tracking-widest flex items-center gap-1.5">
                <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Status: {completedCount} / {milestones.length} Milestones Cleared
              </p>
           </div>
        </div>
      </div>

      <div className="relative relative z-10">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-slate-800 to-transparent -translate-x-1/2 hidden lg:block opacity-30"></div>
        
        <div className="grid grid-cols-1 gap-12 relative">
          {milestones.length > 0 ? milestones.map((stone, idx) => (
            <div key={idx} className={`flex flex-col lg:flex-row items-center gap-12 ${idx % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1 w-full lg:w-1/2 p-10 rounded-[2.5rem] bg-surface-dark/40 border-2 border-border-dark group hover:border-primary/40 transition-all shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className={`absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4`}>
                    <span className="material-symbols-outlined text-[120px]">{stone.status === 'Completed' ? 'verified' : 'pending_actions'}</span>
                </div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-5xl font-black text-slate-800/80 group-hover:text-primary/20 transition-colors leading-none tracking-tighter">{stone.year}</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase mt-2 tracking-[0.3em]">Temporal Marker</span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    stone.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-glow-emerald' : 
                    stone.status === 'In Progress' ? 'bg-primary/10 text-primary border-primary/20 shadow-glow-primary animate-pulse' : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}>
                    {stone.status}
                  </div>
                </div>

                <h4 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:translate-x-1 transition-transform uppercase">{stone.title}</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed italic mb-8 border-l-2 border-slate-800 pl-4">
                  "{stone.description}"
                </p>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Governing Standard</span>
                    <span className="text-[11px] font-black text-slate-400 uppercase">{stone.standard}</span>
                  </div>
                  <button className="flex items-center gap-2 px-5 py-2 bg-slate-950/50 border border-white/10 rounded-xl text-[9px] font-black text-slate-500 uppercase hover:text-white hover:border-primary/40 transition-all">
                    Asset Details
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              <div className="size-16 rounded-full bg-background-dark border-8 border-slate-900 flex items-center justify-center z-10 shadow-2xl group-hover:scale-110 transition-transform hidden lg:flex relative">
                 <div className={`size-4 rounded-full ${stone.status === 'Completed' ? 'bg-emerald-500 shadow-glow-emerald' : stone.status === 'In Progress' ? 'bg-primary shadow-glow-primary' : 'bg-slate-800'}`}></div>
                 {stone.status === 'In Progress' && <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>}
              </div>
              
              <div className="flex-1 hidden lg:block"></div>
            </div>
          )) : (
            <div className="text-center py-20 bg-surface-dark/20 rounded-3xl border-2 border-dashed border-border-dark">
                <span className="material-symbols-outlined text-slate-600 text-[64px] mb-4">folder_off</span>
                <p className="text-slate-500 font-black uppercase tracking-widest">No Strategic Milestones Defined for Registry Entry</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanningView;
