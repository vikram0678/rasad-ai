export interface IplmsSupplyNode {
  id: string;
  name: string;
  role: 'base' | 'depot' | 'post';
  stockPercent: number;
  status: 'ok' | 'low' | 'critical' | 'normal';
  lat: number;
  lng: number;
  // Canvas relative coordinates (0-100%) for tactical satellite overlay view
  x: number;
  y: number;
  sector: string;
  elevationM: number;
}

export interface IplmsRoute {
  id: string;
  fromId: string;
  toId: string;
  name: string;
  status: 'open' | 'caution' | 'blocked';
  hazard?: 'Landslide' | 'Heavy Snow' | 'Flood Risk' | 'Adverse Weather';
  hazardLabel?: string;
  distanceKm: number;
  terrainDifficulty: 'Moderate' | 'High' | 'Extreme';
}

export interface IplmsIncident {
  id: string;
  num: number;
  locationId: string;
  locationName: string;
  issue: string;
  supplyClass: string;
  predictedTime: string;
  priority: 'CRITICAL' | 'HIGH' | 'WARNING';
  stockPercent: number;
  currentUnits: number;
  unitLabel: string;
  predictedDepletion: string;
  personnelStrength: number;
  personnelDelta: string;
  recentConsumption: string;
  lastUpdated: string;
  recommendedPlan: {
    source: string;
    route: string;
    transport: string;
    eta: string;
    confidence: number;
    approved: boolean;
    reason: string;
  };
}

export interface IplmsFleetItem {
  id: string;
  name: string;
  icon: 'truck' | 'atv' | 'drone' | 'helicopter';
  available: number;
  total: number;
  status: 'Available' | 'Limited' | 'Grounded';
}

export interface IplmsDispatch {
  id: number;
  code: string;
  from: string;
  to: string;
  status: 'En Route' | 'Preparing' | 'On Hold';
  eta: string;
  payload: string;
}

export interface IplmsStockBar {
  name: string;
  shortName: string;
  percent: number;
  type: 'base' | 'depot' | 'post';
}

// 28 Locations across Greater Ladakh & Northern Theatre
export const IPLMS_NODES: IplmsSupplyNode[] = [
  // 4 Main Base Hubs
  { id: 'base-leh', name: 'Base Leh', role: 'base', stockPercent: 65, status: 'normal', lat: 34.1526, lng: 77.5771, x: 42, y: 28, sector: '14 Corps HQ', elevationM: 3524 },
  { id: 'base-srinagar', name: 'Base Srinagar', role: 'base', stockPercent: 78, status: 'normal', lat: 34.0837, lng: 74.7973, x: 26, y: 55, sector: '15 Corps Forward', elevationM: 1585 },
  { id: 'base-manali', name: 'Base Manali', role: 'base', stockPercent: 70, status: 'normal', lat: 32.2396, lng: 77.1887, x: 35, y: 58, sector: 'Himachal Supply Corridor', elevationM: 2050 },
  { id: 'base-jammu', name: 'Base Jammu', role: 'base', stockPercent: 82, status: 'normal', lat: 32.7266, lng: 74.8570, x: 25, y: 62, sector: 'Northern Command Transit', elevationM: 327 },

  // 3 Intermediate Depots
  { id: 'depot-kargil', name: 'Kargil Depot', role: 'depot', stockPercent: 60, status: 'normal', lat: 34.5539, lng: 76.1349, x: 33, y: 33, sector: '8 Mtn Div Sub-Depot', elevationM: 2676 },
  { id: 'depot-dras', name: 'Dras Depot', role: 'depot', stockPercent: 48, status: 'low', lat: 34.4294, lng: 75.7621, x: 39, y: 40, sector: 'Dras High-Altitude Axis', elevationM: 3280 },
  { id: 'depot-zoji', name: 'Zoji Depot', role: 'depot', stockPercent: 75, status: 'normal', lat: 34.2800, lng: 75.4700, x: 33, y: 51, sector: 'Zojila Pass Access Hub', elevationM: 3528 },

  // Forward Outposts
  { id: 'post-alpha', name: 'Post Alpha', role: 'post', stockPercent: 72, status: 'ok', lat: 34.3500, lng: 78.1000, x: 53, y: 37, sector: 'Pangong North Sector', elevationM: 4350 },
  { id: 'post-bravo', name: 'Post Bravo', role: 'post', stockPercent: 55, status: 'low', lat: 34.2500, lng: 77.9500, x: 50, y: 44, sector: 'Chushul Border Ridge', elevationM: 4360 },
  { id: 'post-charlie', name: 'Post Charlie', role: 'post', stockPercent: 30, status: 'critical', lat: 34.0200, lng: 77.4000, x: 47, y: 51, sector: 'Depsang Sub-Sector South', elevationM: 4800 },
  { id: 'post-delta', name: 'Post Delta', role: 'post', stockPercent: 42, status: 'critical', lat: 33.8500, lng: 77.7500, x: 54, y: 59, sector: 'Fukche Airhead Sector', elevationM: 4200 },
  { id: 'post-echo', name: 'Post Echo', role: 'post', stockPercent: 68, status: 'ok', lat: 33.6000, lng: 76.9000, x: 43, y: 67, sector: 'Nyoma Forward Base', elevationM: 4180 },
  { id: 'post-foxtrot', name: 'Post Foxtrot', role: 'post', stockPercent: 40, status: 'low', lat: 33.7200, lng: 77.2000, x: 49, y: 65, sector: 'Hanle Border Post', elevationM: 4500 },
  { id: 'post-golf', name: 'Post Golf', role: 'post', stockPercent: 46, status: 'low', lat: 34.8000, lng: 77.3000, x: 45, y: 18, sector: 'Siachen Base Flank', elevationM: 3950 }
];

