
import React from 'react';
import { SCOPE_CATEGORIES } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#135bec', '#3b82f6', '#6366f1', '#8b5cf6', '#a5b4fc'];

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl z-[200] relative">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">{payload[0].name}</p>
        <div className="flex items-center justify-between gap-6">
          <span className="text-[11px] font-bold text-slate-300 uppercase">Emissions:</span>
          <span className="text-[11px] font-black text-white">{payload[0].value.toLocaleString()} tCO2e</span>
        </div>
        <div className="flex items-center justify-between gap-6 mt-1">
          <span className="text-[11px] font-bold text-slate-300 uppercase">Share:</span>
          <span className="text-[11px] font-black text-primary">{payload[0].payload.percentage}%</span>
        </div>
      </div>
    );
  }
  return null;
};

const MetricsView: React.FC = () => {
  return (
    <div className="px-4 py-8 md:px-10 lg:px-20 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">GHG Inventory Hub</h2>
          <p className="text-text-secondary font-bold mt-2 uppercase tracking-widest text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">verified</span> 
            Standard: GHG Protocol Corporate Value Chain Standard
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">ISO 14064 Verified</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 rounded-3xl bg-surface-dark/40 border-2 border-border-dark p-8 relative">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white">Scope 3 Category Breakdown</h3>
            <div className="relative group/tip">
              <span className="material-symbols-outlined text-[20px] cursor-help opacity-40 hover:opacity-100 text-slate-500">info</span>
              <div className="absolute bottom-full right-0 mb-2 w-64 p-4 bg-slate-950 border border-white/10 rounded-2xl opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-[200] shadow-2xl">
                <p className="text-[10px] font-bold text-white uppercase leading-relaxed">Granular view of emissions by GHG Protocol categories across the upstream and downstream value chain.</p>
                <p className="text-[8px] font-black text-primary uppercase mt-2">Data Quality Standard: DQI Framework</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-black text-slate-500 border-b border-white/5">
                  <th className="pb-4">Category</th>
                  <th className="pb-4">
                    <div className="flex items-center gap-1">
                      Maturity
                      <div className="relative group/m">
                        <span className="material-symbols-outlined text-[12px] opacity-40 hover:opacity-100 cursor-help">help</span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-slate-900 border border-white/10 rounded-lg opacity-0 group-hover/m:opacity-100 transition-opacity z-[200]">
                           <p className="text-[8px] font-bold text-white uppercase">Measures data completeness and verification status.</p>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="pb-4">Emissions (tCO2e)</th>
                  <th className="pb-4">YoY %</th>
                  <th className="pb-4">Data Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {SCOPE_CATEGORIES.map(cat => (
                  <tr key={cat.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{cat.name}</span>
                        <span className="text-[9px] font-black text-slate-500 uppercase">{cat.type}</span>
                      </div>
                    </td>
                    <td className="py-4">
                       <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className={`size-1 rounded-full ${i <= (cat.quality === 'High' ? 5 : 3) ? 'bg-primary' : 'bg-slate-800'}`}></div>
                          ))}
                       </div>
                    </td>
                    <td className="py-4 font-mono text-white text-sm">{cat.emissions.toLocaleString()}</td>
                    <td className={`py-4 text-xs font-black ${cat.yoyChange < 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {cat.yoyChange > 0 ? '+' : ''}{cat.yoyChange}%
                    </td>
                    <td className="py-4">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border ${
                        cat.quality === 'High' ? 'text-emerald-400 border-emerald-500/20' : 'text-slate-400 border-slate-700'
                      }`}>
                        {cat.quality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl bg-surface-dark/40 border-2 border-border-dark p-8 flex flex-col items-center relative">
          <div className="flex items-center justify-between w-full mb-8">
            <h3 className="text-xl font-black text-white self-start">Emissions Source Mix</h3>
            <div className="relative group/tip">
              <span className="material-symbols-outlined text-[20px] cursor-help opacity-40 hover:opacity-100 text-slate-500">info</span>
              <div className="absolute bottom-full right-0 mb-2 w-64 p-4 bg-slate-950 border border-white/10 rounded-2xl opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-[200] shadow-2xl">
                <p className="text-[10px] font-bold text-white uppercase leading-relaxed">Percentage distribution of total carbon footprint across Scope 3 categories.</p>
                <p className="text-[8px] font-black text-primary uppercase mt-2">Verified against GHG Value Chain Standard</p>
              </div>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* Fixed TypeScript error by casting SCOPE_CATEGORIES to any[] to satisfy Recharts data requirements (missing index signature) */}
                <Pie data={SCOPE_CATEGORIES as any[]} dataKey="emissions" innerRadius={60} outerRadius={90} paddingAngle={5}>
                  {SCOPE_CATEGORIES.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 w-full">
            {SCOPE_CATEGORIES.map((cat, i) => (
              <div key={cat.id} className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 relative">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  {cat.name}
                </div>
                <span>{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsView;
