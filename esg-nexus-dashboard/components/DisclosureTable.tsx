
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { DISCLOSURE_REQUIREMENTS } from '../constants';
import Tooltip from './Tooltip';

interface DisclosureTableProps {
  globalStandard: string;
  globalYear: string;
  globalScope: string;
}

const AccessibleFilter: React.FC<{
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  id: string;
}> = ({ label, options, value, onChange, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggle = () => setIsOpen(!isOpen);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const currentIndex = options.indexOf(value);
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % options.length;
        onChange(options[nextIndex]);
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + options.length) % options.length;
        onChange(options[nextIndex]);
        break;
      case 'Enter':
      case ' ':
      case 'Tab':
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        if (e.key !== 'Tab') e.preventDefault();
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 relative" ref={containerRef}>
      <label id={`${id}-label`} className="text-[10px] uppercase font-bold text-[#9db9b0] tracking-wider px-1">
        {label}
      </label>
      <button
        ref={buttonRef}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label ${id}`}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={`flex items-center justify-between bg-[#283933] border border-[#344a42] text-white text-xs rounded-lg px-3 py-2.5 w-full transition-all text-left focus:ring-2 focus:ring-primary focus:border-primary outline-none ${isOpen ? 'ring-2 ring-primary border-primary' : ''}`}
      >
        <span className="truncate">{value}</span>
        <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-labelledby={`${id}-label`}
          tabIndex={-1}
          className="absolute top-[68px] left-0 w-full bg-[#1d2a25] border border-[#344a42] rounded-lg shadow-2xl py-1 z-[60] max-h-60 overflow-y-auto scrollbar-hide animate-in fade-in zoom-in-95 duration-150"
        >
          {options.map((opt) => (
            <li
              key={opt}
              role="option"
              aria-selected={value === opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
                buttonRef.current?.focus();
              }}
              className={`px-3 py-2 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                value === opt ? 'bg-primary/20 text-primary font-bold' : 'text-[#9db9b0] hover:bg-[#283933] hover:text-white'
              }`}
            >
              {opt}
              {value === opt && <span className="material-symbols-outlined text-xs">check</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const DisclosureTable: React.FC<DisclosureTableProps> = ({ globalStandard, globalYear, globalScope }) => {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [standardFilter, setStandardFilter] = useState<string>(globalStandard);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [yearFilter, setYearFilter] = useState<string>(globalYear);
  const [scopeFilter, setScopeFilter] = useState<string>(globalScope);

  useEffect(() => {
    setStandardFilter(globalStandard);
    setYearFilter(globalYear);
    setScopeFilter(globalScope);
  }, [globalStandard, globalYear, globalScope]);

  const standards = ['All', 'IFRS S1/S2', 'EU CSRD', 'EU VSME', 'GRI', 'BRSR', 'TCFD'];
  const years = ['All', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];
  const scopes = ['All', 'Global', 'Asia', 'Oceania', 'Europe', 'United Kingdom', 'United States'];
  const statuses = ['All', 'Limited', 'Reasonable', 'Self-declared', 'Pending'];

  const filteredDisclosures = useMemo(() => {
    return DISCLOSURE_REQUIREMENTS.filter((item) => {
      const standardMatch = standardFilter === 'All' || item.standard === standardFilter;
      const statusMatch = statusFilter === 'All' || item.status === statusFilter;
      const yearMatch = yearFilter === 'All' || item.year === yearFilter;
      const scopeMatch = scopeFilter === 'All' || item.scope === scopeFilter;
      return standardMatch && statusMatch && yearMatch && scopeMatch;
    });
  }, [standardFilter, statusFilter, yearFilter, scopeFilter]);

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearWatchlist = () => setWatchlist(new Set());

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredDisclosures.length && filteredDisclosures.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDisclosures.map(d => d.id)));
    }
  };

  const bulkAddToWatchlist = () => {
    setWatchlist(prev => {
      const next = new Set(prev);
      selectedIds.forEach(id => next.add(id));
      return next;
    });
    setSelectedIds(new Set());
  };

  const bulkExport = () => {
    alert(`Exporting ${selectedIds.size} disclosure records to CSV...`);
    setSelectedIds(new Set());
  };

  const resetFilters = () => {
    setStandardFilter('All');
    setStatusFilter('All');
    setYearFilter('All');
    setScopeFilter('All');
    setSelectedIds(new Set());
  };

  const isFiltered = standardFilter !== 'All' || statusFilter !== 'All' || yearFilter !== 'All' || scopeFilter !== 'All';
  const allSelected = filteredDisclosures.length > 0 && selectedIds.size === filteredDisclosures.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < filteredDisclosures.length;

  return (
    <div className="xl:col-span-3 rounded-xl bg-[#1d2a25] border border-[#283933] overflow-hidden flex flex-col min-h-[600px] relative transition-all duration-500">
      
      {/* Selection Toolbar */}
      {selectedIds.size > 0 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-primary px-6 py-2 rounded-full shadow-2xl flex items-center gap-6 border border-white/20">
            <div className="flex items-center gap-2 text-background-dark font-black text-sm">
              <span>{selectedIds.size} selected</span>
            </div>
            <div className="h-4 w-[1px] bg-background-dark/20"></div>
            <div className="flex gap-4">
              <Tooltip content="Add selected to your personal watchlist">
                <button onClick={bulkAddToWatchlist} className="flex items-center gap-1.5 text-background-dark text-xs font-bold hover:opacity-80">
                  <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                  Watchlist
                </button>
              </Tooltip>
              <Tooltip content="Export selected rows to CSV format">
                <button onClick={bulkExport} className="flex items-center gap-1.5 text-background-dark text-xs font-bold hover:opacity-80">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export CSV
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between p-5 border-b border-[#283933] gap-4">
        <div className="flex items-center gap-4">
          <h3 id="disclosure-heading" className="text-white text-lg font-bold">Disclosure Inventory</h3>
          {watchlist.size > 0 && (
            <Tooltip content="Clear all bookmarks from watchlist">
              <button onClick={clearWatchlist} className="text-[#9db9b0] text-[10px] hover:text-white underline decoration-dotted">Clear Watchlist</button>
            </Tooltip>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content="Download the full visible inventory">
            <button className="text-primary text-xs bg-primary/10 px-3 py-1.5 rounded border border-primary/20">Export List</button>
          </Tooltip>
        </div>
      </div>

      {/* Filter Matrix */}
      <div className="bg-[#111816]/50 p-4 border-b border-[#283933] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <AccessibleFilter id="std-filter" label="Standard" options={standards} value={standardFilter} onChange={setStandardFilter} />
        <AccessibleFilter id="year-filter" label="Year" options={years} value={yearFilter} onChange={setYearFilter} />
        <AccessibleFilter id="scope-filter" label="Scope" options={scopes} value={scopeFilter} onChange={setScopeFilter} />
        <AccessibleFilter id="stat-filter" label="Assurance" options={statuses} value={statusFilter} onChange={setStatusFilter} />
        <Tooltip content="Clear all active table filters">
          <button onClick={resetFilters} disabled={!isFiltered} className={`h-[40px] w-full text-xs font-bold rounded-lg transition-all ${isFiltered ? 'bg-[#344a42] text-white' : 'bg-transparent text-[#5c736a] border border-[#283933]'}`}>
            Reset Table
          </button>
        </Tooltip>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto scrollbar-hide flex-1">
        {filteredDisclosures.length > 0 ? (
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-[#111816]">
                <th className="p-4 w-12 text-center">
                  <Tooltip content="Select all matching rows">
                    <button onClick={handleSelectAll} className="size-5 rounded border border-[#283933] flex items-center justify-center">
                      {allSelected && <span className="material-symbols-outlined text-primary text-[16px]">check</span>}
                    </button>
                  </Tooltip>
                </th>
                <th className="p-4 w-12 text-center text-[10px] font-bold text-[#9db9b0] uppercase tracking-wider">
                  <Tooltip content="Pin items for quick access">Mark</Tooltip>
                </th>
                <th className="p-4 text-[10px] font-bold text-[#9db9b0] uppercase tracking-wider">Metric / Topic</th>
                <th className="p-4 text-[10px] font-bold text-[#9db9b0] uppercase tracking-wider">Standard</th>
                <th className="p-4 text-[10px] font-bold text-[#9db9b0] uppercase tracking-wider text-center">
                   <Tooltip content="Level of independent verification (Limited/Reasonable)">Assurance</Tooltip>
                </th>
                <th className="p-4 text-[10px] font-bold text-[#9db9b0] uppercase tracking-wider">
                  <Tooltip content="Percentage of required data points captured">Completeness</Tooltip>
                </th>
                <th className="p-4 text-[10px] font-bold text-[#9db9b0] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#283933]">
              {filteredDisclosures.map((row) => {
                const isMarked = watchlist.has(row.id);
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr key={row.id} className={`group ${isSelected ? 'bg-primary/5' : 'hover:bg-[#283933]/40'}`}>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleSelection(row.id)} className={`size-5 rounded border ${isSelected ? 'bg-primary border-primary' : 'border-[#283933]'} flex items-center justify-center`}>
                        {isSelected && <span className="material-symbols-outlined text-background-dark text-[16px]">check</span>}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleWatchlist(row.id)} className={isMarked ? 'text-primary' : 'text-[#5c736a] group-hover:text-primary'}>
                        <span className="material-symbols-outlined">{isMarked ? 'bookmark' : 'bookmark_border'}</span>
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{row.metric}</span>
                        <span className="text-[10px] text-[#9db9b0]">{row.subMetric} ({row.scope})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] px-2 py-0.5 rounded border border-primary/20 text-primary uppercase font-bold">{row.standard}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[11px] font-bold ${row.status === 'Reasonable' ? 'text-primary' : 'text-[#9db9b0]'}`}>{row.assurance}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-[#283933] rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${row.completeness}%` }} />
                        </div>
                        <span className="text-white font-mono text-[11px]">{row.completeness}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Tooltip content="Open detailed data entry form" position="left">
                        <button className="text-[#5c736a] hover:text-white"><span className="material-symbols-outlined">edit_note</span></button>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-24 text-center">
            <h4 className="text-white text-xl font-bold mb-2">No matching records found</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisclosureTable;