// Tactical Supply Corridors & Routes
export const IPLMS_ROUTES: IplmsRoute[] = [
  { id: 'route-srinagar-kargil', fromId: 'base-srinagar', toId: 'depot-kargil', name: 'NH-1D Srinagar-Kargil', status: 'open', distanceKm: 204, terrainDifficulty: 'Moderate' },
  { id: 'route-kargil-leh', fromId: 'depot-kargil', toId: 'base-leh', name: 'NH-1D Kargil-Leh', status: 'blocked', hazard: 'Landslide', hazardLabel: 'Route Blocked Landslide', distanceKm: 216, terrainDifficulty: 'Extreme' },
  { id: 'route-kargil-dras', fromId: 'depot-kargil', toId: 'depot-dras', name: 'Kargil-Dras Highway', status: 'open', distanceKm: 58, terrainDifficulty: 'Moderate' },
  { id: 'route-jammu-srinagar', fromId: 'base-jammu', toId: 'base-srinagar', name: 'NH-44 Banihal Axis', status: 'open', distanceKm: 260, terrainDifficulty: 'Moderate' },
  { id: 'route-manali-zoji', fromId: 'base-manali', toId: 'depot-zoji', name: 'Manali-Zojila Strategic Link', status: 'open', distanceKm: 310, terrainDifficulty: 'High' },
  { id: 'route-zoji-dras', fromId: 'depot-zoji', toId: 'depot-dras', name: 'Zoji-Dras Pass Corridor', status: 'open', distanceKm: 42, terrainDifficulty: 'High' },
  { id: 'route-leh-alpha', fromId: 'base-leh', toId: 'post-alpha', name: 'Chang La Strategic Route', status: 'open', distanceKm: 135, terrainDifficulty: 'High' },
  { id: 'route-alpha-bravo', fromId: 'post-alpha', toId: 'post-bravo', name: 'Pangong Lateral', status: 'open', distanceKm: 65, terrainDifficulty: 'Moderate' },
  { id: 'route-dras-bravo', fromId: 'depot-dras', toId: 'post-bravo', name: 'Dras-Chushul High Track', status: 'caution', hazard: 'Heavy Snow', hazardLabel: 'Heavy Snow / Slush', distanceKm: 180, terrainDifficulty: 'Extreme' },
  { id: 'route-dras-charlie', fromId: 'depot-dras', toId: 'post-charlie', name: 'Dras-Charlie Southern Loop', status: 'open', distanceKm: 125, terrainDifficulty: 'High' },
  { id: 'route-charlie-delta', fromId: 'post-charlie', toId: 'post-delta', name: 'Southern Valley Traverse', status: 'blocked', hazard: 'Landslide', hazardLabel: 'Boulder Fall Km 82', distanceKm: 94, terrainDifficulty: 'Extreme' },
  { id: 'route-bravo-delta', fromId: 'post-bravo', toId: 'post-delta', name: 'Chushul-Delta Ridge Axis', status: 'caution', hazard: 'Adverse Weather', hazardLabel: 'High Wind / Low Vis', distanceKm: 110, terrainDifficulty: 'High' },
  { id: 'route-charlie-foxtrot', fromId: 'post-charlie', toId: 'post-foxtrot', name: 'Charlie-Foxtrot Pass', status: 'caution', distanceKm: 76, terrainDifficulty: 'High' },
  { id: 'route-foxtrot-echo', fromId: 'post-foxtrot', toId: 'post-echo', name: 'Hanle-Nyoma Highway', status: 'open', distanceKm: 85, terrainDifficulty: 'Moderate' },
  { id: 'route-manali-echo', fromId: 'base-manali', toId: 'post-echo', name: 'Manali-Nyoma Direct Spur', status: 'open', distanceKm: 290, terrainDifficulty: 'High' }
];

