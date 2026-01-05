
import React, { useMemo } from 'react';
import { RISK_REGISTRY } from '../constants';
import { RiskEntry } from '../types';

const RiskRegistry: React.FC = () => {
  const physicalRisks = useMemo(() => RISK_REGISTRY.filter(r => r.category === 'Physical'), []);
  const transitionRisks = useMemo(() => RISK_REGISTRY.filter(r => r.category === 'Transition'), []);

  return (
    <div className="px-4 py-8 md:px-10 lg:px-20 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500 relative">
      <div className="absolute top-20 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative z-10">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight uppercase">Risk Intelligence Center</h2>
          <p className="text-text-secondary font-bold mt-2 uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
            <span className="material-symbols-outlined text-[16px] text-amber-custom">warning</span> 
            TCFD Compliance Framework • Global Asset Resilience Monitoring
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/60 p-2 rounded-2xl border border-white/5">
           <div className="flex items-center gap-2 px-3 border-r border-white/10">
              <span className="size-2 rounded-full bg-red-500 shadow-glow-red"></span>
              <span className="text-[9px] font-black text-slate-400 uppercase">Critical</span>
           </div>
           <div className="flex items-center gap-2 px-3 border-r border-white/10">
              <span className="size-2 rounded-full bg-amber-500"></span>
              <span className="text-[9px] font-black text-slate-400 uppercase">Moderate</span>
           </div>
           <div className="flex items-center gap-2 px-3">
              <span className="size-2 rounded-full bg-emerald-500"></span>
              <span className="text-[9px] font-black text-slate-400 uppercase">Managed</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-16 relative z-10">
        {/* Transition Risks Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
             <div className="h-px flex-1 bg-gradient-to-r from-transparent to-indigo-500/30"></div>
             <h3 className="text-xl font-black text-indigo-400 tracking-tight uppercase flex items-center gap-3">
                <span className="material-symbols-outlined">sync_alt</span>
                Transition Risk Portfolio
             </h3>
             <div className="h-px flex-1 bg-gradient-to-l from-transparent to-indigo-500/30"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {transitionRisks.map(risk => (
              <RiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </section>

        {/* Physical Risks Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
             <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/30"></div>
             <h3 className="text-xl font-black text-amber-400 tracking-tight uppercase flex items-center gap-3">
                <span className="material-symbols-outlined">waves</span>
                Physical Asset Resilience
             </h3>
             <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/30"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {physicalRisks.map(risk => (
              <RiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const RiskCard: React.FC<{ risk: RiskEntry }> = ({ risk }) => {
  const isTransition = risk.category === 'Transition';
  const accentColor = isTransition ? 'indigo' : 'amber';
  
  return (
    <div className={`p-8 rounded-3xl bg-surface-dark/40 border-2 border-border-dark hover:border-${accentColor}-500/30 transition-all group shadow-xl relative backdrop-blur-sm`}>
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className={`absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity transform translate-x-1/4 -translate-y-1/4`}>
            <span className="material-symbols-outlined text-[100px]">{isTransition ? 'trending_up' : 'warning'}</span>
        </div>
      </div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`size-10 rounded-xl flex items-center justify-center bg-${accentColor}-500/10 text-${accentColor}-400 border border-white/5`}>
            <span className="material-symbols-outlined text-[20px]">{isTransition ? 'sync_alt' : 'tsunami'}</span>
          </div>
          <div>
            <h4 className="text-base font-black text-white group-hover:text-white transition-colors">{risk.risk}</h4>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{risk.type} Factor</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-white leading-none tracking-tight">{risk.financialExposure}</p>
          <p className="text-[8px] font-black text-slate-600 uppercase mt-1">VaR Exposure</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5">
          <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Impact Potential</p>
          <span className={`text-[10px] font-black uppercase ${risk.impact === 'High' ? 'text-red-400' : 'text-amber-400'}`}>{risk.impact}</span>
        </div>
        <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5">
          <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Occurrence Prob.</p>
          <span className={`text-[10px] font-black uppercase ${risk.probability === 'High' ? 'text-red-400' : 'text-amber-400'}`}>{risk.probability}</span>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2 mb-2">
           <span className="material-symbols-outlined text-[14px] text-emerald-500">security</span>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mitigation Strategy</p>
        </div>
        <p className="text-xs text-slate-400 font-medium leading-relaxed italic border-l-2 border-emerald-500/30 pl-3">
          "{risk.mitigation}"
        </p>
      </div>
    </div>
  );
};

export default RiskRegistry;
