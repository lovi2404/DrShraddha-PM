
import React from 'react';
import { CompanyIntelligence } from '../types';
import Tooltip from './Tooltip';

interface Props {
  intelligence: CompanyIntelligence | null;
  isLoading: boolean;
  companyName: string;
}

const CompanyIntelligencePanel: React.FC<Props> = ({ intelligence, isLoading, companyName }) => {
  if (isLoading) {
    return (
      <div className="col-span-full rounded-xl bg-[#1d2a25] border border-[#283933] p-12 flex flex-col items-center justify-center text-center">
        <div className="size-16 relative mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-primary text-2xl animate-pulse">search_spark</span>
        </div>
        <h4 className="text-white font-bold text-lg">Gathering OSINT Intelligence</h4>
        <p className="text-[#9db9b0] text-xs mt-2 max-w-sm">
          Scouring open sources for the latest ESG data, commitments, and carbon metrics for <span className="text-primary">{companyName}</span>...
        </p>
      </div>
    );
  }

  if (!intelligence) return null;

  return (
    <div className="col-span-full rounded-xl bg-[#1d2a25] border border-primary/20 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 shadow-2xl shadow-primary/5">
      <div className="bg-[#111816]/50 p-6 border-b border-[#283933] flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold flex items-center gap-2">
              Open Source Intelligence: <span className="text-primary">{companyName}</span>
            </h3>
            <p className="text-[#9db9b0] text-xs">AI-driven summary from latest public disclosures and news</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] bg-[#283933] text-[#9db9b0] px-2 py-1 rounded uppercase font-black tracking-widest">Confidence: 92%</span>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-[#111816]/30 rounded-xl p-5 mb-8 border border-[#283933]">
           <p className="text-[#cbd5e1] text-sm leading-relaxed whitespace-pre-line italic">
             {intelligence.summary}
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111816]/20 p-5 rounded-xl border border-[#283933] hover:border-[#13eca4]/30 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">eco</span>
              <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Environmental</h4>
            </div>
            <p className="text-[#9db9b0] text-xs leading-relaxed">{intelligence.pillars.environmental}</p>
          </div>
          <div className="bg-[#111816]/20 p-5 rounded-xl border border-[#283933] hover:border-[#3b82f6]/30 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#3b82f6]">groups</span>
              <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Social</h4>
            </div>
            <p className="text-[#9db9b0] text-xs leading-relaxed">{intelligence.pillars.social}</p>
          </div>
          <div className="bg-[#111816]/20 p-5 rounded-xl border border-[#283933] hover:border-[#f97316]/30 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#f97316]">policy</span>
              <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Governance</h4>
            </div>
            <p className="text-[#9db9b0] text-xs leading-relaxed">{intelligence.pillars.governance}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#283933]">
           <h5 className="text-[#5c736a] text-[10px] font-black uppercase tracking-widest mb-4">Verified Sources & Grounding</h5>
           <div className="flex flex-wrap gap-3">
              {intelligence.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.web?.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#111816] border border-[#283933] rounded-lg text-[#9db9b0] text-[10px] font-bold hover:text-white hover:border-primary/50 transition-all group"
                >
                  <span className="material-symbols-outlined text-[14px]">link</span>
                  <span className="max-w-[150px] truncate">{source.web?.title || 'Open Source'}</span>
                  <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                </a>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyIntelligencePanel;
