
import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#283933]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#283933]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#283933]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#283933]',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={`absolute z-[100] w-max max-w-xs px-3 py-2 bg-[#1d2a25] border border-[#283933] text-white text-[11px] font-medium rounded shadow-2xl animate-in fade-in zoom-in-95 duration-150 pointer-events-none ${positionClasses[position]}`}
          role="tooltip"
        >
          {content}
          <div className={`absolute border-4 border-transparent ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
