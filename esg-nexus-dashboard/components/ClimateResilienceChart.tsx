
import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { RESILIENCE_DATA } from '../constants';
import Tooltip from './Tooltip';

interface Props {
  globalYear: string;
  globalStandard: string;
}

interface ScenarioMeta {
  id: string;
  name: string;
  color: string;
  description: string;
  dataKey: string;
}

const SCENARIOS: ScenarioMeta[] = [
  { id: 'ssp1_19', name: 'SSP1-1.9 (Very Low)', color: '#13eca4', dataKey: 'ssp1_19', description: 'Very low GHG emissions. Net zero CO2 around 2050. Limits warming to ~1.5°C.' },
  { id: 'ssp1_26', name: 'SSP1-2.6 (Low)', color: '#3b82f6', dataKey: 'ssp1_26', description: 'Low GHG emissions. Net zero CO2 around 2075. Limits warming to ~2.0°C.' },
  { id: 'ssp2_45', name: 'SSP2-4.5 (Intermediate)', color: '#eab308', dataKey: 'ssp2_45', description: 'Intermediate GHG emissions. CO2 remains around current levels until 2050. ~2.7°C warming.' },
  { id: 'ssp3_70', name: 'SSP3-7.0 (High)', color: '#f97316', dataKey: 'ssp3_70', description: 'High GHG emissions. CO2 emissions double from current levels by 2100. ~3.6°C warming.' },
  { id: 'ssp5_85', name: 'SSP5-8.5 (Very High)', color: '#ef4444', dataKey: 'ssp5_85', description: 'Very high GHG emissions. Rapid economic growth powered by fossils. >4.4°C warming.' },
];

const ClimateResilienceChart: React.FC<Props> = ({ globalYear, globalStandard }) => {
  const [activeScenarios, setActiveScenarios] = useState<Set<string>>(new Set(['ssp1_19', 'ssp5_85']));

  const toggleScenario = (id: string) => {
    setActiveScenarios(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id); // Keep at least one
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Generate dynamic data based on global filters if needed
  const dynamicData = useMemo(() => {
    // Standard-based adjustment factors (mocking)
    const factor = globalStandard === 'TCFD' ? 1.05 : 1.0;
    return RESILIENCE_DATA.map(item => {
      const newItem = { ...item };
      // Apply subtle variance based on selected standard
      Object.keys(newItem).forEach(key => {
        if (key !== 'year' && typeof newItem[key] === 'number') {
          (newItem as any)[key] = (newItem as any)[key] * factor;
        }
      });
      return newItem;
    });
  }, [globalStandard]);

  return (
    <div className="xl:col-span-2 rounded-xl bg-[#1d2a25] border border-[#283933] p-6 flex flex-col transition-all duration-500 min-h-[500px]">
      <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white text-lg font-bold">Climate Resilience Analysis</h3>
            <Tooltip content={`IPCC Sixth Assessment Report (AR6) scenarios. Reporting logic: ${globalStandard}.`}>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase cursor-help">IPCC AR6 Basis</span>
            </Tooltip>
          </div>
          <p className="text-[#9db9b0] text-xs">Scenario Modeling up to 2100 Time Horizon</p>
        </div>
        
        <div className="flex flex-wrap gap-2 max-w-md justify-end">
          {SCENARIOS.map((s) => (
            <Tooltip key={s.id} content={s.description}>
              <button 
                onClick={() => toggleScenario(s.id)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all text-[10px] font-black uppercase tracking-tight ${
                  activeScenarios.has(s.id) 
                    ? 'bg-[#111816] border-white/20 text-white shadow-lg' 
                    : 'bg-transparent border-[#283933] text-[#5c736a] hover:text-[#9db9b0]'
                }`}
              >
                <div className="size-2 rounded-full" style={{ backgroundColor: activeScenarios.has(s.id) ? s.color : '#283933' }}></div>
                {s.name}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dynamicData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <defs>
              {SCENARIOS.map(s => (
                <linearGradient key={`grad-${s.id}`} id={`color-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={s.color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#283933" />
            <XAxis 
              dataKey="year" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#5c736a', fontSize: 11, fontWeight: 800 }}
              dy={15}
            />
            <YAxis hide domain={[0, 220]} />
            <RechartsTooltip 
              contentStyle={{ backgroundColor: '#1d2a25', border: '1px solid #283933', borderRadius: '8px', padding: '12px' }}
              itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
              labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}
              cursor={{ stroke: '#283933', strokeWidth: 2 }}
            />
            
            {/* Base Reference Scenario (Current Path) */}
            <Area 
              type="monotone" 
              dataKey="current" 
              stroke="#9db9b0" 
              strokeDasharray="5 5"
              fill="transparent" 
              strokeWidth={1}
              name="Current Trajectory"
              animationDuration={1000}
            />

            {SCENARIOS.filter(s => activeScenarios.has(s.id)).map((s, idx) => (
              <Area 
                key={s.id}
                type="monotone" 
                dataKey={s.dataKey} 
                stroke={s.color} 
                fillOpacity={1} 
                fill={`url(#color-${s.id})`} 
                strokeWidth={activeScenarios.size === 1 ? 4 : 2}
                name={s.name}
                animationDuration={1000 + (idx * 200)}
                activeDot={{ r: 6, stroke: '#1d2a25', strokeWidth: 2 }}
              />
            ))}

            <ReferenceLine 
              x={globalYear} 
              stroke="white"
              strokeDasharray="3 3"
              label={(props: any) => {
                const { viewBox } = props;
                if (!viewBox) return null;
                return (
                  <g transform={`translate(${viewBox.x}, ${viewBox.y})`}>
                    <rect x="-40" y="-30" width="80" height="24" rx="4" fill="#fff" />
                    <text x="0" y="-14" textAnchor="middle" fill="#111816" fontSize="10" fontWeight="900">REPORTING: {globalYear}</text>
                  </g>
                );
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#111816]/30 border border-[#283933] rounded-lg">
        <div>
          <h5 className="text-white text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">psychology</span>
            Strategic Implications
          </h5>
          <p className="text-[#9db9b0] text-[11px] leading-relaxed">
            Transition risks peak under <span className="text-white font-bold">SSP1-1.9</span> due to aggressive carbon pricing, while physical risks dominate <span className="text-white font-bold">SSP5-8.5</span> after 2040. Portfolio resilience requires dual-scenario hedging.
          </p>
        </div>
        <div>
          <h5 className="text-white text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#3b82f6]">history</span>
            Time Horizons
          </h5>
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-white text-[10px] font-bold">Short (2030)</span>
              <span className="text-[#5c736a] text-[9px]">Regulatory shift focus</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-[10px] font-bold">Mid (2050)</span>
              <span className="text-[#5c736a] text-[9px]">Supply chain Decarb</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-[10px] font-bold">Long (2100)</span>
              <span className="text-[#5c736a] text-[9px]">Asset viability</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClimateResilienceChart;
