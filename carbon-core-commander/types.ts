
export interface EmissionData {
  month: string;
  scope1: number;
  scope2: number;
  scope3: number;
}

export interface KPIStats {
  totalEmissions: {
    value: string;
    unit: string;
    change: string;
    trend: 'up' | 'down';
  };
  carbonIntensity: {
    value: string;
    unit: string;
    change: string;
    trend: 'up' | 'down';
  };
  yoyReduction: {
    value: string;
    unit: string;
    status: string;
  };
  netZeroProgress: {
    percentage: number;
    targetYear: number;
  };
}

export interface CompanyRegistryEntry {
  id: string;
  name: string;
  region: string;
  year: string;
  kpi: KPIStats;
  history: EmissionData[];
  milestones: Milestone[];
}

export interface ScopeCategory {
  id: string;
  name: string;
  emissions: number;
  percentage: number;
  yoyChange: number;
  quality: 'High' | 'Medium' | 'Low';
  type: 'Upstream' | 'Downstream';
}

export interface DecarbonizationLever {
  id: string;
  name: string;
  status: string;
  statusType: 'Active' | 'Planning';
  currentReduction: number; // in tCO2e
  maxReduction: number; // theoretical limit
  progress: number;
  icon: string;
  color: string;
}

export interface CarbonCredit {
  id: string;
  projectName: string;
  type: 'Removal' | 'Avoidance';
  methodology: string;
  volume: number;
  costPerTon: number;
  vintage: string;
  standard: 'Verra' | 'Gold Standard' | 'Puro.earth';
  status: 'Retired' | 'Active' | 'Contracted';
}

export interface RiskEntry {
  id: string;
  category: 'Transition' | 'Physical';
  type: string;
  risk: string;
  impact: 'High' | 'Medium' | 'Low';
  probability: 'High' | 'Medium' | 'Low';
  mitigation: string;
  financialExposure: string;
}

export interface Milestone {
  year: number;
  title: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  description: string;
  standard: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  fullName: string;
  jurisdiction: string;
  readiness: number; // percentage
  status: 'Compliant' | 'At Risk' | 'In Progress';
  description: string;
  keyDisclosures: string[];
  regulator?: string;
}

export interface RegulatoryDeadline {
  id: string;
  framework: string;
  event: string;
  date: string;
  priority: 'Critical' | 'High' | 'Medium';
}