// Active Logistics Incidents with Ranked Multi-Problem Engine
export const IPLMS_INCIDENTS: IplmsIncident[] = [
  {
    id: 'inc-01',
    num: 1,
    locationId: 'post-charlie',
    locationName: 'Post Charlie',
    issue: 'Class V - Ammunition',
    supplyClass: 'Class V - Ammunition',
    predictedTime: '18 hours',
    priority: 'CRITICAL',
    stockPercent: 30,
    currentUnits: 450,
    unitLabel: 'rounds / belts',
    predictedDepletion: '18 hours',
    personnelStrength: 600,
    personnelDelta: '↑ +25%',
    recentConsumption: '+40% (last 7 days)',
    lastUpdated: '10:42',
    recommendedPlan: {
      source: 'Base Manali (Nearest with stock)',
      route: 'Manali → Zoji → Dras → Charlie',
      transport: '6x6 Trucks (x4)',
      eta: '14 hours',
      confidence: 92,
      approved: false,
      reason: 'Primary Leh route blocked by landslide; Manali axis clear with 92% pass confidence.'
    }
  },
  {
    id: 'inc-02',
    num: 2,
    locationId: 'post-delta',
    locationName: 'Post Delta',
    issue: 'Class III - POL (Fuel)',
    supplyClass: 'Class III - POL (Fuel)',
    predictedTime: '24 hours',
    priority: 'CRITICAL',
    stockPercent: 28,
    currentUnits: 1200,
    unitLabel: 'Liters Kerosene',
    predictedDepletion: '24 hours',
    personnelStrength: 450,
    personnelDelta: '↑ +15%',
    recentConsumption: '+35% (winter freeze)',
    lastUpdated: '10:38',
    recommendedPlan: {
      source: 'Base Jammu via Dras',
      route: 'Jammu → Srinagar → Dras → Delta',
      transport: 'Heavy Bowsers (x3)',
      eta: '19 hours',
      confidence: 88,
      approved: false,
      reason: 'Charlie-Delta direct link blocked; rerouting via southern Dras corridor.'
    }
  },
  {
    id: 'inc-03',
    num: 3,
    locationId: 'depot-kargil',
    locationName: 'Kargil Depot',
    issue: 'Route Blocked',
    supplyClass: 'Infrastructure / Corridor',
    predictedTime: 'Immediate',
    priority: 'CRITICAL',
    stockPercent: 60,
    currentUnits: 8400,
    unitLabel: 'metric tons stores',
    predictedDepletion: 'N/A (Corridor blockage)',
    personnelStrength: 320,
    personnelDelta: '0%',
    recentConsumption: 'Stalled transit',
    lastUpdated: '10:15',
    recommendedPlan: {
      source: 'BRO Sector Himank Taskforce',
      route: 'Km 114 Landslide clearing axis',
      transport: 'Heavy Earthmover + 2 Dozers',
      eta: '06 hours',
      confidence: 95,
      approved: true,
      reason: 'Clearing debris on Kargil-Leh axis; detour via Dras Southern Loop active.'
    }
  },
  {
    id: 'inc-04',
    num: 4,
    locationId: 'post-bravo',
    locationName: 'Post Bravo',
    issue: 'Class I - Rations',
    supplyClass: 'Class I - Rations',
    predictedTime: '3 days',
    priority: 'HIGH',
    stockPercent: 55,
    currentUnits: 2100,
    unitLabel: 'man-day rations',
    predictedDepletion: '72 hours',
    personnelStrength: 380,
    personnelDelta: '+5%',
    recentConsumption: '+12%',
    lastUpdated: '09:50',
    recommendedPlan: {
      source: 'Base Leh (Airbridge ready)',
      route: 'Leh → Chang La → Bravo',
      transport: '4x4 Medium Trucks (x2)',
      eta: '11 hours',
      confidence: 90,
      approved: false,
      reason: 'Routine replenishment before high pass blizzard window shuts.'
    }
  },
  {
    id: 'inc-05',
    num: 5,
    locationId: 'post-foxtrot',
    locationName: 'Post Foxtrot',
    issue: 'Medical Supplies',
    supplyClass: 'Medical / Class VIII',
    predictedTime: '4 days',
    priority: 'HIGH',
    stockPercent: 40,
    currentUnits: 340,
    unitLabel: 'trauma kits & IV fluids',
    predictedDepletion: '96 hours',
    personnelStrength: 290,
    personnelDelta: '+10%',
    recentConsumption: '+28% (frostbite treatment)',
    lastUpdated: '09:22',
    recommendedPlan: {
      source: 'Base Leh Medical Depot',
      route: 'Leh → Nyoma → Foxtrot',
      transport: 'Logistics UAV / Air-drop',
      eta: '04 hours',
      confidence: 96,
      approved: false,
      reason: 'High altitude medical critical kits scheduled via autonomous UAV corridor.'
    }
  },
  {
    id: 'inc-06',
    num: 6,
    locationId: 'depot-dras',
    locationName: 'Dras Depot',
    issue: 'Low Stock (Fuel)',
    supplyClass: 'Class III - POL (Fuel)',
    predictedTime: '2 days',
    priority: 'HIGH',
    stockPercent: 48,
    currentUnits: 8900,
    unitLabel: 'Liters High-Octane',
    predictedDepletion: '48 hours',
    personnelStrength: 410,
    personnelDelta: '+8%',
    recentConsumption: '+22%',
    lastUpdated: '08:45',
    recommendedPlan: {
      source: 'Base Srinagar',
      route: 'Srinagar → Zojila → Dras',
      transport: 'Dedicated Tanker Convoy',
      eta: '10 hours',
      confidence: 91,
      approved: false,
      reason: 'Replenishing buffer before temperature drops to -25°C.'
    }
  },
  {
    id: 'inc-07',
    num: 7,
    locationId: 'post-golf',
    locationName: 'Post Golf',
    issue: 'Winter Supplies',
    supplyClass: 'Class II - Clothing & ECC',
    predictedTime: '5 days',
    priority: 'WARNING',
    stockPercent: 46,
    currentUnits: 180,
    unitLabel: 'extreme cold sets',
    predictedDepletion: '120 hours',
    personnelStrength: 210,
    personnelDelta: '0%',
    recentConsumption: 'Normal seasonal',
    lastUpdated: '08:10',
    recommendedPlan: {
      source: 'Base Leh Logistics Hub',
      route: 'Leh → Khardung La → Golf',
      transport: 'Stallion 4x4 (x1)',
      eta: '16 hours',
      confidence: 89,
      approved: false,
      reason: 'Scheduled rotational replenishment for high-altitude bivouac.'
    }
  },
  {
    id: 'inc-08',
    num: 8,
    locationId: 'base-leh',
    locationName: 'Base Leh',
    issue: 'Vehicle Maintenance',
    supplyClass: 'Class IX - Repair Spares',
    predictedTime: '-',
    priority: 'WARNING',
    stockPercent: 65,
    currentUnits: 42,
    unitLabel: 'spare assemblies',
    predictedDepletion: 'Indefinite buffer',
    personnelStrength: 1850,
    personnelDelta: '0%',
    recentConsumption: '+15% overhaul',
    lastUpdated: '07:30',
    recommendedPlan: {
      source: 'Northern Command Workshop Jammu',
      route: 'Jammu → Leh via Air C-17',
      transport: 'IAF Globemaster Sortie',
      eta: '08 hours',
      confidence: 98,
      approved: false,
      reason: 'Heavy clutch and axle components replenishment.'
    }
  }
];

