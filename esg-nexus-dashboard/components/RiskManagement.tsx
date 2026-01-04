
import React, { useState, useMemo } from 'react';
import { RISKS } from '../constants';
import { RiskItem, MapHotspot } from '../types';
import Tooltip from './Tooltip';

interface MapProps {
  activeRisk: RiskItem | null;
  globalScope: string;
}

const WorldMapSVG: React.FC<MapProps> = ({ activeRisk, globalScope }) => {
  const filteredHotspots = useMemo(() => {
    if (!activeRisk) return [];
    if (globalScope === 'Global') return activeRisk.hotspots;
    return activeRisk.hotspots.filter(spot => spot.scope === globalScope);
  }, [activeRisk, globalScope]);

  return (
    <svg viewBox="0 0 800 400" className="w-full h-full opacity-60 transition-all duration-700" aria-hidden="true">
      {/* Simplified World Map Paths */}
      <path d="M100,100 Q150,50 200,80 T300,100 T450,80 T600,120 T750,150 T650,300 T450,350 T250,320 T100,250 Z" fill="#283933" />
      <path d="M400,150 Q420,130 440,150 T460,180 T420,200 Z" fill="#344a42" />
      <path d="M550,250 Q580,220 620,240 T650,280 T600,310 Z" fill="#344a42" />
      
      {filteredHotspots.map((spot, i) => (
        <g key={i} className="animate-in zoom-in duration-500">
          {/* Pulsing Aura */}
          <circle cx={spot.x} cy={spot.y} r="14" fill={activeRisk?.color} fillOpacity="0.15">
            <animate attributeName="r" values="12;18;12" dur="3s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
          </circle>
          
          {/* Category Icon */}
          <text
            x={spot.x}
            y={spot.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={activeRisk?.color}
            fontSize="20"
            className="material-symbols-outlined pointer-events-none select-none drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
          >
            {activeRisk?.icon}
          </text>

          {/* Asset Label */}
          <text 
            x={spot.x + 16} 
            y={spot.y + 4} 
            fill="white" 
            fontSize="9" 
            fontWeight="800" 
            className="pointer-events-none drop-shadow-md tracking-tight uppercase"
          >
            {spot.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

interface RiskManagementProps {
  globalScope: string;
}

const RiskManagement: React.FC<RiskManagementProps> = ({ globalScope }) => {
  const [selectedRiskId, setSelectedRiskId] = useState<string>(RISKS[0].id);
  
  const filteredRisks = useMemo(() => {
    if (globalScope === 'Global') return RISKS;
    return RISKS.map(risk => ({
      ...risk,
      hasLocalHotspots: risk.hotspots.some(h => h.scope === globalScope)
    }));
  }, [globalScope]);

  const activeRisk = RISKS.find(r => r.id === selectedRiskId) || RISKS[0];

  const getRiskDescription = (category: string) => {
    if (category.includes('PHYSICAL')) return "Direct risks from climate change (storms, floods, heatwaves).";
    if (category.includes('TRANSITION')) return "Risks from the shift to a low-carbon economy (policy, tech).";
    if (category.includes('OPPORTUNITIES')) return "Strategic advantages gained from the climate transition.";
    return "Categorized risk exposure.";
  };

  return (
    <section className="rounded-xl bg-[#1d2a25] border border-[#283933] p-0 flex flex-col overflow-hidden h-full min-h-[500px] transition-all duration-500" aria-labelledby="risk-mgmt-title">
      <div className="flex justify-between items-center p-6 bg-surface-dark border-b border-[#283933]">
        <div>
          <h3 id="risk-mgmt-title" className="text-white text-lg font-bold">Global Risk Exposure</h3>
          <p className="text-[#9db9b0] text-xs">Targeting: <span className="text-primary font-bold">{globalScope}</span> Assets</p>
        </div>
        <Tooltip content="Live visualization of asset vulnerabilities with category-specific indicators">
          <span className="bg-[#283933] text-primary text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold border border-primary/20 cursor-help">Live Insight</span>
        </Tooltip>
      </div>

      <div className="relative flex-1 bg-[#111816]/30 overflow-hidden flex items-center justify-center min-h-[300px]">
        <WorldMapSVG activeRisk={activeRisk} globalScope={globalScope} />
        
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 p-3 bg-background-dark/80 backdrop-blur-sm rounded-lg border border-[#283933]">
          <p className="text-[10px] font-bold text-[#9db9b0] uppercase tracking-widest">{globalScope} Legend</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#f97316]" style={{ fontVariationSettings: "'FILL' 1" }}>flood</span>
            <span className="text-[10px] text-white">Physical Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#eab308]" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
            <span className="text-[10px] text-white">Transition Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>solar_power</span>
            <span className="text-[10px] text-white">Opportunities</span>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-3 gap-3 bg-surface-dark border-t border-[#283933]">
        {filteredRisks.map((risk) => {
          const isActive = selectedRiskId === risk.id;
          const isDisabled = globalScope !== 'Global' && !risk.hasLocalHotspots;
          
          return (
            <Tooltip key={risk.id} content={getRiskDescription(risk.category)}>
              <button
                disabled={isDisabled}
                onClick={() => setSelectedRiskId(risk.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive 
                    ? 'bg-[#111816] border-primary/50 shadow-lg shadow-primary/5' 
                    : isDisabled
                    ? 'bg-transparent border-[#283933] opacity-20 cursor-not-allowed grayscale'
                    : 'bg-transparent border-[#283933] opacity-60 hover:opacity-100 hover:border-[#344a42]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-lg" style={{ color: risk.color }} aria-hidden="true">
                    {risk.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase truncate" style={{ color: isActive ? risk.color : '#9db9b0' }}>
                    {risk.category.split(' ')[0]}
                  </span>
                </div>
                <h4 className={`text-[11px] font-bold truncate ${isActive ? 'text-white' : 'text-[#9db9b0]'}`}>
                  {risk.title}
                </h4>
              </button>
            </Tooltip>
          );
        })}
      </div>

      <div className={`px-6 py-4 bg-[#111816]/50 transition-opacity duration-300 ${activeRisk ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-[11px] text-[#cbd5e1] leading-relaxed italic">
          <span className="font-bold text-white mr-2">Scope Analysis:</span>
          {globalScope === 'Global' ? activeRisk?.description : `Targeted vulnerability assessment for ${activeRisk?.title} across ${globalScope} operational sites.`}
        </p>
      </div>
    </section>
  );
};

export default RiskManagement;
