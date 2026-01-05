
import React from 'react';

interface TemperatureGaugeProps {
  temperature: number;
  target: number;
}

const TemperatureGauge: React.FC<TemperatureGaugeProps> = ({ temperature, target }) => {
  // Map temperature to rotation. Assuming gauge is 0 to 3.0 degrees.
  const rotation = ((temperature / 3.0) * 180) - 90;
  const clampedRotation = Math.max(-90, Math.min(90, rotation));

  // Threshold marker rotations
  const parisRotation = ((1.5 / 3.0) * 180) - 90;
  const criticalRotation = ((2.0 / 3.0) * 180) - 90;

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative py-6">
      <div className="w-80 h-40 relative overflow-hidden group">
        {/* Track with Inner Shadow and Depth */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full rounded-t-full border-[2.2rem] border-slate-800/80 border-b-0 shadow-inner z-0"></div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[calc(100%-2px)] h-[calc(100%-1px)] rounded-t-full border-[2.2rem] border-slate-900/60 border-b-0 z-0"></div>
        
        {/* Threshold Markers - Precision Styled */}
        <div 
          className="absolute bottom-0 left-1/2 w-px h-full origin-bottom z-10"
          style={{ transform: `rotate(${parisRotation}deg)` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)] border border-emerald-300/30"></div>
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-emerald-500 uppercase tracking-widest whitespace-nowrap">Goal 1.5°C</span>
        </div>

        <div 
          className="absolute bottom-0 left-1/2 w-px h-full origin-bottom z-10"
          style={{ transform: `rotate(${criticalRotation}deg)` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-8 bg-amber-custom rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] border border-amber-300/30"></div>
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-amber-custom uppercase tracking-widest whitespace-nowrap">2.0°C Limit</span>
        </div>
        
        {/* Active Progress Arc (Dynamic Color based on temp) */}
        <div 
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full rounded-t-full border-[2.2rem] ${temperature <= 1.5 ? 'border-emerald-500' : temperature <= 2.0 ? 'border-amber-custom' : 'border-red-500'} border-b-0 origin-bottom transition-all duration-1000 ease-in-out opacity-20 blur-[1px]`}
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 100%)',
            transform: `rotate(${Math.min(clampedRotation, 0)}deg)` 
          }}
        ></div>

        {/* Needle - Elegant Command Design */}
        <div 
          className="absolute bottom-0 left-1/2 w-1.5 h-[98%] origin-bottom rounded-full -translate-x-1/2 transition-transform duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) z-20"
          style={{ transform: `rotate(${clampedRotation}deg)` }}
        >
          <div className={`w-full h-full rounded-full shadow-2xl ${temperature <= 1.5 ? 'bg-emerald-400' : 'bg-white'} border-x border-white/20`}></div>
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-slate-900 bg-inherit shadow-lg"></div>
        </div>
        
        {/* Center Point - Floating Hub Effect */}
        <div className="absolute bottom-0 left-1/2 w-8 h-8 bg-slate-800 dark:bg-slate-900 rounded-full -translate-x-1/2 translate-y-1/2 z-30 border-4 border-slate-700 shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-primary shadow-glow-primary"></div>
        </div>
      </div>

      <div className="mt-12 text-center relative z-10">
        <div className="flex items-baseline justify-center gap-2">
          <span className={`text-6xl font-black tracking-tighter transition-colors duration-500 ${temperature <= 1.5 ? 'text-emerald-400' : temperature <= 2.0 ? 'text-amber-custom' : 'text-red-400'}`}>
            {temperature.toFixed(2)}
          </span>
          <span className="text-2xl font-black text-slate-500 tracking-tighter uppercase">°C</span>
        </div>
        <div className="flex flex-col items-center mt-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${temperature > target ? 'bg-amber-custom/10 text-amber-custom' : 'bg-emerald-500/10 text-emerald-500'}`}>
            <span className="material-symbols-outlined text-[14px]">{temperature > target ? 'trending_up' : 'verified'}</span>
            {temperature > target ? 'Trajectory Above Target' : 'Target Aligned'}
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-3">Paris Agreement Pathway Index</p>
        </div>
      </div>
    </div>
  );
};

export default TemperatureGauge;