// Fleet Availability
export const IPLMS_FLEET: IplmsFleetItem[] = [
  { id: 'fl-1', name: '6x6 Tactical Trucks', icon: 'truck', available: 45, total: 60, status: 'Available' },
  { id: 'fl-2', name: 'All Terrain Vehicles (ATV)', icon: 'atv', available: 28, total: 40, status: 'Available' },
  { id: 'fl-3', name: 'Logistics Drones (UAV)', icon: 'drone', available: 15, total: 20, status: 'Available' },
  { id: 'fl-4', name: 'Helicopter (Heavy Lift)', icon: 'helicopter', available: 6, total: 10, status: 'Limited' }
];

// Ongoing Dispatches
export const IPLMS_DISPATCHES: IplmsDispatch[] = [
  { id: 1, code: 'DSP-091', from: 'B-Manali', to: 'Post Echo', status: 'En Route', eta: 'ETA 6h', payload: 'POL Fuel 8,000L' },
  { id: 2, code: 'DSP-092', from: 'B-Jammu', to: 'Dras Depot', status: 'En Route', eta: 'ETA 8h', payload: 'Class V Ammunition' },
  { id: 3, code: 'DSP-093', from: 'B-Leh', to: 'Post Bravo', status: 'Preparing', eta: 'ETA 12h', payload: 'Class I Fresh Rations' },
  { id: 4, code: 'DSP-094', from: 'B-Srinagar', to: 'Kargil', status: 'On Hold', eta: '-', payload: 'Class IX Spares (Landslide hold)' }
];

