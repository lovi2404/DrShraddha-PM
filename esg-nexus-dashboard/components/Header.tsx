
import React from 'react';
import Tooltip from './Tooltip';

interface HeaderProps {
  activeStandard: string;
  activeYear: string;
  activeScope: string;
  isUpdating?: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeStandard, activeYear, activeScope, isUpdating }) => {
  return (
    <header className="flex items-center justify-between border-b border-[#283933] px-6 py-4 bg-background-dark z-20 transition-all duration-300">
      <div className="flex items-center gap-4 lg:hidden">
        <button className="text-white focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1" aria-label="Open Navigation Menu">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-white text-lg font-bold">ESG Nexus</h2>
      </div>

      <div className={`hidden lg:flex flex-col transition-all duration-500 ${isUpdating ? 'translate-y-1 opacity-50' : 'translate-y-0 opacity-100'}`}>
        <h2 className="text-white text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-primary">{activeStandard}</span> Compliance Overview
        </h2>
        <p className="text-[#9db9b0] text-xs font-medium">
          Monitoring <span className="text-white">{activeScope}</span> alignment for the <span className="text-white">{activeYear}</span> reporting cycle
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center h-10 rounded-lg bg-[#283933] px-3 min-w-[300px]">
          <label htmlFor="top-search" className="sr-only">Search standards or disclosures</label>
          <span className="material-symbols-outlined text-[#9db9b0]" aria-hidden="true">search</span>
          <input
            id="top-search"
            className="bg-transparent border-none text-white text-sm ml-2 w-full focus:ring-0 placeholder-[#9db9b0]"
            placeholder={`Search ${activeStandard} disclosures...`}
            type="text"
          />
        </div>
        <div className="flex gap-2">
          <Tooltip content="Review latest alerts and data updates">
            <button 
              className="flex items-center justify-center size-10 rounded-lg bg-[#283933] text-white hover:bg-[#344a42] transition-colors relative focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="View 3 New Notifications"
            >
              <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border border-[#283933]"></span>
            </button>
          </Tooltip>
          
          <Tooltip content="Access documentation and guidelines">
            <button 
              className="flex items-center justify-center size-10 rounded-lg bg-[#283933] text-white hover:bg-[#344a42] transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Help and Documentation"
            >
              <span className="material-symbols-outlined" aria-hidden="true">help</span>
            </button>
          </Tooltip>

          <Tooltip content={`Generate ${activeYear} compliance report`}>
            <button 
              className="hidden md:flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-background-dark font-bold text-sm hover:bg-[#10d692] transition-colors focus-visible:ring-2 focus-visible:ring-background-dark"
              aria-label="Export Dashboard as PDF"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">print</span>
              <span>Export PDF</span>
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default Header;
