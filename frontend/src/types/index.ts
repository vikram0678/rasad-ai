export interface Depot {
  id: string;
  name: string;
  code: string;
  type: string;
  lat: number;
  lng: number;
  altitude: string;
  commander: string;
  capacityTotal: string;
  capacityUsed: string;
  fuelReserve: string;
  activeConvoys: number;
  status: string;
  weather: {
    temp: string;
    condition: string;
    wind: string;
  };
}

export interface SupplyItem {
  current: number;
  capacity: number;
  unit: string;
  dailyBurn: number;
  safeThreshold: number;
}

export interface Outpost {
  id: string;
  name: string;
  sector: string;
  code: string;
  lat: number;
  lng: number;
  altitude: string;
  troops: number;
  daysOfSupply: number;
  status: 'CRITICAL' | 'WARNING' | 'OPTIMAL' | 'NORMAL';
  weather: {
    temp: string;
    condition: string;
    wind: string;
    blizzardRisk?: string;
  };
  supplies: {
    class1_rations: SupplyItem;
    class3_pol: SupplyItem;
    class5_ammo: SupplyItem;
    class8_medical: SupplyItem;
  };
  threatLevel: string;
  connectedDepot: string;
  lastResupply: string;
}

export interface Convoy {
  id: string;
  name: string;
  origin: string;
  target: string;
  lat: number;
  lng: number;
  vehicles: string;
  cargo: string;
  progressPct: number;
  status: string;
  eta: string;
  tempSensor: string;
  vibration: string;
}

export interface ChokePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  hazardType: string;
  severity: string;
  description: string;
  bypassRouteAvailable: boolean;
}

export interface PredictiveInsight {
  id: string;
  type: string;
  title: string;
  badge: string;
  badgeClass: string;
  description: string;
  impactMetric: string;
  recommendation: string;
  actionText: string;
  confidence: string;
}

export interface CopilotKnowledge {
  query: string;
  response: string;
  source: string;
  relevance: string;
}

export interface GuardrailStage {
  id: string;
  name: string;
  check: string;
  detail: string;
  status: string;
}

export interface CargoScanData {
  convoyId: string;
  vehicleReg: string;
  opticalConfidenceOverall: string;
  weightSensorMismatch: string;
  inspectionStatus: string;
}

export type OfficerRole = 'BRIGADIER' | 'CAPTAIN' | 'SUBEDAR';

export interface MilitaryOfficer {
  id: OfficerRole;
  rank: string;
  name: string;
  roleTitle: string;
  unit: string;
  hq: string;
  clearanceLevel: string;
  permissions: {
    canTriggerDefcon: boolean;
    canAuthorizeAirBridge: boolean;
    canAuthorizeConvoys: boolean;
    canOverrideGuardrails: boolean;
    canVerifyCargoOnly: boolean;
  };
}