// Inventory status across supply classes for bottom-left bar chart
export const IPLMS_INVENTORY_BY_CLASS: Record<string, IplmsStockBar[]> = {
  rations: [
    { name: 'Base Jammu', shortName: 'Base Jammu', percent: 82, type: 'base' },
    { name: 'Base Srinagar', shortName: 'Base Srinagar', percent: 78, type: 'base' },
    { name: 'Base Leh', shortName: 'Base Leh', percent: 65, type: 'base' },
    { name: 'Base Manali', shortName: 'Base Manali', percent: 70, type: 'base' },
    { name: 'Kargil Depot', shortName: 'Kargil Depot', percent: 60, type: 'depot' },
    { name: 'Dras Depot', shortName: 'Dras Depot', percent: 48, type: 'depot' },
    { name: 'Zoji Depot', shortName: 'Zoji Depot', percent: 75, type: 'depot' },
    { name: 'Post Charlie', shortName: 'Post Charlie', percent: 30, type: 'post' },
    { name: 'Post Delta', shortName: 'Post Delta', percent: 42, type: 'post' },
    { name: 'Post Bravo', shortName: 'Post Bravo', percent: 55, type: 'post' },
    { name: 'Post Echo', shortName: 'Post Echo', percent: 68, type: 'post' },
    { name: 'Post Foxtrot', shortName: 'Post Foxtrot', percent: 40, type: 'post' }
  ],
  fuel: [
    { name: 'Base Jammu', shortName: 'Base Jammu', percent: 85, type: 'base' },
    { name: 'Base Srinagar', shortName: 'Base Srinagar', percent: 72, type: 'base' },
    { name: 'Base Leh', shortName: 'Base Leh', percent: 58, type: 'base' },
    { name: 'Base Manali', shortName: 'Base Manali', percent: 80, type: 'base' },
    { name: 'Kargil Depot', shortName: 'Kargil Depot', percent: 52, type: 'depot' },
    { name: 'Dras Depot', shortName: 'Dras Depot', percent: 34, type: 'depot' },
    { name: 'Zoji Depot', shortName: 'Zoji Depot', percent: 68, type: 'depot' },
    { name: 'Post Charlie', shortName: 'Post Charlie', percent: 35, type: 'post' },
    { name: 'Post Delta', shortName: 'Post Delta', percent: 24, type: 'post' },
    { name: 'Post Bravo', shortName: 'Post Bravo', percent: 60, type: 'post' },
    { name: 'Post Echo', shortName: 'Post Echo', percent: 74, type: 'post' },
    { name: 'Post Foxtrot', shortName: 'Post Foxtrot', percent: 38, type: 'post' }
  ],
  ammunition: [
    { name: 'Base Jammu', shortName: 'Base Jammu', percent: 90, type: 'base' },
    { name: 'Base Srinagar', shortName: 'Base Srinagar', percent: 84, type: 'base' },
    { name: 'Base Leh', shortName: 'Base Leh', percent: 72, type: 'base' },
    { name: 'Base Manali', shortName: 'Base Manali', percent: 88, type: 'base' },
    { name: 'Kargil Depot', shortName: 'Kargil Depot', percent: 66, type: 'depot' },
    { name: 'Dras Depot', shortName: 'Dras Depot', percent: 58, type: 'depot' },
    { name: 'Zoji Depot', shortName: 'Zoji Depot', percent: 80, type: 'depot' },
    { name: 'Post Charlie', shortName: 'Post Charlie', percent: 22, type: 'post' },
    { name: 'Post Delta', shortName: 'Post Delta', percent: 50, type: 'post' },
    { name: 'Post Bravo', shortName: 'Post Bravo', percent: 70, type: 'post' },
    { name: 'Post Echo', shortName: 'Post Echo', percent: 62, type: 'post' },
    { name: 'Post Foxtrot', shortName: 'Post Foxtrot', percent: 45, type: 'post' }
  ],
  medical: [
    { name: 'Base Jammu', shortName: 'Base Jammu', percent: 94, type: 'base' },
    { name: 'Base Srinagar', shortName: 'Base Srinagar', percent: 90, type: 'base' },
    { name: 'Base Leh', shortName: 'Base Leh', percent: 76, type: 'base' },
    { name: 'Base Manali', shortName: 'Base Manali', percent: 82, type: 'base' },
    { name: 'Kargil Depot', shortName: 'Kargil Depot', percent: 70, type: 'depot' },
    { name: 'Dras Depot', shortName: 'Dras Depot', percent: 62, type: 'depot' },
    { name: 'Zoji Depot', shortName: 'Zoji Depot', percent: 84, type: 'depot' },
    { name: 'Post Charlie', shortName: 'Post Charlie', percent: 48, type: 'post' },
    { name: 'Post Delta', shortName: 'Post Delta', percent: 55, type: 'post' },
    { name: 'Post Bravo', shortName: 'Post Bravo', percent: 65, type: 'post' },
    { name: 'Post Echo', shortName: 'Post Echo', percent: 78, type: 'post' },
    { name: 'Post Foxtrot', shortName: 'Post Foxtrot', percent: 36, type: 'post' }
  ]
};

