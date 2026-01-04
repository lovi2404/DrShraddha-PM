
import React, { useState, useMemo } from 'react';
import { RISK_REGISTRY } from '../constants';
import Tooltip from './Tooltip';

const RiskAssessmentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Physical' | 'Transition'>('Physical');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const filteredGroups = useMemo(() => {
    const groups = RISK_REGISTRY.filter(cat => cat.type === activeTab);
    // Auto-select first group if none selected
    if (!selectedGroupId && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
    return groups;
  }, [activeTab, selectedGroupId]);

  const activeGroup = useMemo(() => 
    RISK_REGISTRY.find(g => g.id === selectedGroupId), 
  [selectedGroupId]);

  const getStatusColor = (val: string) => {
    switch(val) {
      case 'High': case 'Likely': return 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20';
      case 'Medium': case 'Possible': return 'text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20';
      case 'Low': case 'Remote': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-[#9db9b0] bg-[#283933] border-[#344a42]';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Risk View Toggle & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1d2a25] border border-[#283933] p-6 rounded-xl">
        <div className="flex flex-col gap-1">
          <h3 className="text-white text-xl font-bold">Risk Assessment Manager</h3>
          <p className="text-[#9db9b0] text-sm">Identifying climate-related vulnerabilities and transition exposures.</p>
        </div>
        
        <div className="flex bg-[#111816] p-1 rounded-xl border border-[#283933]">
          <button 
            onClick={() => { setActiveTab('Physical'); setSelectedGroupId(null); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'Physical' ? 'bg-primary text-background-dark shadow-lg' : 'text-[#9db9b0] hover:text-white'}`}
          >
            Physical Risks
          </button>
          <button 
            onClick={() => { setActiveTab('Transition'); setSelectedGroupId(null); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'Transition' ? 'bg-primary text-background-dark shadow-lg' : 'text-[#9db9b0] hover:text-white'}`}
          >
            Transition Risks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Categories Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-3">
          {filteredGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                selectedGroupId === group.id 
                  ? 'bg-primary/5 border-primary text-white' 
                  : 'bg-[#1d2a25] border-[#283933] text-[#9db9b0] hover:border-primary/30 hover:text-white'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-70">{activeTab} Group</span>
                <span className="font-bold text-sm">{group.group}</span>
              </div>
              <span className={`material-symbols-outlined transition-transform duration-300 ${selectedGroupId === group.id ? 'translate-x-1 text-primary' : 'text-[#5c736a] group-hover:translate-x-1'}`}>
                chevron_right
              </span>
            </button>
          ))}

          <div className="mt-4 p-5 rounded-xl bg-surface-dark border border-dashed border-[#283933] flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-primary/40 text-3xl mb-2">auto_awesome</span>
            <p className="text-[#9db9b0] text-[11px] font-medium leading-relaxed italic">
              "AI identifies <span className="text-white font-bold">Transition Risk</span> as the primary driver for {activeTab === 'Physical' ? 'Physical' : 'Market'} disruption in 2026."
            </p>
          </div>
        </div>

        {/* Detailed Assessment Matrix */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          {activeGroup?.subCategories.map((sub) => (
            <div key={sub.id} className="bg-[#1d2a25] border border-[#283933] rounded-xl overflow-hidden hover:border-primary/30 transition-all group">
              <div className="p-5 border-b border-[#283933] flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1 min-w-[300px]">
                  <h4 className="text-white text-lg font-bold mb-1 group-hover:text-primary transition-colors">{sub.name}</h4>
                  <p className="text-[#9db9b0] text-xs leading-relaxed">{sub.description}</p>
                </div>
                <div className="flex gap-2">
                  <div className={`flex flex-col items-center px-3 py-1.5 rounded border ${getStatusColor(sub.severity)}`}>
                    <span className="text-[9px] uppercase font-black">Severity</span>
                    <span className="text-xs font-bold">{sub.severity}</span>
                  </div>
                  <div className={`flex flex-col items-center px-3 py-1.5 rounded border ${getStatusColor(sub.probability)}`}>
                    <span className="text-[9px] uppercase font-black">Probability</span>
                    <span className="text-xs font-bold">{sub.probability}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#283933] bg-[#111816]/30">
                <div className="p-4 flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-[#5c736a] tracking-widest">Financial Exposure</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-xl">{sub.financialImpact}</span>
                    <span className="material-symbols-outlined text-sm text-[#ef4444]">trending_up</span>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col gap-2 lg:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-[#5c736a] tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                    Strategic Mitigation Path
                  </span>
                  <p className="text-white text-xs leading-relaxed font-medium">
                    {sub.mitigationStrategy}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {(!activeGroup || activeGroup.subCategories.length === 0) && (
            <div className="p-20 bg-[#1d2a25] border border-[#283933] rounded-xl flex flex-col items-center text-center opacity-50">
              <span className="material-symbols-outlined text-4xl mb-3">cloud_off</span>
              <p className="text-[#9db9b0] font-bold">No risk sub-categories defined for this group.</p>
            </div>
          )}
        </div>

      </div>

      {/* Summary Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl flex items-center gap-5">
          <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <div>
            <p className="text-[#9db9b0] text-[10px] font-black uppercase tracking-widest">Aggregate Exposure</p>
            <p className="text-white text-2xl font-black">$48.2M<span className="text-primary text-xs ml-1 font-bold">High Sensitivity</span></p>
          </div>
        </div>
        <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/20 p-5 rounded-xl flex items-center gap-5">
          <div className="size-12 rounded-full bg-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6]">
            <span className="material-symbols-outlined">timer</span>
          </div>
          <div>
            <p className="text-[#9db9b0] text-[10px] font-black uppercase tracking-widest">Primary Horizon</p>
            <p className="text-white text-2xl font-black">2030 - 2045<span className="text-[#3b82f6] text-xs ml-1 font-bold">Mid-to-Long</span></p>
          </div>
        </div>
        <div className="bg-[#f97316]/5 border border-[#f97316]/20 p-5 rounded-xl flex items-center gap-5">
          <div className="size-12 rounded-full bg-[#f97316]/20 flex items-center justify-center text-[#f97316]">
            <span className="material-symbols-outlined">history</span>
          </div>
          <div>
            <p className="text-[#9db9b0] text-[10px] font-black uppercase tracking-widest">Assessment Confidence</p>
            <p className="text-white text-2xl font-black">88%<span className="text-[#f97316] text-xs ml-1 font-bold">Verified</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentManager;
