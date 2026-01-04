
import React, { useState, useEffect } from 'react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'upload' | 'processing' | 'success'>('upload');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing pipeline...');

  const startProcessing = () => {
    setStep('processing');
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setStep('success'), 800);
      }
      setProgress(currentProgress);
      
      if (currentProgress < 30) setStatusText('Validating data schema...');
      else if (currentProgress < 60) setStatusText('Parsing Business Unit hierarchies...');
      else if (currentProgress < 90) setStatusText('Calculating tCO2e intensity...');
      else setStatusText('Finalizing ISSB S1/S2 alignment...');
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-xl bg-[#1d2a25] border border-[#283933] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {step === 'upload' && (
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-white text-xl font-bold">Upload Portfolio Data</h3>
                <p className="text-[#9db9b0] text-sm">Import metrics for business units and subsidiaries.</p>
              </div>
              <button onClick={onClose} className="text-[#5c736a] hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div 
              className="border-2 border-dashed border-[#283933] hover:border-primary/50 bg-[#111816]/50 rounded-xl p-12 flex flex-col items-center justify-center transition-all group cursor-pointer"
              onClick={startProcessing}
            >
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl">cloud_upload</span>
              </div>
              <p className="text-white font-bold mb-1">Drag and drop file here</p>
              <p className="text-[#9db9b0] text-xs">Supports .csv, .xlsx (Max 50MB)</p>
            </div>

            <div className="mt-6 flex items-center gap-4 p-4 bg-[#111816]/30 rounded-lg border border-[#283933]">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="text-[11px] text-[#9db9b0]">
                Ensure your column headers match the <span className="text-white font-bold">ISSB S1 Core Reporting Framework</span> for automatic field mapping.
              </p>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-white font-bold text-sm hover:bg-[#283933] transition-colors">
                Cancel
              </button>
              <button onClick={startProcessing} className="px-6 py-2.5 rounded-lg bg-primary text-background-dark font-black text-sm hover:bg-[#10d692] transition-colors">
                Select File
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="relative size-24 mb-8">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#283933" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" fill="transparent" stroke="#13eca4" strokeWidth="8" 
                  strokeDasharray={`${2 * Math.PI * 45}`} 
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-white font-black text-xl">
                {Math.round(progress)}%
              </div>
            </div>
            <h4 className="text-white text-lg font-bold mb-2">Processing Data Stream</h4>
            <p className="text-primary text-sm font-mono">{statusText}</p>
            <div className="mt-8 w-full max-w-xs h-1.5 bg-[#283933] rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-pulse" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
            <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6 border border-primary/30">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h4 className="text-white text-2xl font-bold mb-2">Ingestion Complete</h4>
            <p className="text-[#9db9b0] text-sm mb-8">
              Successfully processed <span className="text-white font-bold">128 data points</span> across <span className="text-white font-bold">4 business units</span>. Alignment score updated.
            </p>
            <button 
              onClick={onClose}
              className="w-full max-w-xs px-6 py-3 rounded-xl bg-primary text-background-dark font-black hover:bg-[#10d692] transition-all shadow-xl shadow-primary/20"
            >
              Back to Portfolio
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default UploadModal;
