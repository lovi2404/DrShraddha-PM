
import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { MATERIALITY_TOPICS, STAKEHOLDERS, IRO_ASSESSMENTS } from '../constants';
import Tooltip from './Tooltip';

interface MaterialityManagerProps {
  globalStandard: string;
}

const MaterialityManager: React.FC<MaterialityManagerProps> = ({ globalStandard }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(MATERIALITY_TOPICS[0].id);

  const isDoubleMateriality = useMemo(() => {
    return ['EU CSRD', 'GRI', 'EU VSME'].includes(globalStandard);
  }, [globalStandard]);

  const activeTopic = useMemo(() => 
    MATERIALITY_TOPICS.find(t => t.id === selectedTopicId), 
  [selectedTopicId]);

  const activeIRO = useMemo(() => 
    IRO_ASSESSMENTS.find(iro => iro.topicId === selectedTopicId),
  [selectedTopicId]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Header View */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1d2a25] border border-[#283933] p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-white text-xl font-bold">Materiality Assessment</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${isDoubleMateriality ? 'bg-primary/10 text-primary' : 'bg-[#3b82f6]/10 text-[#3b82f6]'}`}>
              {isDoubleMateriality ? 'Double Materiality (CSRD)' : 'Financial Materiality (TCFD/IFRS)'}
            </span>
          </div>
          <p className="text-[#9db9b0] text-sm">
            {isDoubleMateriality 
              ? 'Analyzing impact on society/environment alongside enterprise value risks.' 
              : 'Focusing on ESG factors that primarily impact financial performance and value.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#283933] text-white text-sm font-bold border border-[#344a42] hover:bg-[#344a42] transition-colors">
            <span className="material-symbols-outlined text-[18px]">share</span>
            Stakeholder Survey
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-background-dark text-sm font-bold hover:bg-[#10d692] transition-colors shadow-lg shadow-primary/10">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Topic
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Double Materiality Matrix */}
        <div className="xl:col-span-2 rounded-xl bg-[#1d2a25] border border-[#283933] p-6 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-white font-bold">Significance Matrix</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_#13eca4]"></div>
                <span className="text-[10px] text-[#9db9b0] uppercase font-bold">Environment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]"></div>
                <span className="text-[10px] text-[#9db9b0] uppercase font-bold">Social</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316]"></div>
                <span className="text-[10px] text-[#9db9b0] uppercase font-bold">Governance</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            {/* Axis Labels */}
            <div className="absolute left-0 top-1/2 -rotate-90 -translate-x-full -translate-y-1/2 text-[10px] font-black text-[#5c736a] uppercase tracking-widest whitespace-nowrap ml-4">
              Impact Materiality (Society/Environment)
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-black text-[#5c736a] uppercase tracking-widest whitespace-nowrap mb-2">
              Financial Materiality (Enterprise Value)
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#283933" />
                <XAxis 
                  type="number" 
                  dataKey="financialMateriality" 
                  name="Financial" 
                  domain={[0, 100]} 
                  hide 
                />
                <YAxis 
                  type="number" 
                  dataKey="impactMateriality" 
                  name="Impact" 
                  domain={[0, 100]} 
                  hide 
                />
                <ZAxis type="number" range={[400, 1000]} />
                <RechartsTooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#111816] border border-[#283933] p-3 rounded shadow-2xl">
                          <p className="text-white font-bold text-xs">{data.name}</p>
                          <p className="text-[#9db9b0] text-[10px]">Financial: {data.financialMateriality}</p>
                          <p className="text-[#9db9b0] text-[10px]">Impact: {data.impactMateriality}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter 
                  name="Topics" 
                  data={MATERIALITY_TOPICS} 
                  onClick={(data) => setSelectedTopicId(data.id)}
                  className="cursor-pointer"
                >
                  {MATERIALITY_TOPICS.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.category === 'Environmental' ? '#13eca4' : 
                        entry.category === 'Social' ? '#3b82f6' : '#f97316'
                      }
                      stroke={selectedTopicId === entry.id ? 'white' : 'transparent'}
                      strokeWidth={2}
                    />
                  ))}
                  <LabelList 
                    dataKey="name" 
                    position="top" 
                    fill="#9db9b0" 
                    fontSize={10} 
                    fontWeight="bold" 
                    offset={10} 
                  />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stakeholder Salience List */}
        <div className="rounded-xl bg-[#1d2a25] border border-[#283933] flex flex-col h-[500px]">
          <div className="p-5 border-b border-[#283933]">
            <h4 className="text-white font-bold">Stakeholder Engagement</h4>
            <p className="text-[#9db9b0] text-xs">Priority mapping based on interest & power</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {STAKEHOLDERS.map((s) => (
              <div key={s.id} className="p-3 bg-[#111816]/30 border border-[#283933] rounded-lg hover:border-primary/50 transition-all cursor-help">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">{s.icon}</span>
                    <span className="text-white text-xs font-bold">{s.name}</span>
                  </div>
                  <span className="text-primary text-[10px] font-black">{s.salience}%</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.concerns.map((c, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 bg-[#283933] text-[#9db9b0] rounded uppercase font-bold tracking-tight">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-[#111816]/50 border-t border-[#283933]">
            <button className="w-full py-2 bg-[#283933] hover:bg-[#344a42] text-white text-[10px] font-black uppercase rounded-lg transition-colors">
              View Stakeholder Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Detailed IRO Assessment Ledger */}
      <div className="rounded-xl bg-[#1d2a25] border border-[#283933] overflow-hidden">
        <div className="p-5 border-b border-[#283933] flex justify-between items-center bg-[#111816]/30">
          <div>
            <h4 className="text-white font-bold">IRO Assessment Ledger</h4>
            <p className="text-[#9db9b0] text-xs">Deep dive into Impact, Risk & Opportunities for <span className="text-primary font-bold">{activeTopic?.name}</span></p>
          </div>
          <Tooltip content="Formal ledger entry for ESRS S1-S4 compliance.">
            <span className="material-symbols-outlined text-[#5c736a] cursor-help">verified</span>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#283933]">
          {/* Outward Impact Column */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">dynamic_feed</span>
              <h5 className="text-white text-sm font-bold uppercase tracking-wider">Inward/Outward Impact</h5>
            </div>
            {activeIRO ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${activeIRO.impactType === 'Positive' ? 'bg-primary/10 text-primary' : 'bg-[#ef4444]/10 text-[#ef4444]'}`}>
                    {activeIRO.impactType} Impact
                  </span>
                  <span className="text-white font-mono text-sm">{activeIRO.impactScale}/100</span>
                </div>
                <p className="text-[#9db9b0] text-xs leading-relaxed italic">
                  "Current operational activities result in a {activeIRO.impactType.toLowerCase()} contribution to {activeTopic?.name} ecosystems..."
                </p>
              </>
            ) : (
              <div className="text-[#5c736a] text-xs italic">Detailed impact assessment pending verification.</div>
            )}
          </div>

          {/* Financial Risk Column */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#f97316]">report_problem</span>
              <h5 className="text-white text-sm font-bold uppercase tracking-wider">Financial Risk Exposure</h5>
            </div>
            {activeIRO ? (
              <>
                <p className="text-white text-xs font-bold mb-2">{activeIRO.riskDescription}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#5c736a] mb-1">Horizon</p>
                    <p className="text-white text-xs font-bold">{activeIRO.horizon} Term</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#5c736a] mb-1">Magnitude</p>
                    <p className={`text-xs font-bold ${activeIRO.financialMagnitude === 'High' ? 'text-[#ef4444]' : 'text-primary'}`}>
                      {activeIRO.financialMagnitude}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-[#5c736a] text-xs italic">Risk modeling in progress.</div>
            )}
          </div>

          {/* Strategic Opportunity Column */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#eab308]">rocket_launch</span>
              <h5 className="text-white text-sm font-bold uppercase tracking-wider">Strategic Opportunity</h5>
            </div>
            {activeIRO ? (
              <>
                <p className="text-white text-xs font-bold mb-2">{activeIRO.opportunityDescription}</p>
                <button className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase border border-primary/20 hover:bg-primary/20 transition-all">
                  Incorporate into 2026 Strategy
                </button>
              </>
            ) : (
              <div className="text-[#5c736a] text-xs italic">Opportunity surfacing logic disabled for this topic.</div>
            )}
          </div>
        </div>

        <div className="p-4 bg-[#111816]/50 border-t border-[#283933] flex flex-wrap gap-4 items-center">
          <span className="text-[10px] text-[#5c736a] font-bold uppercase">Topic Associations:</span>
          {activeTopic?.stakeholders.map((s, i) => (
            <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-[#283933] text-white border border-[#344a42]">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialityManager;
