
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area
} from 'recharts';
import { 
  COMPANY_REGISTRY,
  LEVERS,
  CARBON_CREDITS 
} from '../constants';
import TemperatureGauge from './TemperatureGauge';
import { CompanyRegistryEntry, CarbonCredit } from '../types';

const COLORS = ['#135bec', '#60a5fa', '#4338ca', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#1e293b'];

const CustomChartTooltip = ({ active, payload, label, unit = 'tCO2e', methodology }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl z-[200] relative">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-6 mb-1 last:mb-0">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-[11px] font-bold text-slate-300 uppercase">{entry.name}:</span>
            </div>
            <span className="text-[11px] font-black text-white">{entry.value.toLocaleString()} {unit}</span>
          </div>
        ))}
        {methodology && (
          <div className="mt-3 pt-2 border-t border-white/5">
             <p className="text-[8px] font-black text-primary uppercase tracking-tighter">Methodology: {methodology}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

interface DashboardProps {
  filters: { company: string; country: string; year: string };
  setFilters: React.Dispatch<React.SetStateAction<{ company: string; country: string; year: string }>>;
  selectedData: CompanyRegistryEntry;
}

const Dashboard: React.FC<DashboardProps> = ({ filters, setFilters, selectedData }) => {
  const [isComparing, setIsComparing] = useState<boolean>(false);
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<'Current' | 'NetZero' | 'PolicyDriven'>('Current');
  const [simulatedLevers, setSimulatedLevers] = useState<Record<string, number>>(
    LEVERS.reduce((acc, lever) => ({ ...acc, [lever.id]: lever.currentReduction }), {} as Record<string, number>)
  );
  const [simulatedOffsetVol, setSimulatedOffsetVol] = useState<number>(
    CARBON_CREDITS.reduce((acc: number, curr) => acc + curr.volume, 0)
  );
  const [carbonPrice, setCarbonPrice] = useState<number>(65); // $ per tCO2e

  // Dynamic baseline based on selection
  const baselineEmissions: number = useMemo(() => {
    return selectedData.history.reduce((sum, m) => sum + m.scope1 + m.scope2 + m.scope3, 0) * 1000;
  }, [selectedData]);

  const currentTotalReduction: number = LEVERS.reduce((sum: number, l) => sum + l.currentReduction, 0);
  const currentTotalOffsets: number = CARBON_CREDITS.reduce((sum: number, c) => sum + c.volume, 0);
  
  // Calculation Functions
  const calculateMetrics = (levers: Record<string, number>, offsetVol: number, pricePerTon: number) => {
    const totalReduction = (Object.values(levers) as number[]).reduce((sum, val) => sum + val, 0);
    const gross = baselineEmissions - (totalReduction - currentTotalReduction);
    const net = gross - offsetVol;
    
    const baselineTemp = 1.8;
    const netBaseline = baselineEmissions - currentTotalOffsets;
    const reductionDiff = netBaseline - net;
    const tempImpact = (reductionDiff / 1000) * 0.003;
    const temp = Math.max(1.1, baselineTemp - tempImpact);
    
    const cost = (offsetVol * pricePerTon) / 1000000; 

    return { gross, net, temp, cost };
  };

  const baselineMetrics = useMemo(() => 
    calculateMetrics(
      LEVERS.reduce((acc, l) => ({ ...acc, [l.id]: l.currentReduction }), {}), 
      currentTotalOffsets,
      65
    ), 
    [baselineEmissions]
  );

  const simulatedMetrics = useMemo(() => 
    calculateMetrics(simulatedLevers, simulatedOffsetVol, carbonPrice), 
    [simulatedLevers, simulatedOffsetVol, carbonPrice, baselineEmissions]
  );

  const applyScenario = (type: 'Current' | 'NetZero' | 'PolicyDriven') => {
    setActiveScenario(type);
    if (type === 'Current') {
      setSimulatedLevers(LEVERS.reduce((acc, l) => ({ ...acc, [l.id]: l.currentReduction }), {}));
      setSimulatedOffsetVol(currentTotalOffsets);
      setCarbonPrice(65);
    } else if (type === 'NetZero') {
      setSimulatedLevers(LEVERS.reduce((acc, l) => ({ ...acc, [l.id]: l.maxReduction * 0.95 }), {}));
      setSimulatedOffsetVol(currentTotalOffsets * 2.5);
      setCarbonPrice(120);
    } else if (type === 'PolicyDriven') {
      setSimulatedLevers(LEVERS.reduce((acc, l) => ({ ...acc, [l.id]: l.maxReduction * 0.6 }), {}));
      setSimulatedOffsetVol(currentTotalOffsets * 1.5);
      setCarbonPrice(85);
    }
  };

  const handleSliderChange = (id: string, value: number) => {
    setSimulatedLevers(prev => ({ ...prev, [id]: value }));
  };

  const offsetCategories = [
    { name: 'Removal (Technical)', value: CARBON_CREDITS.filter(c => c.type === 'Removal' && c.methodology !== 'Afforestation').reduce((a, b) => a + b.volume, 0), color: '#6366f1' },
    { name: 'Removal (Nature)', value: CARBON_CREDITS.filter(c => c.methodology === 'Afforestation').reduce((a, b) => a + b.volume, 0), color: '#10b981' },
    { name: 'Avoidance', value: CARBON_CREDITS.filter(c => c.type === 'Avoidance').reduce((a, b) => a + b.volume, 0), color: '#3b82f6' },
  ];

  const uniqueCompanies = Array.from(new Set(COMPANY_REGISTRY.map(c => c.name))).sort();
  const uniqueRegions = Array.from(new Set(COMPANY_REGISTRY.map(c => c.region))).sort();
  const uniqueYears = Array.from(new Set(COMPANY_REGISTRY.map(c => c.year))).sort();

  return (
    <main className="flex-1 px-4 py-8 md:px-10 lg:px-20 max-w-[1600px] mx-auto w-full relative">
      <div className="absolute top-40 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-80 -right-20 w-80 h-80 bg-emerald-custom/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex flex-wrap gap-2 items-center">
          <a className="text-text-secondary hover:text-primary text-[10px] font-black leading-normal flex items-center gap-1.5 uppercase tracking-widest transition-colors" href="#">
            <span className="material-symbols-outlined text-[14px]">terminal</span> Command Interface
          </a>
          <span className="text-slate-800 dark:text-slate-700 text-xs font-bold">/</span>
          <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700">Carbon Core Strategy</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-dark/40 rounded-full border border-border-dark backdrop-blur-sm shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Link</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-dark/40 rounded-full border border-border-dark backdrop-blur-sm shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lat: 0.24ms</span>
          </div>
        </div>
      </div>

      <div className={`flex flex-wrap justify-between items-center gap-6 mb-8 p-8 rounded-3xl transition-all duration-700 relative z-10 ${
        isSimulating 
        ? 'bg-primary/[0.04] border-2 border-primary/20 shadow-[0_20px_60px_-15px_rgba(19,91,236,0.15)] ring-1 ring-primary/10' 
        : 'bg-surface-dark/20 border-2 border-border-dark'
      }`}>
        <div className="flex flex-col gap-3 max-w-2xl">
          <div className="flex items-center gap-4">
            <div className={`size-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-lg ${
              isSimulating ? 'bg-primary/20 border-primary/40 text-primary shadow-primary/10' : 'bg-slate-800/20 border-slate-700 text-slate-400'
            }`}>
               <span className="material-symbols-outlined text-[28px]">{isSimulating ? 'model_training' : 'dashboard'}</span>
            </div>
            <div>
              <h1 className="text-slate-900 dark:text-white text-3xl md:text-5xl font-black leading-none tracking-tight uppercase">
                {isSimulating ? 'Scenario Sandbox' : 'Operations Console'}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                 <span className={`h-1 w-8 rounded-full ${isSimulating ? 'bg-primary animate-pulse' : 'bg-slate-700'}`}></span>
                 <p className="text-text-secondary text-sm font-bold uppercase tracking-wider">
                   {isSimulating ? 'Running Predictive Strategy Simulations' : 'Real-time Emissions Integrity Monitoring'}
                 </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {isSimulating && (
            <button 
              onClick={() => setIsComparing(!isComparing)}
              className={`group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                isComparing 
                ? 'bg-emerald-custom text-white shadow-xl shadow-emerald-custom/30' 
                : 'bg-surface-dark border-2 border-border-dark text-white hover:border-emerald-custom hover:bg-emerald-custom/10'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-180 transition-transform duration-500">compare_arrows</span>
              {isComparing ? 'Close Overlay' : 'Compare Scenarios'}
            </button>
          )}
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 ${
              isSimulating 
              ? 'bg-primary text-white shadow-xl shadow-primary/30' 
              : 'bg-surface-dark border-2 border-border-dark text-white hover:border-primary hover:bg-primary/10'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${isSimulating ? 'animate-spin' : ''}`}>{isSimulating ? 'settings_suggest' : 'science'}</span>
            {isSimulating ? 'Exit Simulator' : 'Activate Impact Simulator'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 mb-8 p-4 bg-slate-900/40 rounded-3xl border border-white/5 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2.5 px-4 py-2 border-r border-white/10 pr-6">
           <span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Filters</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter ml-1">Company Entity</span>
            <select 
              value={filters.company}
              onChange={(e) => setFilters({...filters, company: e.target.value})}
              className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase focus:ring-primary focus:border-primary tracking-widest"
            >
              {uniqueCompanies.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter ml-1">Regional Scope</span>
            <select 
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
              className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase focus:ring-primary focus:border-primary tracking-widest"
            >
              <option>All Regions</option>
              {uniqueRegions.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter ml-1">Reporting Cycle</span>
            <select 
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase focus:ring-primary focus:border-primary tracking-widest"
            >
              {uniqueYears.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="ml-auto hidden sm:flex items-center gap-3 pr-4">
           <span className="text-[9px] font-black text-emerald-500 uppercase">Data Quality: High (88%)</span>
           <div className="size-2 rounded-full bg-emerald-500 shadow-glow-emerald"></div>
        </div>
      </div>

      {isSimulating && (
        <div className="mb-8 flex flex-wrap gap-4 items-center animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mr-2">Quick Scenarios:</p>
          <button 
            onClick={() => applyScenario('Current')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeScenario === 'Current' ? 'bg-slate-800 text-white border border-slate-600' : 'bg-slate-900/50 text-slate-600 border border-transparent hover:border-slate-800'}`}
          >
            Baseline Path
          </button>
          <button 
            onClick={() => applyScenario('PolicyDriven')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeScenario === 'PolicyDriven' ? 'bg-amber-custom text-white shadow-glow-amber' : 'bg-slate-900/50 text-slate-600 border border-transparent hover:border-amber-custom/30'}`}
          >
            Aggressive Policy
          </button>
          <button 
            onClick={() => applyScenario('NetZero')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeScenario === 'NetZero' ? 'bg-primary text-white shadow-glow-primary' : 'bg-slate-900/50 text-slate-600 border border-transparent hover:border-primary/30'}`}
          >
            Net Zero Mastery
          </button>
        </div>
      )}

      {isComparing && isSimulating && (
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-6 duration-700 relative z-10">
          <ComparisonPanel 
            title="Operational Baseline"
            subtitle="Verified Historical Position"
            metrics={baselineMetrics}
            type="baseline"
          />
          <ComparisonPanel 
            title="Strategic Projection"
            subtitle={`${activeScenario} Optimized Path`}
            metrics={simulatedMetrics}
            baseline={baselineMetrics}
            type="simulated"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 relative z-10">
        <KPICard 
          title="Gross Intensity" 
          value={isSimulating ? `${(simulatedMetrics.gross/1000).toFixed(1)}k` : selectedData.kpi.totalEmissions.value} 
          unit="tCO2e" 
          description="Total greenhouse gas emissions from all scopes before any offsets."
          methodology="GHG Protocol Corporate Standard"
          change={selectedData.kpi.totalEmissions.change} 
          icon="monitoring" 
          simulated={isSimulating}
          type="primary"
        />
        <KPICard 
          title="Carbon Bridging" 
          value={isSimulating ? `${(simulatedOffsetVol/1000).toFixed(1)}k` : `${(currentTotalOffsets/1000).toFixed(1)}k`} 
          unit="tCO2e" 
          description="Total volume of carbon credits retired or contracted to offset unavoidable emissions."
          methodology="Verified Carbon Standard / Gold Standard"
          change="+15.2% cap" 
          icon="token" 
          simulated={isSimulating}
          type="emerald"
        />
        <KPICard 
          title="Net Liability" 
          value={`${(simulatedMetrics.net/1000).toFixed(1)}k`} 
          unit="tCO2e" 
          description="Remaining emissions footprint after accounting for sequestration and offsets."
          methodology="Net Zero Tracker Alignment"
          status={simulatedMetrics.net < 350000 ? 'Secure' : 'Exposure'} 
          icon="account_balance_wallet" 
          simulated={isSimulating}
          type={simulatedMetrics.net < 350000 ? 'emerald' : 'amber'}
        />
        <div className="group flex flex-col gap-4 rounded-3xl p-6 bg-surface-dark/40 border-2 border-border-dark shadow-lg transition-all hover:border-primary/30 hover:shadow-primary/5 relative">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2.5 text-text-secondary">
              <span className="material-symbols-outlined text-[20px] text-primary">verified</span>
              <p className="text-[10px] font-black uppercase tracking-widest">Asset Permanence</p>
              <div className="relative group/tip">
                <span className="material-symbols-outlined text-[14px] cursor-help opacity-40 hover:opacity-100">info</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-950 border border-white/10 rounded-xl opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-[200] shadow-2xl">
                  <p className="text-[9px] font-bold text-white uppercase leading-tight">Average duration of carbon storage for removal assets in the portfolio.</p>
                  <p className="text-[8px] font-black text-primary uppercase mt-2">Source: Puro.earth</p>
                </div>
              </div>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">Assurance: AA</span>
          </div>
          <div>
            <p className="text-white text-4xl font-black leading-none tracking-tight group-hover:scale-105 transition-transform origin-left">82.4<span className="text-primary">%</span></p>
            <p className="text-text-secondary text-[11px] font-bold mt-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">history</span>
              Avg. Liability Term: 12.4y
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8 relative z-10">
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          <div className="rounded-3xl bg-surface-dark/40 border-2 border-border-dark p-8 shadow-lg overflow-hidden group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
               <div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    Inventory Performance Analysis
                  </h3>
                  <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-1">
                    Dataset: {filters.company} | {selectedData.region} | Cycle {filters.year}
                  </p>
               </div>
               <div className="flex items-center gap-4 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 px-3">
                    <div className="size-2.5 rounded-sm bg-[#135bec]"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Scope 1</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 border-x border-white/10">
                    <div className="size-2.5 rounded-sm bg-[#3b82f6]"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Scope 2</span>
                  </div>
                  <div className="flex items-center gap-2 px-3">
                    <div className="size-2.5 rounded-sm bg-[#6366f1]"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Scope 3</span>
                  </div>
               </div>
            </div>
            
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedData.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900 }} />
                    <Tooltip content={<CustomChartTooltip methodology="Activity-based data extraction" />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                    <Legend verticalAlign="top" height={36} align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', paddingBottom: '20px' }} />
                    <Bar dataKey="scope1" name="Scope 1" stackId="a" fill="#135bec" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="scope2" name="Scope 2" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="scope3" name="Scope 3" stackId="a" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl bg-surface-dark/40 border-2 border-border-dark p-8 shadow-lg overflow-hidden relative group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">Strategy Alignment</h3>
                <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-1">Projection Horizon: 2030-2050</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-white/5 rounded-xl">
                  <span className="size-2.5 rounded-sm bg-primary/40 shadow-glow-primary"></span>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Gross Projection</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-white/5 rounded-xl">
                  <span className="size-2.5 rounded-sm bg-emerald-custom shadow-glow-emerald"></span>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Target Alignment</span>
                </div>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={selectedData.history}>
                  <defs>
                    <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#135bec" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900 }} />
                  <YAxis hide domain={[0, 'auto']} />
                  <Tooltip content={<CustomChartTooltip methodology="Predictive ARIMA Forecasting Model" />} cursor={{ stroke: '#1e293b', strokeWidth: 2 }} />
                  <Bar dataKey="scope3" name="Gross" fill="#135bec" fillOpacity={0.15} barSize={40} radius={[8, 8, 0, 0]} />
                  <Area type="monotone" dataKey="scope2" name="Target" fill="url(#colorNet)" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0a0f18' }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`rounded-3xl bg-surface-dark/40 border-2 p-8 shadow-lg transition-all duration-700 ${isSimulating ? 'border-primary/40 ring-4 ring-primary/5 shadow-glow-primary' : 'border-border-dark'}`}>
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3 uppercase">
                 <span className={`material-symbols-outlined ${isSimulating ? 'text-primary' : 'text-slate-500'}`}>tune</span>
                 Strategy Levers
               </h3>
               {isSimulating && (
                 <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Simulated Carbon Price</span>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-black text-lg">${carbonPrice}</span>
                            <span className="text-[9px] font-black text-slate-600 uppercase">/ tCO2e</span>
                        </div>
                    </div>
                 </div>
               )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="flex flex-col gap-10">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] border-b border-border-dark pb-4 flex items-center gap-2">
                   <span className="material-symbols-outlined text-[16px]">bolt</span> Abatement Logic
                </p>
                {LEVERS.map((lever) => (
                  <div key={lever.id} className="flex flex-col gap-4 group">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-primary transition-colors">{lever.icon}</span>
                        </div>
                        <span className="text-slate-300 font-black uppercase text-[11px] group-hover:text-white transition-colors">{lever.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-primary font-black text-lg leading-none">{((isSimulating ? simulatedLevers[lever.id] : lever.currentReduction)/1000).toFixed(1)}k</span>
                        <span className="text-[10px] text-text-secondary font-black block">tCO2e</span>
                      </div>
                    </div>
                    {isSimulating ? (
                      <div className="relative pt-1">
                        <input 
                          type="range" min={0} max={lever.maxReduction} value={simulatedLevers[lever.id]} 
                          onChange={(e) => handleSliderChange(lever.id, parseInt(e.target.value))}
                          className="w-full h-2.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary hover:accent-blue-400 transition-all"
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-[9px] font-black text-slate-600">ZERO</span>
                          <span className="text-[9px] font-black text-slate-600 uppercase">MAX CAPACITY: {(lever.maxReduction/1000).toFixed(0)}K</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner p-px border border-white/5">
                        <div className="h-full bg-primary transition-all duration-1000 ease-out shadow-glow-primary rounded-full" style={{ width: `${lever.progress}%` }}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-10">
                <p className="text-[10px] font-black text-emerald-custom uppercase tracking-[0.2em] border-b border-emerald-900/30 pb-4 flex items-center gap-2">
                   <span className="material-symbols-outlined text-[16px]">inventory_2</span> Portfolio Rebalancing
                </p>
                <div className="flex flex-col gap-8">
                  <div className="p-8 bg-slate-900/40 rounded-3xl border border-white/5 shadow-2xl relative">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">Bridging Volume</span>
                        <span className="text-emerald-custom font-black text-3xl">{(simulatedOffsetVol/1000).toFixed(1)}k <span className="text-sm opacity-30">tCO2e</span></span>
                      </div>
                      <div className="size-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <span className="material-symbols-outlined text-emerald-500">token</span>
                      </div>
                    </div>
                    {isSimulating ? (
                      <div className="space-y-8">
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-3">Credit Acquisition Gap</p>
                            <input 
                                type="range" min={currentTotalOffsets} max={currentTotalOffsets + 250000} value={simulatedOffsetVol} 
                                onChange={(e) => setSimulatedOffsetVol(parseInt(e.target.value))}
                                className="w-full h-2.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500 transition-all"
                            />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-3">Market Carbon Price ($ / ton)</p>
                            <input 
                                type="range" min={30} max={250} value={carbonPrice} 
                                onChange={(e) => setCarbonPrice(parseInt(e.target.value))}
                                className="w-full h-2.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-custom transition-all"
                            />
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 px-6 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center gap-4">
                        <span className="material-symbols-outlined text-[20px] text-primary">lock_open</span>
                        <p className="text-[10px] text-text-secondary leading-relaxed font-black uppercase">Simulator Inactive. Portfolio controls restricted to view-only mode.</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-surface-dark/40 rounded-3xl border border-border-dark shadow-sm hover:border-primary/30 transition-all group">
                      <p className="text-[9px] text-text-secondary font-black uppercase mb-3 tracking-widest flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary"></span> Simulated Cost
                      </p>
                      <p className="text-2xl font-black text-white tracking-tighter group-hover:translate-x-1 transition-transform origin-left">
                        ${simulatedMetrics.cost.toFixed(1)}<span className="text-xs text-slate-500 font-black ml-1 uppercase">M</span>
                      </p>
                    </div>
                    <div className="p-6 bg-surface-dark/40 rounded-3xl border border-border-dark shadow-sm hover:border-emerald-custom/30 transition-all group">
                      <p className="text-[9px] text-text-secondary font-black uppercase mb-3 tracking-widest flex items-center gap-2">
                         <span className="size-1.5 rounded-full bg-emerald-custom"></span> Net Position
                      </p>
                      <p className="text-2xl font-black text-white tracking-tighter group-hover:translate-x-1 transition-transform origin-left">
                        {(simulatedMetrics.net/1000).toFixed(1)}<span className="text-xs text-slate-500 font-black ml-1 uppercase">k</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carbon Integrity Ledger Section */}
          <div className="rounded-3xl bg-surface-dark/40 border-2 border-border-dark p-8 shadow-lg overflow-hidden group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
               <div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-custom">fact_check</span>
                    Carbon Integrity Ledger
                  </h3>
                  <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-1">
                    Verified Credit Registry & Retirement Log
                  </p>
               </div>
               <div className="flex items-center gap-4 bg-slate-900/60 p-2 rounded-2xl border border-white/5">
                 <div className="text-[10px] font-black text-white uppercase px-3 py-1 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                   Total Retired: {(CARBON_CREDITS.filter(c => c.status === 'Retired').reduce((a, b) => a + b.volume, 0)/1000).toFixed(1)}k tCO2e
                 </div>
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase font-black text-slate-500 border-b border-white/5">
                    <th className="pb-4">Project Asset</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Standard</th>
                    <th className="pb-4">Volume (t)</th>
                    <th className="pb-4">Unit Cost</th>
                    <th className="pb-4 text-right">Ledger Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {CARBON_CREDITS.map(credit => (
                    <tr key={credit.id} className="group/row hover:bg-white/5 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white group-hover/row:text-primary transition-colors">{credit.projectName}</span>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Vintage {credit.vintage}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`size-1.5 rounded-full ${credit.type === 'Removal' ? 'bg-indigo-500' : 'bg-amber-500'}`}></span>
                          <span className="text-[10px] font-black text-slate-300 uppercase">{credit.type}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 block uppercase tracking-tighter ml-3.5">{credit.methodology}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{credit.standard}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-xs font-mono font-bold text-white">{credit.volume.toLocaleString()}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-xs font-mono font-bold text-slate-300">${credit.costPerTon}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border ${
                          credit.status === 'Retired' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 
                          credit.status === 'Active' ? 'text-primary border-primary/20 bg-primary/5' : 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                        }`}>
                          {credit.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">
                Data Integrity Level: <span className="text-emerald-500">Tier 1 (Transaction Verified)</span>
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-950/50 border border-white/10 rounded-xl text-[9px] font-black text-slate-500 uppercase hover:text-white hover:border-primary/40 transition-all">
                Audit Offset Registry
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 relative z-10">
          <div className="rounded-3xl bg-surface-dark/40 border-2 border-border-dark p-8 shadow-lg flex flex-col items-center group relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform rotate-12">
               <span className="material-symbols-outlined text-[120px]">public</span>
            </div>
            <div className="w-full flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-xl font-black text-white tracking-tight uppercase">Planetary Impact</h3>
              <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg">
                <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Index</span>
              </div>
            </div>
            
            <TemperatureGauge temperature={simulatedMetrics.temp} target={1.5} />
            
            <div className={`w-full mt-10 p-6 rounded-2xl border-2 transition-all duration-700 shadow-lg relative z-10 ${
              simulatedMetrics.temp <= 1.5 
              ? 'bg-emerald-500/[0.04] border-emerald-500/20 shadow-emerald-500/5' 
              : 'bg-amber-custom/[0.04] border-amber-custom/20 shadow-amber-custom/5'
            }`}>
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-xl flex items-center justify-center ${simulatedMetrics.temp <= 1.5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-custom/20 text-amber-custom'}`}>
                       <span className="material-symbols-outlined text-[18px]">
                        {simulatedMetrics.temp <= 1.5 ? 'verified' : 'priority_high'}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Strategy Match</span>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${simulatedMetrics.temp <= 1.5 ? 'bg-emerald-500 text-white' : 'bg-amber-custom text-white'}`}>
                    {simulatedMetrics.temp <= 1.5 ? 'ALIGNED 1.5°C' : 'REBALANCING REQ.'}
                  </span>
                </div>
                
                <p className="text-xs text-text-secondary leading-relaxed font-black uppercase italic tracking-tight">
                  {isSimulating 
                    ? `Projected warming: ${simulatedMetrics.temp.toFixed(2)}°C. Strategy results in ${simulatedMetrics.temp <= 1.5 ? 'full regulatory alignment.' : 'insufficient abatement for Paris compliance.'}`
                    : "Verified baseline indicates 1.8°C trajectory. Tactical intervention required to meet corporate 2030 mandates."
                  }
                </p>
                
                <div className="relative pt-2">
                   <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner p-px border border-white/5">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out rounded-full ${simulatedMetrics.temp <= 1.5 ? 'bg-emerald-500 shadow-glow-emerald' : 'bg-amber-custom shadow-glow-amber'}`}
                      style={{ width: `${Math.max(10, Math.min(100, (1 - (simulatedMetrics.temp - 1.1)/1.5) * 100))}%` }}
                    ></div>
                  </div>
                  <div className="absolute top-0 right-0 transform translate-y-[-100%]">
                     <span className="text-[8px] font-black text-slate-600 uppercase">Confidence Score: 94.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-surface-dark/40 border-2 border-border-dark p-8 shadow-lg flex-1 group backdrop-blur-sm relative">
            <h3 className="text-xl font-black text-white tracking-tight mb-8 uppercase">Integrity Diversification</h3>
            <div className="h-56 w-full relative mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={offsetCategories}
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {offsetCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip unit="Volume" methodology="Integrity Verification Layer v2" />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none transform translate-y-2">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Portfolio Core</p>
                <p className="text-2xl font-black text-white leading-none uppercase">
                  Removal
                </p>
                <p className="text-[11px] font-bold text-emerald-custom mt-1 uppercase">Assurance: High</p>
              </div>
            </div>
            <div className="space-y-4">
              {offsetCategories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-primary/20 transition-all cursor-default relative">
                  <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full shadow-lg" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cat.name}</span>
                  </div>
                  <span className="text-xs font-black text-white">{((cat.value / currentTotalOffsets) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// Sub-component for scenario comparisons
const ComparisonPanel: React.FC<{ title: string, subtitle: string, metrics: any, baseline?: any, type: 'baseline' | 'simulated' }> = ({ title, subtitle, metrics, baseline, type }) => {
  const isSim = type === 'simulated';
  return (
    <div className={`p-10 rounded-3xl border-2 relative transition-all duration-700 ${
      isSim ? 'bg-primary/[0.04] border-primary/30 shadow-glow-primary' : 'bg-slate-900/40 border-slate-700/50'
    }`}>
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4 overflow-hidden">
        <span className="material-symbols-outlined text-[140px]">{isSim ? 'architecture' : 'history'}</span>
      </div>
      
      <div className="relative z-10 mb-12">
        <p className={`text-[11px] font-black uppercase tracking-[0.3em] mb-3 ${isSim ? 'text-primary' : 'text-slate-500'}`}>
          {isSim ? 'Predictive View' : 'Verified Archive'}
        </p>
        <h2 className="text-3xl font-black text-white tracking-tight uppercase">{title}</h2>
        <p className="text-sm text-text-secondary font-black mt-2 italic uppercase tracking-tighter opacity-70">{subtitle}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-y-12 gap-x-8 relative z-10">
        <MetricDisplay 
          label="Gross Footprint" 
          value={`${(metrics.gross/1000).toFixed(1)}k`} 
          unit="tCO2e" 
          delta={baseline ? ((metrics.gross - baseline.gross)/baseline.gross * 100).toFixed(1) : undefined}
          accentColor={isSim ? 'text-primary' : 'text-white'}
        />
        <MetricDisplay 
          label="Net Balance" 
          value={`${(metrics.net/1000).toFixed(1)}k`} 
          unit="tCO2e" 
          delta={baseline ? ((metrics.net - baseline.net)/baseline.net * 100).toFixed(1) : undefined}
          accentColor={isSim ? 'text-emerald-400' : 'text-white'}
        />
        <MetricDisplay 
          label="Pathway Trajectory" 
          value={`${metrics.temp.toFixed(2)}°C`} 
          unit="IEA Alignment" 
          accentColor={metrics.temp <= 1.5 ? 'text-emerald-400' : 'text-amber-custom'}
        />
        <MetricDisplay 
          label="Budgetary Exposure" 
          value={`$${metrics.cost.toFixed(1)}M`} 
          unit="Est. Cost" 
          accentColor={isSim ? 'text-indigo-400' : 'text-white'}
        />
      </div>

      <div className={`mt-12 pt-8 border-t relative z-10 ${isSim ? 'border-primary/20' : 'border-slate-800'}`}>
         <div className="flex items-center gap-3">
           <div className={`size-2 rounded-full ${isSim ? 'bg-primary shadow-glow-primary animate-pulse' : 'bg-slate-700 shadow-lg'}`}></div>
           <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em]">
             {isSim ? 'Simulation results within 1.5°C tolerance' : 'Baseline exceeds planetary boundary limits'}
           </p>
         </div>
      </div>
    </div>
  );
};

const MetricDisplay: React.FC<{ label: string, value: string, unit: string, delta?: string, accentColor?: string }> = ({ label, value, unit, delta, accentColor = "text-white" }) => (
  <div className="flex flex-col gap-3 group">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
    <div className="flex items-baseline gap-2.5">
      <p className={`text-4xl font-black tracking-tighter ${accentColor} group-hover:translate-x-1 transition-transform duration-300`}>{value}</p>
      <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{unit}</p>
    </div>
    {delta && (
      <div className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg w-fit transition-all duration-500 ${Number(delta) <= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-custom bg-amber-500/10'}`}>
        <span className="material-symbols-outlined text-[16px]">{Number(delta) <= 0 ? 'south_east' : 'north_east'}</span>
        {delta}% <span className="text-[8px] opacity-40 ml-1 uppercase">from Base</span>
      </div>
    )}
  </div>
);

const KPICard: React.FC<{
  title: string, 
  value: string, 
  unit: string, 
  description: string,
  methodology: string,
  change?: string, 
  status?: string, 
  icon: string, 
  simulated?: boolean,
  type: 'primary' | 'emerald' | 'amber'
}> = ({title, value, unit, description, methodology, change, status, icon, simulated, type}) => {
  const accentClass = type === 'emerald' ? 'text-emerald-custom' : type === 'amber' ? 'text-amber-custom' : 'text-primary';
  const borderClass = simulated ? (type === 'emerald' ? 'border-emerald-500/40 shadow-glow-emerald ring-emerald-500/5' : type === 'amber' ? 'border-amber-custom/40 shadow-amber-custom/5 ring-amber-custom/5' : 'border-primary/40 shadow-glow-primary ring-primary/5') : 'border-border-dark';

  return (
    <div className={`flex flex-col gap-6 rounded-3xl p-7 bg-surface-dark/40 border-2 shadow-lg transition-all duration-500 group relative ${borderClass} ring-4 backdrop-blur-sm`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-xl bg-slate-950 border border-white/5 ${accentClass} group-hover:scale-110 transition-transform flex items-center justify-center`}>
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</p>
          <div className="relative group/tip">
            <span className="material-symbols-outlined text-[14px] cursor-help opacity-40 hover:opacity-100">info</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-950 border border-white/10 rounded-xl opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-[200] shadow-2xl">
              <p className="text-[9px] font-bold text-white uppercase leading-tight">{description}</p>
              <p className="text-[8px] font-black text-primary uppercase mt-2">Methodology: {methodology}</p>
            </div>
          </div>
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
            change.includes('-') ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-custom bg-amber-500/10'
          }`}>
            {change}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className={`text-4xl font-black leading-tight tracking-tighter transition-colors ${simulated ? accentClass : 'text-white'}`}>
          {value} <span className="text-base font-black opacity-20 ml-1">{unit}</span>
        </p>
        {status && (
          <div className="flex items-center gap-2 mt-4">
            <div className={`size-2 rounded-full animate-pulse-soft ${status === 'Exposure' ? 'bg-amber-custom shadow-glow-amber' : 'bg-emerald-500 shadow-glow-emerald'}`}></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
