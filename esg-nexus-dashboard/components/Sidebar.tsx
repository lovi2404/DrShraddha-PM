
import React, { useState } from 'react';
import { NAVIGATION_ITEMS, DEFAULT_COMPANIES } from '../constants';

interface SidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedCompanyId: string;
  onCompanyChange: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  isCollapsed, 
  onToggleCollapse, 
  selectedCompanyId,
  onCompanyChange 
}) => {
  const [showCompanyList, setShowCompanyList] = useState(false);

  const selectedCompany = DEFAULT_COMPANIES.find(c => c.id === selectedCompanyId) || DEFAULT_COMPANIES[0];

  return (
    <aside 
      className={`hidden lg:flex flex-col border-r border-[#283933] bg-background-dark p-4 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`} 
      aria-label="Sidebar"
    >
      <div className={`flex items-center gap-3 px-2 mb-8 mt-2 overflow-hidden transition-all ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="flex-shrink-0 flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary" aria-hidden="true">
          <span className="material-symbols-outlined text-2xl">eco</span>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
            <h1 className="text-white text-lg font-bold leading-normal">ESG Nexus</h1>
            <p className="text-[#9db9b0] text-xs font-medium uppercase tracking-wider">Global Platform</p>
          </div>
        )}
      </div>

      {/* Target Entity Selection */}
      <div className="mb-6 px-1 relative">
        <div className={`p-3 rounded-xl bg-[#1d2a25] border border-[#283933] group transition-all hover:border-primary/50 cursor-pointer ${isCollapsed ? 'flex justify-center' : ''}`}
             onClick={() => !isCollapsed && setShowCompanyList(!showCompanyList)}>
          <div className="flex items-center gap-3">
             <div className="size-8 rounded bg-[#111816] flex items-center justify-center text-primary border border-primary/20">
               <span className="material-symbols-outlined text-sm">business</span>
             </div>
             {!isCollapsed && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-[10px] font-black uppercase text-[#5c736a] tracking-widest leading-none mb-1">Target Entity</p>
                 <div className="flex items-center justify-between">
                   <h3 className="text-white text-sm font-bold truncate">{selectedCompany.name}</h3>
                   <span className={`material-symbols-outlined text-sm text-[#5c736a] transition-transform ${showCompanyList ? 'rotate-180' : ''}`}>expand_more</span>
                 </div>
               </div>
             )}
          </div>
        </div>

        {showCompanyList && !isCollapsed && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#1d2a25] border border-[#283933] rounded-xl shadow-2xl py-2 z-[110] animate-in fade-in zoom-in-95 duration-200">
            <div className="px-3 py-1 mb-1">
              <p className="text-[9px] font-black uppercase text-[#5c736a] tracking-tighter">Available Portfolios</p>
            </div>
            {DEFAULT_COMPANIES.map(company => (
              <button
                key={company.id}
                onClick={() => {
                  onCompanyChange(company.id);
                  setShowCompanyList(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between group ${
                  selectedCompanyId === company.id ? 'bg-primary/10 text-primary font-bold' : 'text-[#9db9b0] hover:bg-[#283933] hover:text-white'
                }`}
              >
                <div className="flex flex-col">
                  <span>{company.name}</span>
                  <span className="text-[9px] opacity-60 uppercase font-bold">{company.ticker} • {company.sector}</span>
                </div>
                {selectedCompanyId === company.id && <span className="material-symbols-outlined text-sm">check</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1 flex-1" aria-label="Main Navigation">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-primary ${isCollapsed ? 'justify-center' : ''} ${
                  isActive
                    ? 'bg-primary/10 border-l-4 border-primary text-white font-bold'
                    : 'text-[#9db9b0] hover:bg-[#283933] hover:text-white border-l-4 border-transparent'
                }`}
              >
                <span className={`material-symbols-outlined flex-shrink-0 ${isActive ? 'text-primary' : ''}`} aria-hidden="true">
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="text-sm animate-in fade-in duration-300 whitespace-nowrap">{item.label}</span>
                )}
              </button>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1d2a25] border border-[#283933] text-white text-xs font-bold rounded-md shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-[100] whitespace-nowrap">
                  <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-[#1d2a25] border-l border-b border-[#283933] rotate-45"></div>
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-[#283933]">
        <div className="relative group">
          <button
            onClick={onToggleCollapse}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[#9db9b0] hover:bg-[#283933] hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-primary mb-2 ${isCollapsed ? 'justify-center' : ''}`}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }} aria-hidden="true">
              {isCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
            </span>
            {!isCollapsed && <p className="text-sm font-medium">Collapse</p>}
          </button>
          {isCollapsed && (
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1d2a25] border border-[#283933] text-white text-xs font-bold rounded-md shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-[100] whitespace-nowrap">
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-[#1d2a25] border-l border-b border-[#283933] rotate-45"></div>
              Expand Menu
            </div>
          )}
        </div>

        <div className="relative group">
          <a 
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[#9db9b0] hover:bg-[#283933] hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-primary ${isCollapsed ? 'justify-center' : ''}`} 
            href="#settings"
            aria-label="Account Settings"
          >
            <span className="material-symbols-outlined flex-shrink-0" aria-hidden="true">settings</span>
            {!isCollapsed && <p className="text-sm font-medium">Settings</p>}
          </a>
          {isCollapsed && (
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1d2a25] border border-[#283933] text-white text-xs font-bold rounded-md shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-[100] whitespace-nowrap">
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-[#1d2a25] border-l border-b border-[#283933] rotate-45"></div>
              Settings
            </div>
          )}
        </div>

        <div className={`flex items-center gap-3 px-3 py-4 mt-2 overflow-hidden transition-all relative group ${isCollapsed ? 'justify-center' : ''}`} role="complementary" aria-label="User Profile">
          <div 
            className="flex-shrink-0 bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-[#283933]" 
            style={{ backgroundImage: 'url("https://picsum.photos/seed/alexmorgan/80/80")' }}
            role="img"
            aria-label="Profile picture of Alex Morgan"
          ></div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-300 whitespace-nowrap">
              <p className="text-white text-sm font-bold">Alex Morgan</p>
              <p className="text-[#9db9b0] text-xs">Sustainability Lead</p>
            </div>
          )}
          {isCollapsed && (
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1d2a25] border border-[#283933] text-white text-xs font-bold rounded-md shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-[100] whitespace-nowrap">
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-[#1d2a25] border-l border-b border-[#283933] rotate-45"></div>
              Alex Morgan (Sustain. Lead)
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
