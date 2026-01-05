
import React, { useState, useMemo } from 'react';
import Dashboard from './components/Dashboard';
import MetricsView from './components/MetricsView';
import PlanningView from './components/PlanningView';
import RiskRegistry from './components/RiskRegistry';
import ComplianceView from './components/ComplianceView';
import { COMPANY_REGISTRY } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isExporting, setIsExporting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Global Filter State
  const [filters, setFilters] = useState({
    company: 'Nexus Data Systems',
    country: 'European Union',
    year: '2024'
  });

  const selectedData = useMemo(() => {
    const match = COMPANY_REGISTRY.find(c => 
      c.name === filters.company && 
      (filters.country === 'All Regions' || c.region === filters.country) &&
      c.year === filters.year
    );
    return match || COMPANY_REGISTRY[0];
  }, [filters]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Strategic report generated. PDF and CSV ready for download.');
    }, 1500);
  };

  const handleGitHubSync = () => {
    setIsPublishing(true);
    setPublishSuccess(false);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
    }, 2000);
  };

  const navItems = ['Dashboard', 'Metrics', 'Strategic Planning', 'Risk Registry', 'Compliance'];

  const renderContent = () => {
    switch(activeTab) {
      case 'Dashboard': return <Dashboard filters={filters} setFilters={setFilters} selectedData={selectedData} />;
      case 'Metrics': return <MetricsView />;
      case 'Strategic Planning': return <PlanningView selectedData={selectedData} />;
      case 'Risk Registry': return <RiskRegistry />;
      case 'Compliance': return <ComplianceView />;
      default: return <Dashboard filters={filters} setFilters={setFilters} selectedData={selectedData} />;
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden selection:bg-primary/30">
      <header className="sticky top-0 z-[100] border-b border-solid border-white/5 bg-background-dark/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 text-white cursor-pointer group" onClick={() => setActiveTab('Dashboard')}>
              <div className="flex flex-col">
                <h2 className="text-lg font-black leading-none tracking-tight uppercase">CARBON CORE</h2>
                <span className="text-[9px] font-black text-primary tracking-[0.3em] mt-1 italic">COMMANDER v2.4</span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/40 p-1 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`relative px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 whitespace-nowrap ${
                  activeTab === item 
                  ? 'text-white bg-slate-800 shadow-lg border border-white/5' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {item}
                {activeTab === item && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full shadow-glow-primary"></span>
                )}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center h-10 w-48 xl:w-64">
              <div className="flex w-full items-stretch rounded-2xl h-full border border-white/5 overflow-hidden group focus-within:border-primary/40 transition-all bg-slate-900/40 hover:bg-slate-900/60 shadow-inner">
                <div className="text-slate-500 flex items-center justify-center pl-4">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input w-full border-none bg-transparent h-full placeholder:text-slate-600 px-3 text-[11px] font-black uppercase tracking-widest focus:ring-0 text-white" 
                  placeholder="Query Registry..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {publishSuccess && (
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
                    Strategy Pushed
                  </span>
                )}
                <button 
                  onClick={handleGitHubSync}
                  disabled={isPublishing}
                  className={`flex items-center justify-center size-10 rounded-2xl border-2 transition-all active:scale-95 ${
                    isPublishing 
                      ? 'bg-slate-800 border-emerald-500/50 shadow-glow-emerald animate-pulse' 
                      : 'bg-slate-900 border-white/5 hover:border-white/20 text-white shadow-xl'
                  }`}
                  title="Push to ESG Ledger"
                >
                  {isPublishing ? (
                    <span className="animate-spin material-symbols-outlined text-[18px] text-emerald-500">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">share</span>
                  )}
                </button>
              </div>

              <button 
                disabled={isExporting}
                onClick={handleExport}
                className={`flex items-center justify-center rounded-2xl h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                  isExporting 
                    ? 'bg-slate-800 cursor-not-allowed opacity-70 text-slate-500 border border-white/5' 
                    : 'bg-primary hover:bg-blue-600 text-white shadow-glow-primary'
                }`}
              >
                {isExporting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin material-symbols-outlined text-[16px]">progress_activity</span>
                    Processing
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">download_done</span>
                    Generate Report
                  </span>
                )}
              </button>
              
              <div className="size-10 rounded-2xl border-2 border-white/10 hover:border-primary transition-all p-0.5 cursor-pointer relative group">
                <img 
                  src="https://picsum.photos/100/100?random=1" 
                  className="w-full h-full rounded-[0.65rem] object-cover"
                  alt="Commander"
                />
                <span className="absolute -top-1 -right-1 size-3 bg-emerald-500 rounded-full border-2 border-background-dark shadow-glow-emerald"></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1">
        {renderContent()}
      </div>
      
      <footer className="py-10 px-10 border-t border-white/5 bg-background-dark/40 relative z-10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">CARBON CORE COMMANDER</span>
            <span className="size-1 rounded-full bg-slate-700"></span>
            <span className="text-[10px] font-bold text-slate-400">VANGUARD-2.4-STABLE</span>
          </div>
          <div className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
            &copy; 2024 VANGUARD CARBON SYSTEMS <span className="mx-3 text-slate-800">|</span> ISO 14064:2018 PROTOCOL <span className="mx-3 text-slate-800">|</span> FEDERATED LEDGER SECURE
          </div>
          <div className="flex items-center gap-6">
             <a href="#" className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Ops Manual</a>
             <a href="#" className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Compliance API</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