// 7-Day Demand Forecast Series for Bottom-Mid Graph
export interface DemandForecastSeries {
  locationId: string;
  supplyClass: string;
  labels: string[];
  forecastDemand: number[];
  currentStock: number[];
  reorderLevel: number;
  stockoutDayIndex: number;
  stockoutText: string;
}

export const IPLMS_DEMAND_FORECASTS: Record<string, DemandForecastSeries> = {
  'post-charlie_ammunition': {
    locationId: 'post-charlie',
    supplyClass: 'Class V - Ammunition',
    labels: ['04 Oct', '05 Oct', '06 Oct', '07 Oct', '08 Oct', '09 Oct', '10 Oct'],
    forecastDemand: [160, 220, 310, 480, 610, 720, 830],
    currentStock: [760, 620, 480, 310, 190, 80, 20],
    reorderLevel: 250,
    stockoutDayIndex: 3, // Crossover at 07 Oct
    stockoutText: 'Stockout Risk < 24 hours'
  },
  'post-delta_fuel': {
    locationId: 'post-delta',
    supplyClass: 'Class III - POL (Fuel)',
    labels: ['04 Oct', '05 Oct', '06 Oct', '07 Oct', '08 Oct', '09 Oct', '10 Oct'],
    forecastDemand: [320, 410, 520, 650, 780, 890, 990],
    currentStock: [850, 680, 490, 270, 110, 40, 10],
    reorderLevel: 300,
    stockoutDayIndex: 3,
    stockoutText: 'Stockout Risk < 24 hours'
  },
  'post-bravo_rations': {
    locationId: 'post-bravo',
    supplyClass: 'Class I - Rations',
    labels: ['04 Oct', '05 Oct', '06 Oct', '07 Oct', '08 Oct', '09 Oct', '10 Oct'],
    forecastDemand: [180, 200, 240, 280, 320, 360, 400],
    currentStock: [920, 840, 750, 620, 480, 360, 240],
    reorderLevel: 300,
    stockoutDayIndex: 5,
    stockoutText: 'Stockout Risk in 3 days'
  }
};
