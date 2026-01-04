
import React, { useState } from 'react';
import { BUSINESS_UNITS } from '../constants';
import Tooltip from './Tooltip';
import UploadModal from './UploadModal';

const PortfolioManager: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [units, setUnits] = useState(BUSINESS_UNITS);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'text-primary bg-primary/10 border-primary/20';
      case 'In Review': return 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20';
      case 'Action Required': return 'text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20';
      default: return 'text-[#9db9b0] bg-[#283933] border-[#344a42]';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1d2a25] border border-[#283933] p-6 rounded-xl">
        <div>
          <h3 className="text-white text-xl font-bold">Organizational Portfolio</h3>
          <p className="text-[#9db9b0] text-sm">Manage business units, subsidiaries, and functional entities.</p>
        </div>
        <div className="flex gap-3">
          <Tooltip content="Download standard data ingestion template">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#283933] text-white text-sm font-bold border border-[#344a42] hover:bg-[#344a42] transition-colors">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Get Template
            </button>
          </Tooltip>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-background-dark text-sm font-bold hover:bg-[#10d692] transition-colors shadow-lg shadow-primary/10"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
            Upload Portfolio Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {units.map((unit) => (
          <div key={unit.id} className="bg-[#1d2a25] border border-[#283933] p-5 rounded-xl hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="size-10 rounded-lg bg-[#283933] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">{unit.icon}</span>
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${getStatusColor(unit.status)}`}>
                {unit.status}
              </span>
            </div>
            <h4 className="text-white font-bold text-lg mb-1">{unit.name}</h4>
            <div className="flex items-center gap-2 text-[#9db9b0] text-xs mb-4">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {unit.region} • {unit.employees.toLocaleString()} FTE
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#283933]">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#5c736a] mb-1">ESG Score</p>
                <p className="text-white font-black text-xl">{unit.esgScore}<span className="text-primary text-xs ml-0.5">/100</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#5c736a] mb-1">Revenue Cont.</p>
                <p className="text-white font-black text-xl">{unit.revenueLink}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] uppercase font-bold text-[#5c736a] mb-2 flex justify-between items-center">
                <span>Carbon Intensity</span>
                <span className="text-white">{unit.emissions.toLocaleString()} tCO2e</span>
              </p>
              <div className="h-1.5 w-full bg-[#283933] rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(unit.emissions / 50000) * 100}%` }}></div>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="border-2 border-dashed border-[#283933] rounded-xl flex flex-col items-center justify-center p-8 text-[#5c736a] hover:border-primary/50 hover:text-primary transition-all group"
        >
          <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-125 transition-transform">add_circle</span>
          <p className="font-bold text-sm">Add Business Unit</p>
        </button>
      </div>

      {isUploadModalOpen && (
        <UploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
          onSuccess={(newData) => {
            console.log('Processed Data:', newData);
            setIsUploadModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default PortfolioManager;
