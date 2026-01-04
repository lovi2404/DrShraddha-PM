
import React, { useState, useMemo } from 'react';
import Tooltip from './Tooltip';

interface ReportsManagerProps {
  activeStandard: string;
  activeYear: string;
}

interface GapItem {
  pillar: string;
  requirement: string;
  status: 'Full' | 'Partial' | 'Missing';
  recommendation: string;
}

const ReportsManager: React.FC<ReportsManagerProps> = ({ activeStandard, activeYear }) => {
  const [isScanning, setIsScanning] = useState(false);

  // Metadata for standards to drive the dynamic assessment
  const standardMetadata: Record<string, { description: string, focus: string, templates: string[] }> = {
    'IFRS S1/S2': {
      description: 'Global baseline for sustainability-related financial disclosures.',
      focus: 'Financial Materiality & Climate Risk',
      templates: ['Climate Disclosure Report (Excel)', 'Risk & Opportunity Registry (Word)', 'Scenario Analysis Workbook']
    },
    'EU CSRD': {
      description: 'Mandatory sustainability reporting for large EU-based companies.',
      focus: 'Double Materiality & ESRS Alignment',
      templates: ['ESRS Cross-Cutting Template', 'Impact Materiality Map', 'Value Chain Data Collection Kit']
    },
    'EU VSME': {
      description: 'Simplified reporting standard for non-listed small and medium enterprises.',
      focus: 'Proportionate Disclosure & ESG Fundamentals',
      templates: ['SME Disclosure Checklist', 'Basic Carbon Footprint Calculator']
    },
    'GRI': {
      description: 'The most widely used standard for impact-based sustainability reporting.',
      focus: 'Multi-stakeholder Impact & Global Standards',
      templates: ['GRI Content Index Generator', 'Stakeholder Engagement Log', 'Universal Standards Module']
    },
    'BRSR': {
      description: 'Business Responsibility and Sustainability Report for Indian listed companies.',
      focus: 'Regulatory Compliance & Core ESG KPIs',
      templates: ['BRSR Core Essential Indicators', 'Social & Governance Annexure', 'Leadership Indicators Template']
    },
    'TCFD': {
      description: 'Recommendations for climate-related financial disclosures.',
      focus: 'Governance, Strategy, Risk, & Metrics',
      templates: ['TCFD Alignment Checklist', 'Physical Risk Exposure Ledger']
    }
  };

  const meta = standardMetadata[activeStandard] || standardMetadata['IFRS S1/S2'];

  const gaps = useMemo<GapItem[]>(() => [
    { 
      pillar: 'Governance', 
      requirement: 'Board-level oversight description', 
      status: 'Full', 
      recommendation: 'Maintained in Governance Charter v2.4' 
    },
    { 
      pillar: 'Strategy', 
      requirement: 'Transition plan financial quantification', 
      status: 'Partial', 
      recommendation: 'Update Capex projections for 2026 climate resilience projects.' 
    },
    { 
      pillar: 'Risk Mgmt', 
      requirement: 'Climate-related physical risk mapping', 
      status: 'Missing', 
      recommendation: 'Requires detailed flood analysis for Southeast Asia assets.' 
    },
    { 
      pillar: 'Metrics', 
      requirement: 'Scope 3 Category 11: Use of Sold Products', 
      status: 'Partial', 
      recommendation: 'Average data used. Suggest moving to product-specific primary data.' 
    }
  ], [activeStandard]);

  const handleRunAssessment = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Dynamic Summary Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1d2a25] border border-[#283933] p-6 rounded-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 size-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-white text-xl font-bold">{activeStandard} Gap Assessment</h3>
            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-black uppercase">Active Framework</span>
          </div>
          <p className="text-[#9db9b0] text-sm max-w-2xl">{meta.description}</p>
        </div>
        <div className="relative z-10">
          <button 
            onClick={handleRunAssessment}
            disabled={isScanning}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background-dark font-black text-sm transition-all shadow-lg shadow-primary/10 ${isScanning ? 'animate-pulse opacity-70' : 'hover:bg-[#10d692]'}`}
          >
            <span className="material-symbols-outlined">{isScanning ? 'sync' : 'analytics'}</span>
            {isScanning ? 'Scanning Data Architecture...' : 'Run Full Assessment'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Gap Analysis Dashboard */}
        <div className="xl:col-span-2 rounded-xl bg-[#1d2a25] border border-[#283933] flex flex-col overflow-hidden h-full">
          <div className="p-5 border-b border-[#283933] flex justify-between items-center">
            <div>
              <h4 className="text-white font-bold">Standard Alignment Progress</h4>
              <p className="text-[#9db9b0] text-xs">Analysis based on {activeYear} reported metrics</p>
            </div>
            <Tooltip content="Percentage of requirements successfully met according to automated validation rules.">
              <div className="flex items-center gap-2">
                <span className="text-primary text-2xl font-black">74%</span>
                <span className="text-[#5c736a] text-[10px] font-bold uppercase">Ready</span>
              </div>
            </Tooltip>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#111816]/30 text-[10px] font-bold text-[#5c736a] uppercase tracking-widest border-b border-[#283933]">
                  <th className="px-6 py-4">Reporting Pillar</th>
                  <th className="px-6 py-4">Specific Requirement</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Action/Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#283933]">
                {gaps.map((gap, i) => (
                  <tr key={i} className="hover:bg-[#283933]/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-white text-xs font-bold">{gap.pillar}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#9db9b0] text-xs leading-relaxed">{gap.requirement}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                        gap.status === 'Full' ? 'bg-primary/10 text-primary' : 
                        gap.status === 'Partial' ? 'bg-[#eab308]/10 text-[#eab308]' : 'bg-[#ef4444]/10 text-[#ef4444]'
                      }`}>
                        {gap.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <span className="text-[#7da294] text-[11px] italic">{gap.recommendation}</span>
                        {gap.status !== 'Full' && (
                          <Tooltip content="Auto-generate disclosure based on available portfolio data.">
                            <button className="text-primary hover:text-white"><span className="material-symbols-outlined text-sm">auto_awesome</span></button>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Template Library */}
        <div className="rounded-xl bg-[#1d2a25] border border-[#283933] flex flex-col h-full">
          <div className="p-5 border-b border-[#283933]">
            <h4 className="text-white font-bold">Reporting Artifacts</h4>
            <p className="text-[#9db9b0] text-xs">Official {activeStandard} templates</p>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {meta.templates.map((template, idx) => (
              <div key={idx} className="group p-4 bg-[#111816]/50 border border-[#283933] rounded-xl hover:border-primary/50 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="size-8 rounded-lg bg-[#283933] flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-sm">description</span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-[#9db9b0] hover:text-white" aria-label="Preview Template"><span className="material-symbols-outlined text-sm">visibility</span></button>
                    <button className="text-primary hover:text-white" aria-label="Download Template"><span className="material-symbols-outlined text-sm">download</span></button>
                  </div>
                </div>
                <h5 className="text-white text-sm font-bold mb-1">{template}</h5>
                <p className="text-[#5c736a] text-[10px]">V4.2 • Updated 3 days ago</p>
              </div>
            ))}
            
            <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <h5 className="text-primary text-xs font-black uppercase mb-2">Expert Tip</h5>
              <p className="text-[#9db9b0] text-[11px] leading-relaxed">
                Using the <span className="text-white font-bold">Value Chain Ingestion</span> tool in the Portfolio tab will automatically populate up to 60% of these templates.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsManager;
