
import React, { useMemo } from 'react';
import { COMPLIANCE_FRAMEWORKS, REGULATORY_CALENDAR } from '../constants';

const ComplianceView: React.FC = () => {
  const overallReadiness = useMemo(() => {
    return Math.round(COMPLIANCE_FRAMEWORKS.reduce((acc, curr) => acc + curr.readiness, 0) / COMPLIANCE_FRAMEWORKS.length);
  }, []);

  return (
    <div className="px-4 py-8 md:px-10 lg:px-20 max-w-[1600px] mx-auto w-full animate-in fade-in duration-700 relative">
      {/* Decorative Blur */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-8 relative z-10">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="size-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border-2 border-primary/20 shadow-glow-primary">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight uppercase">Regulatory Command</h2>
          </div>
          <p className="text-text-secondary font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
             Assurance Engine Integrated with Global Standard Bodies • RBI, BRSR, ISSB, CSRD Active
          </p>
        </div>

        <div className="flex items-center gap-8 p-6 rounded-3xl bg-surface-dark/40 border-2 border-border-dark shadow-2xl backdrop-blur-xl">
           <div className="flex flex-col items-center">
              <div className="relative size-16 flex items-center justify-center">
                 <svg className="size-full -rotate-90 transform">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-800" />
                    <circle 
                        cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" 
                        strokeDasharray={176} 
                        strokeDashoffset={176 - (176 * overallReadiness / 100)} 
                        className="text-primary transition-all duration-1000 ease-in-out shadow-glow-primary" 
                    />
                 </svg>
                 <span className="absolute text-sm font-black text-white">{overallReadiness}%</span>
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase mt-2 tracking-widest">Aggregate Readiness</p>
           </div>
           <div className="h-12 w-px bg-white/10"></div>
           <div className="flex flex-col justify-center">
              <p className="text-xl font-black text-white leading-none tracking-tight">Vigilant</p>
              <p className="text-[9px] font-black text-emerald-500 uppercase mt-2 tracking-widest flex items-center gap-1.5">
                <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Status: Audit Ready
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Framework Grid */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMPLIANCE_FRAMEWORKS.map((framework) => (
              <div key={framework.id} className="group p-8 rounded-3xl bg-surface-dark/40 border-2 border-border-dark hover:border-primary/40 transition-all duration-500 shadow-xl relative backdrop-blur-sm">
                {/* Visual Status Indicator Background (wrapped for overflow control) */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  <div className={`absolute -top-12 -right-12 size-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity ${
                     framework.status === 'Compliant' ? 'bg-emerald-500' : framework.status === 'At Risk' ? 'bg-amber-custom' : 'bg-primary'
                  }`}></div>
                </div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <h4 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                        {framework.name}
                        {framework.regulator && <span className="text-[8px] font-black bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-slate-500 uppercase">{framework.regulator}</span>}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{framework.jurisdiction}</p>
                  </div>
                  <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.1em] border ${
                    framework.status === 'Compliant' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-glow-emerald' : 
                    framework.status === 'At Risk' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20 shadow-glow-primary'
                  }`}>
                    {framework.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 h-12 line-clamp-2 italic relative z-10">
                  "{framework.description}"
                </p>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-600">Standard Fulfillment</span>
                    <span className="text-white">{framework.readiness}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-px border border-white/5">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out ${
                        framework.status === 'Compliant' ? 'bg-emerald-500' : framework.status === 'At Risk' ? 'bg-amber-500' : 'bg-primary'
                      }`}
                      style={{ width: `${framework.readiness}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                   <div className="flex flex-wrap gap-2">
                      {framework.keyDisclosures.map((kd, i) => (
                        <span key={i} className="text-[7px] font-black text-slate-500 bg-slate-900 border border-white/5 px-2 py-0.5 rounded uppercase tracking-tighter hover:text-white transition-colors cursor-default">{kd}</span>
                      ))}
                   </div>
                   <button className="material-symbols-outlined text-[18px] text-slate-600 hover:text-white transition-colors group-hover:translate-x-1 duration-300">double_arrow</button>
                </div>
              </div>
            ))}
          </div>

          {/* EU Taxonomy Alignment Module */}
          <div className="rounded-3xl bg-slate-900/40 border-2 border-border-dark p-10 shadow-inner relative group backdrop-blur-lg">
             <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <div className="absolute -bottom-20 -left-20 size-64 bg-emerald-500/5 rounded-full blur-[80px]"></div>
             </div>
             <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 uppercase">
                    <span className="material-symbols-outlined text-emerald-500 text-[28px]">eco</span>
                    Taxonomy Performance Matrix
                    </h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EU 2020/852 Classification Engine</p>
                </div>
                <div className="flex gap-2">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">DNSH Validated</span>
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Pillar 1/2 Scope</span>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                <div className="flex flex-col gap-8">
                   <div className="p-8 bg-slate-950/40 rounded-3xl border border-white/5 shadow-2xl">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-6 tracking-widest flex justify-between">
                        Interoperability Breakdown
                        <span className="text-emerald-500">FY24 PROJECTION</span>
                      </p>
                      <div className="space-y-8">
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-black">
                               <span className="text-white uppercase tracking-tighter">Eligibility (Revenue)</span>
                               <span className="text-emerald-500 text-lg">74%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-px">
                               <div className="h-full bg-emerald-500 w-[74%] shadow-glow-emerald"></div>
                            </div>
                         </div>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-black">
                               <span className="text-white uppercase tracking-tighter">Alignment (CapEx)</span>
                               <span className="text-primary text-lg">22.8%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-px">
                               <div className="h-full bg-primary w-[22.8%] shadow-glow-primary"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col justify-center gap-6">
                   <div>
                        <h5 className="text-base font-black text-white uppercase mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-custom text-[20px]">psychology</span>
                            Critical Gap Analysis
                        </h5>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                            "Revenue alignment is currently gated by data unavailability in Category 11 of Scope 3. Enhancing downstream durability testing will unlock **14% additional alignment** for the FY25 reporting cycle."
                        </p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 text-center">
                            <p className="text-[18px] font-black text-white">4.2<span className="text-[10px] ml-0.5 text-slate-500">%</span></p>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mt-1">OpEx Alignment</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 text-center">
                            <p className="text-[18px] font-black text-white">92<span className="text-[10px] ml-0.5 text-slate-500">%</span></p>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mt-1">Social Safeguard Pass</p>
                        </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Regulatory Timeline & Calendar Sidebar */}
        <div className="flex flex-col gap-8 h-full">
          {/* Calendar */}
          <div className="rounded-3xl bg-surface-dark/40 border-2 border-border-dark p-8 shadow-2xl flex flex-col h-full backdrop-blur-md relative">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">notifications_active</span>
                Regulatory Ops
                </h3>
                <span className="text-[10px] font-black text-slate-500 bg-slate-800 px-2 py-0.5 rounded uppercase">Real-time Sync</span>
            </div>

            <div className="space-y-4 flex-1 relative z-10">
               {REGULATORY_CALENDAR.map((item) => (
                 <div key={item.id} className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/20 transition-all group cursor-pointer relative">
                    {item.priority === 'Critical' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 z-20"></div>}
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-[0.1em] ${
                         item.priority === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-glow-red' : 
                         item.priority === 'High' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-400'
                       }`}>
                         {item.priority}
                       </span>
                       <span className="text-[10px] font-mono font-bold text-slate-500">{item.date}</span>
                    </div>
                    
                    <h5 className="text-sm font-black text-white group-hover:text-primary transition-colors leading-tight mb-4 relative z-10">
                        {item.framework}: {item.event}
                    </h5>

                    <div className="flex items-center gap-3 relative z-10">
                       <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden p-px">
                          <div className={`h-full ${item.priority === 'Critical' ? 'bg-red-500' : 'bg-primary'} w-1/4`}></div>
                       </div>
                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Draft 35%</span>
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 space-y-4 relative z-10">
                <button className="relative w-full group py-4 bg-primary text-white rounded-2xl transition-all duration-500 hover:bg-blue-600 shadow-glow-primary hover:shadow-[0_0_40px_-5px_rgba(19,91,236,0.6)] active:scale-95 flex items-center justify-center gap-3 overflow-hidden border border-white/20">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 skew-x-[-45deg] translate-x-4 -translate-y-4 pointer-events-none"></div>
                    
                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform duration-300">verified</span>
                    <span className="text-[11px] font-black uppercase tracking-[0.25em] drop-shadow-md">New Compliance Entry</span>
                    
                    {/* Tactical scanning light sweep effect */}
                    <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[sweep_2s_infinite] pointer-events-none"></div>
                </button>
                <button className="w-full py-4 bg-slate-800/40 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 hover:text-white transition-all">
                    Framework Management
                </button>
            </div>
          </div>

          {/* Verification Log */}
          <div className="rounded-3xl bg-surface-dark/40 border-2 border-border-dark p-8 shadow-xl backdrop-blur-md relative">
             <h3 className="text-lg font-black text-white mb-6 tracking-tight uppercase flex items-center justify-between">
                Audit Trail
                <span className="material-symbols-outlined text-slate-600">history</span>
             </h3>
             <div className="space-y-4">
                <div className="flex items-start gap-4">
                   <div className="size-2 bg-emerald-500 rounded-full mt-1.5 shadow-glow-emerald"></div>
                   <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none">BRSR Verification OK</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Approved by SGS Assurance • 12h ago</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="size-2 bg-primary rounded-full mt-1.5 shadow-glow-primary"></div>
                   <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none">RBI Disclosure Update</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Stress Test values synced • 2d ago</p>
                   </div>
                </div>
                <div className="flex items-start gap-4 opacity-40">
                   <div className="size-2 bg-slate-700 rounded-full mt-1.5"></div>
                   <div>
                      <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">SFDR Filing Ready</p>
                      <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">Pending Partner Approval • 4d ago</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceView;
