
import React, { useState, useEffect } from 'react';
import Tooltip from './Tooltip';

interface DataManagerProps {
  onGlobalSync: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ onGlobalSync }) => {
  const [activeMode, setActiveMode] = useState<'manual' | 'connectors'>('connectors');
  const [syncingSource, setSyncingSource] = useState<string | null>(null);
  
  const connectors = [
    { id: 'sap', name: 'SAP S/4HANA', icon: 'hub', color: '#008fd3', status: 'Connected', lastSync: '2h ago' },
    { id: 'aws', name: 'AWS S3 Buckets', icon: 'cloud', color: '#ff9900', status: 'Idle', lastSync: '1d ago' },
    { id: 'sf', name: 'Salesforce Net Zero', icon: 'cloud_done', color: '#00a1e0', status: 'Syncing', lastSync: 'Live' },
    { id: 'api', name: 'Custom REST API', icon: 'api', color: '#13eca4', status: 'Connected', lastSync: '5m ago' }
  ];

  const handleSync = (name: string) => {
    setSyncingSource(name);
    setTimeout(() => {
      setSyncingSource(null);
      onGlobalSync();
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header & Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1d2a25] border border-[#283933] p-6 rounded-xl">
        <div>
          <h3 className="text-white text-xl font-bold">Data Management Hub</h3>
          <p className="text-[#9db9b0] text-sm italic">Aggregate, validate, and broadcast ESG metrics across Nexus tabs.</p>
        </div>
        <div className="flex bg-[#111816] p-1 rounded-xl border border-[#283933]">
          <button 
            onClick={() => setActiveMode('connectors')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeMode === 'connectors' ? 'bg-primary text-background-dark' : 'text-[#9db9b0] hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[18px]">power</span>
            Plug & Play
          </button>
          <button 
            onClick={() => setActiveMode('manual')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeMode === 'manual' ? 'bg-primary text-background-dark' : 'text-[#9db9b0] hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            Manual Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Workspace */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {activeMode === 'connectors' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectors.map((source) => (
                <div key={source.id} className="bg-[#1d2a25] border border-[#283933] p-5 rounded-xl hover:border-primary/40 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="size-12 rounded-xl bg-[#111816] flex items-center justify-center text-primary border border-[#283933]">
                      <span className="material-symbols-outlined text-3xl" style={{ color: source.color }}>{source.icon}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${
                      source.status === 'Syncing' || syncingSource === source.name ? 'text-primary bg-primary/10 border-primary/20 animate-pulse' : 'text-[#9db9b0] bg-[#283933] border-[#344a42]'
                    }`}>
                      {syncingSource === source.name ? 'In Progress' : source.status}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-lg">{source.name}</h4>
                  <p className="text-[#9db9b0] text-xs mb-6">Enterprise resource planning & metadata ingestion.</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#283933]">
                    <span className="text-[10px] text-[#5c736a] font-bold uppercase">Last Sync: {source.lastSync}</span>
                    <button 
                      onClick={() => handleSync(source.name)}
                      disabled={syncingSource !== null}
                      className="text-primary text-xs font-bold hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">sync</span>
                      Sync Now
                    </button>
                  </div>
                </div>
              ))}
              <button className="border-2 border-dashed border-[#283933] rounded-xl flex flex-col items-center justify-center p-8 text-[#5c736a] hover:border-primary/50 hover:text-primary transition-all group bg-[#111816]/20">
                <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-125 transition-transform">add_link</span>
                <p className="font-bold text-sm">New Connector</p>
                <p className="text-[10px] mt-1">SAP, Oracle, Workday...</p>
              </button>
            </div>
          ) : (
            <div className="bg-[#1d2a25] border border-[#283933] rounded-xl overflow-hidden">
              <div className="p-5 border-b border-[#283933] flex justify-between items-center">
                <h4 className="text-white font-bold">Manual Metric Ingestion</h4>
                <span className="text-[10px] text-[#9db9b0] uppercase font-black">Draft Session #482</span>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-[#9db9b0] tracking-widest">Metric Category</label>
                    <select className="bg-[#111816] border border-[#283933] rounded-lg text-white text-sm p-2.5 focus:ring-primary focus:border-primary">
                      <option>Environmental - Scope 1 Emissions</option>
                      <option>Environmental - Water Withdrawal</option>
                      <option>Social - Employee Turnover</option>
                      <option>Governance - Anti-Corruption Training</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-[#9db9b0] tracking-widest">Reporting Entity</label>
                    <select className="bg-[#111816] border border-[#283933] rounded-lg text-white text-sm p-2.5 focus:ring-primary focus:border-primary">
                      <option>Global HQ</option>
                      <option>EMEA Logistics Hub</option>
                      <option>APAC Data Center</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-[#9db9b0] tracking-widest">Value</label>
                    <input type="number" placeholder="0.00" className="bg-[#111816] border border-[#283933] rounded-lg text-white text-sm p-2.5 focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-[#9db9b0] tracking-widest">Unit</label>
                    <input type="text" placeholder="e.g. tCO2e" className="bg-[#111816] border border-[#283933] rounded-lg text-white text-sm p-2.5 focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-[#9db9b0] tracking-widest">Assurance Proof</label>
                    <button className="flex items-center justify-center gap-2 bg-[#283933] border border-[#344a42] rounded-lg text-[#9db9b0] text-sm p-2.5 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-sm">attach_file</span>
                      Upload PDF
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#283933] flex justify-end gap-3">
                  <button className="px-6 py-2 rounded-lg text-[#9db9b0] font-bold text-sm hover:bg-[#283933]">Save Draft</button>
                  <button onClick={() => onGlobalSync()} className="px-8 py-2 rounded-lg bg-primary text-background-dark font-black text-sm shadow-lg shadow-primary/20">Broadcast to Platform</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ingestion Stream & Stats */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#1d2a25] border border-[#283933] rounded-xl p-5">
            <h4 className="text-white font-bold mb-4">Pipeline Status</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#9db9b0]">Data Quality Score</span>
                <span className="text-primary font-black text-sm">94.2%</span>
              </div>
              <div className="h-2 w-full bg-[#111816] rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '94.2%' }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-[#111816]/50 rounded-lg border border-[#283933]">
                  <p className="text-[9px] uppercase font-black text-[#5c736a] mb-1">Total Points</p>
                  <p className="text-white font-bold text-sm">12.4k</p>
                </div>
                <div className="p-3 bg-[#111816]/50 rounded-lg border border-[#283933]">
                  <p className="text-[9px] uppercase font-black text-[#5c736a] mb-1">Active Links</p>
                  <p className="text-white font-bold text-sm">18</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1d2a25] border border-[#283933] rounded-xl flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#283933] bg-[#111816]/30">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest">Ingestion Stream</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {[
                { source: 'SAP', action: 'Metric Imported', desc: 'Scope 2 Energy (EMEA)', time: '2m ago' },
                { source: 'Salesforce', action: 'Sync Complete', desc: 'Social - Diversity Index', time: '14m ago' },
                { source: 'Alex M.', action: 'Manual Entry', desc: 'Governance Audit Proof', time: '1h ago' },
                { source: 'API', action: 'Batch Process', desc: 'Value Chain Emissions', time: '3h ago' }
              ].map((log, i) => (
                <div key={i} className="flex gap-3 items-start relative group">
                  <div className="size-2 rounded-full bg-primary mt-1.5 shadow-[0_0_8px_#13eca4]"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white text-[11px] font-black">{log.source}</span>
                      <span className="text-[10px] text-primary font-bold">{log.action}</span>
                    </div>
                    <p className="text-[#9db9b0] text-[10px] mb-1">{log.desc}</p>
                    <span className="text-[#5c736a] text-[9px]">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DataManager;
