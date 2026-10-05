// RASAD-AI: Military Logistics Tactical Dataset (Ladakh & Northern Sector)

export const DEPOTS = [
  {
    id: 'depot-leh',
    name: '14 Corps HQ Depot - Leh',
    code: 'HQ-LEH-01',
    type: 'PRIMARY_HUB',
    lat: 34.1526,
    lng: 77.5771,
    altitude: '3,524 m (11,562 ft)',
    commander: 'Brig. S. K. Verma, VSM',
    capacityTotal: '50,000 MT',
    capacityUsed: '78%',
    fuelReserve: '450,000 L',
    activeConvoys: 8,
    status: 'OPTIMAL',
    weather: { temp: '-4°C', condition: 'Clear', wind: '14 km/h' }
  },
  {
    id: 'depot-khalsar',
    name: 'Nubra Forward Staging Base - Khalsar',
    code: 'FSB-KHL-02',
    type: 'FORWARD_STAGING',
    lat: 34.5020,
    lng: 77.6820,
    altitude: '3,100 m (10,170 ft)',
    commander: 'Col. Rajesh Nair',
    capacityTotal: '15,000 MT',
    capacityUsed: '64%',
    fuelReserve: '120,000 L',
    activeConvoys: 4,
    status: 'OPTIMAL',
    weather: { temp: '-9°C', condition: 'Overcast', wind: '22 km/h' }
  },
  {
    id: 'depot-upshi',
    name: 'Eastern Sector Logistics Node - Upshi',
    code: 'ESL-UPS-03',
    type: 'TRANSIT_DEPOT',
    lat: 33.8290,
    lng: 77.8180,
    altitude: '3,380 m (11,089 ft)',
    commander: 'Lt. Col. Ankit Rawat',
    capacityTotal: '18,000 MT',
    capacityUsed: '71%',
    fuelReserve: '180,000 L',
    activeConvoys: 3,
    status: 'OPTIMAL',
    weather: { temp: '-6°C', condition: 'Chilly', wind: '18 km/h' }
  },
  {
    id: 'depot-thoise',
    name: 'Thoise IAF Airhead & Partapur Garrison',
    code: 'IAF-THS-04',
    type: 'AIRHEAD_DEPOT',
    lat: 34.6540,
    lng: 77.4220,
    altitude: '3,180 m (10,433 ft)',
    commander: 'Air Commodore K. R. Sen',
    capacityTotal: '35,000 MT',
    capacityUsed: '82%',
    fuelReserve: '320,000 L',
    activeConvoys: 6,
    status: 'OPTIMAL',
    weather: { temp: '-8°C', condition: 'Good Visibility', wind: '16 km/h' }
  },
  {
    id: 'depot-darbuk',
    name: 'Darbuk Forward Logistics Staging Node',
    code: 'FSD-DRB-05',
    type: 'FORWARD_STAGING',
    lat: 34.1500,
    lng: 78.1400,
    altitude: '3,850 m (12,631 ft)',
    commander: 'Col. Amitav Mukherjee',
    capacityTotal: '22,000 MT',
    capacityUsed: '68%',
    fuelReserve: '195,000 L',
    activeConvoys: 5,
    status: 'OPTIMAL',
    weather: { temp: '-10°C', condition: 'Clear', wind: '18 km/h' }
  },
  {
    id: 'depot-karu',
    name: 'Karu 3 Inf Div Rear Logistics Depot',
    code: 'DIV-KRU-06',
    type: 'REAR_LOGISTICS',
    lat: 33.9210,
    lng: 77.7460,
    altitude: '3,400 m (11,155 ft)',
    commander: 'Brig. N. P. Joshi',
    capacityTotal: '40,000 MT',
    capacityUsed: '75%',
    fuelReserve: '380,000 L',
    activeConvoys: 5,
    status: 'OPTIMAL',
    weather: { temp: '-5°C', condition: 'Clear', wind: '12 km/h' }
  },
  {
    id: 'depot-sasoma',
    name: 'Sasoma Siachen Glacial Transit Camp',
    code: 'SIA-SSM-07',
    type: 'TRANSIT_DEPOT',
    lat: 35.1500,
    lng: 77.1800,
    altitude: '3,650 m (11,975 ft)',
    commander: 'Lt. Col. Jaspreet Singh',
    capacityTotal: '12,000 MT',
    capacityUsed: '84%',
    fuelReserve: '90,000 L',
    activeConvoys: 3,
    status: 'OPTIMAL',
    weather: { temp: '-15°C', condition: 'Snow Showers', wind: '24 km/h' }
  }
];

export const FORWARD_OUTPOSTS = [
  {
    id: 'op-dbo',
    name: 'OP Daulat Beg Oldi (DBO)',
    sector: 'Sub-Sector North (SSN)',
    code: 'DBO-ALPHA',
    lat: 35.4022,
    lng: 77.9297,
    altitude: '5,065 m (16,614 ft)',
    troops: 340,
    daysOfSupply: 3.5, // Critical!
    status: 'CRITICAL',
    weather: { temp: '-24°C', condition: 'Severe Wind Chill', wind: '58 km/h', blizzardRisk: 'HIGH' },
    supplies: {
      class1_rations: { current: 1850, capacity: 5000, unit: 'kg', dailyBurn: 320, safeThreshold: 2200 },
      class3_pol: { current: 3200, capacity: 12000, unit: 'Liters', dailyBurn: 950, safeThreshold: 4500 }, // heating kerosene & Arctic diesel
      class5_ammo: { current: 48000, capacity: 60000, unit: 'rounds', dailyBurn: 1200, safeThreshold: 25000 },
      class8_medical: { current: 42, capacity: 100, unit: 'kits', dailyBurn: 6, safeThreshold: 40 }
    },
    threatLevel: 'DEFCON-2',
    connectedDepot: 'depot-khalsar',
    lastResupply: '4 days ago'
  },
  {
    id: 'op-siachen-base',
    name: 'Siachen Glacial Outpost - Kumar Base',
    sector: 'Siachen Glacier',
    code: 'SIA-KMR-04',
    lat: 35.1500,
    lng: 77.2100,
    altitude: '4,880 m (16,000 ft)',
    troops: 210,
    daysOfSupply: 4.8,
    status: 'WARNING',
    weather: { temp: '-29°C', condition: 'Blizzard Active', wind: '65 km/h', blizzardRisk: 'SEVERE' },
    supplies: {
      class1_rations: { current: 2400, capacity: 4500, unit: 'kg', dailyBurn: 210, safeThreshold: 1800 },
      class3_pol: { current: 4100, capacity: 10000, unit: 'Liters', dailyBurn: 820, safeThreshold: 3500 },
      class5_ammo: { current: 32000, capacity: 40000, unit: 'rounds', dailyBurn: 400, safeThreshold: 15000 },
      class8_medical: { current: 28, capacity: 80, unit: 'kits', dailyBurn: 5, safeThreshold: 30 }
    },
    threatLevel: 'DEFCON-2',
    connectedDepot: 'depot-khalsar',
    lastResupply: '6 days ago'
  },
  {
    id: 'op-galwan',
    name: 'Galwan Post PP-14',
    sector: 'Galwan Valley Axis',
    code: 'GLW-PP14',
    lat: 34.7800,
    lng: 78.1800,
    altitude: '4,320 m (14,173 ft)',
    troops: 180,
    daysOfSupply: 8.2,
    status: 'NORMAL',
    weather: { temp: '-16°C', condition: 'Clear Night', wind: '28 km/h', blizzardRisk: 'LOW' },
    supplies: {
      class1_rations: { current: 3600, capacity: 4000, unit: 'kg', dailyBurn: 180, safeThreshold: 1200 },
      class3_pol: { current: 6800, capacity: 8000, unit: 'Liters', dailyBurn: 540, safeThreshold: 2500 },
      class5_ammo: { current: 38000, capacity: 45000, unit: 'rounds', dailyBurn: 300, safeThreshold: 15000 },
      class8_medical: { current: 65, capacity: 80, unit: 'kits', dailyBurn: 2, safeThreshold: 20 }
    },
    threatLevel: 'DEFCON-3',
    connectedDepot: 'depot-khalsar',
    lastResupply: '2 days ago'
  },
  {
    id: 'op-pangong',
    name: 'Pangong Tso North Ridge Outpost',
    sector: 'Finger 4 - Pangong',
    code: 'PNG-F4-07',
    lat: 33.7500,
    lng: 78.4500,
    altitude: '4,280 m (14,042 ft)',
    troops: 260,
    daysOfSupply: 6.5,
    status: 'NORMAL',
    weather: { temp: '-12°C', condition: 'Moderate Winds', wind: '34 km/h', blizzardRisk: 'MODERATE' },
    supplies: {
      class1_rations: { current: 4100, capacity: 5000, unit: 'kg', dailyBurn: 250, safeThreshold: 1600 },
      class3_pol: { current: 7200, capacity: 9000, unit: 'Liters', dailyBurn: 650, safeThreshold: 3000 },
      class5_ammo: { current: 52000, capacity: 60000, unit: 'rounds', dailyBurn: 600, safeThreshold: 20000 },
      class8_medical: { current: 70, capacity: 90, unit: 'kits', dailyBurn: 3, safeThreshold: 25 }
    },
    threatLevel: 'DEFCON-3',
    connectedDepot: 'depot-upshi',
    lastResupply: '3 days ago'
  },
  {
    id: 'op-demchok',
    name: 'Demchok Southern Sentry',
    sector: 'Indus Valley - Demchok',
    code: 'DMC-SS-09',
    lat: 32.7000,
    lng: 79.2500,
    altitude: '4,210 m (13,812 ft)',
    troops: 150,
    daysOfSupply: 11.0,
    status: 'NORMAL',
    weather: { temp: '-10°C', condition: 'Partly Cloudy', wind: '20 km/h', blizzardRisk: 'LOW' },
    supplies: {
      class1_rations: { current: 3800, capacity: 4000, unit: 'kg', dailyBurn: 140, safeThreshold: 1000 },
      class3_pol: { current: 7800, capacity: 8500, unit: 'Liters', dailyBurn: 420, safeThreshold: 2000 },
      class5_ammo: { current: 36000, capacity: 40000, unit: 'rounds', dailyBurn: 200, safeThreshold: 12000 },
      class8_medical: { current: 58, capacity: 70, unit: 'kits', dailyBurn: 2, safeThreshold: 18 }
    },
    threatLevel: 'DEFCON-4',
    connectedDepot: 'depot-upshi',
    lastResupply: 'Yesterday'
  },
  {
    id: 'op-chushul',
    name: 'Chushul Gap Advanced Base',
    sector: 'Chushul Sector',
    code: 'CSL-GAP-02',
    lat: 33.5900,
    lng: 78.6500,
    altitude: '4,350 m (14,270 ft)',
    troops: 290,
    daysOfSupply: 4.2,
    status: 'WARNING',
    weather: { temp: '-15°C', condition: 'Snowfall Warning', wind: '42 km/h', blizzardRisk: 'HIGH' },
    supplies: {
      class1_rations: { current: 2800, capacity: 5500, unit: 'kg', dailyBurn: 290, safeThreshold: 2000 },
      class3_pol: { current: 4300, capacity: 9500, unit: 'Liters', dailyBurn: 780, safeThreshold: 3500 },
      class5_ammo: { current: 42000, capacity: 55000, unit: 'rounds', dailyBurn: 500, safeThreshold: 20000 },
      class8_medical: { current: 36, capacity: 85, unit: 'kits', dailyBurn: 4, safeThreshold: 35 }
    },
    threatLevel: 'DEFCON-2',
    connectedDepot: 'depot-upshi',
    lastResupply: '5 days ago'
  }
];

export const SUPPLY_ROUTES = [
  {
    id: 'route-dsdbo',
    name: 'Darbuk-Shyok-DBO (DS-DBO) Road',
    code: 'AXIS-DSDBO',
    from: 'depot-khalsar',
    to: 'op-dbo',
    distanceKm: 220,
    transitTimeHrs: 8.5,
    altitudeMax: '5,065 m',
    status: 'BLOCKED_SNOW', // Triggers AI rerouting feature!
    blockageReason: 'Avalanche near Murgo Choke Point (Km 134)',
    riskLevel: 'SEVERE',
    coordinates: [
      [34.5020, 77.6820], // Khalsar
      [34.5800, 77.8900], // Shyok River Bend
      [34.8500, 78.0200], // Darbuk-Sultan Chushku
      [35.1000, 77.9800], // Murgo (Hazard Zone)
      [35.4022, 77.9297]  // DBO
    ]
  },
  {
    id: 'route-dsdbo-alternate',
    name: 'AI Recommended Alt: Shyok Ridge Bypass',
    code: 'AXIS-BYPASS-01',
    from: 'depot-khalsar',
    to: 'op-dbo',
    distanceKm: 248,
    transitTimeHrs: 9.8,
    altitudeMax: '4,800 m',
    status: 'CLEAR',
    riskLevel: 'LOW',
    isAlternate: true,
    coordinates: [
      [34.5020, 77.6820],
      [34.6200, 77.7500],
      [34.9200, 77.8200],
      [35.2500, 77.8600],
      [35.4022, 77.9297]
    ]
  },
  {
    id: 'route-leh-khalsar',
    name: 'Khardung La Military Artery',
    code: 'AXIS-KHD-01',
    from: 'depot-leh',
    to: 'depot-khalsar',
    distanceKm: 98,
    transitTimeHrs: 4.2,
    altitudeMax: '5,359 m (Khardung La Pass)',
    status: 'CAUTION_ICE',
    riskLevel: 'MODERATE',
    coordinates: [
      [34.1526, 77.5771], // Leh
      [34.2780, 77.6040], // South Pullu
      [34.3400, 77.6180], // Khardung La Pass (Elev: 17,582 ft)
      [34.4200, 77.6500], // North Pullu
      [34.5020, 77.6820]  // Khalsar
    ]
  },
  {
    id: 'route-siachen-axis',
    name: 'Nubra-Siachen Glacial Lifeline',
    code: 'AXIS-SIA-02',
    from: 'depot-khalsar',
    to: 'op-siachen-base',
    distanceKm: 145,
    transitTimeHrs: 6.0,
    altitudeMax: '4,880 m',
    status: 'CLEAR',
    riskLevel: 'LOW',
    coordinates: [
      [34.5020, 77.6820],
      [34.7000, 77.5200], // Panamik
      [34.9500, 77.3500], // Sasoma
      [35.1500, 77.2100]  // Kumar Base
    ]
  },
  {
    id: 'route-leh-upshi',
    name: 'Indus Valley Strategic Highway',
    code: 'AXIS-IND-01',
    from: 'depot-leh',
    to: 'depot-upshi',
    distanceKm: 48,
    transitTimeHrs: 1.5,
    altitudeMax: '3,524 m',
    status: 'CLEAR',
    riskLevel: 'LOW',
    coordinates: [
      [34.1526, 77.5771],
      [33.9800, 77.7100],
      [33.8290, 77.8180]
    ]
  },
  {
    id: 'route-upshi-pangong',
    name: 'Chang La Strategic Corridor',
    code: 'AXIS-CHG-01',
    from: 'depot-upshi',
    to: 'op-pangong',
    distanceKm: 130,
    transitTimeHrs: 5.5,
    altitudeMax: '5,360 m (Chang La Pass)',
    status: 'CLEAR',
    riskLevel: 'LOW',
    coordinates: [
      [33.8290, 77.8180],
      [33.9500, 78.0200], // Karu / Sakti
      [34.0500, 78.1800], // Chang La Pass
      [33.9000, 78.3200], // Tangste
      [33.7500, 78.4500]  // Pangong North
    ]
  },
  {
    id: 'route-upshi-chushul',
    name: 'Tsaga La - Chushul Route',
    code: 'AXIS-CSL-03',
    from: 'depot-upshi',
    to: 'op-chushul',
    distanceKm: 155,
    transitTimeHrs: 6.2,
    altitudeMax: '4,650 m',
    status: 'CAUTION_ICE',
    riskLevel: 'MODERATE',
    coordinates: [
      [33.8290, 77.8180],
      [33.7200, 78.1500],
      [33.6400, 78.4200],
      [33.5900, 78.6500]
    ]
  }
];

export interface SupplyCorridor {
  id: string;
  name: string;
  path: [number, number][];
  color: string;
  priority: string;
  blocked: boolean;
  terrain: string;
  maxGradient: string;
  passClearance: string;
  status: string;
}

export const SUPPLY_CORRIDORS: SupplyCorridor[] = [
  {
    id: 'corridor-dsdbo-main',
    name: 'Darbuk-Shyok-DBO (DS-DBO) Main Artery',
    path: [
      [34.5020, 77.6820],
      [34.5800, 77.8900],
      [34.8500, 78.0200],
      [35.1000, 77.9800],
      [35.4022, 77.9297]
    ],
    color: '#ef4444',
    priority: 'CRITICAL',
    blocked: true,
    terrain: 'Glacial scree & riverbed',
    maxGradient: '14.2%',
    passClearance: 'Blocked at Murgo KM 134',
    status: 'BLOCKED (Avalanche)'
  },
  {
    id: 'corridor-dsdbo-bypass',
    name: 'AI Shyok Ridge Western Bypass',
    path: [
      [34.5020, 77.6820],
      [34.6200, 77.7500],
      [34.9200, 77.8200],
      [35.2500, 77.8600],
      [35.4022, 77.9297]
    ],
    color: '#10b981',
    priority: 'HIGH',
    blocked: false,
    terrain: 'Hardpack rocky ridgeline',
    maxGradient: '11.8%',
    passClearance: 'Open (MLC-24 Cleared)',
    status: 'OPTIMAL (Active Alternate)'
  },
  {
    id: 'corridor-khardungla',
    name: 'Khardung La Axis (Leh -> Khalsar)',
    path: [
      [34.1526, 77.5771],
      [34.2780, 77.6040],
      [34.3400, 77.6180],
      [34.4200, 77.6500],
      [34.5020, 77.6820]
    ],
    color: '#38bdf8',
    priority: 'CRITICAL',
    blocked: false,
    terrain: 'Extreme high-altitude asphalt pass (5,359m)',
    maxGradient: '16.5%',
    passClearance: 'Open (Time Window 06:00 - 13:30)',
    status: 'ACTIVE (Ice Warning)'
  },
  {
    id: 'corridor-siachen',
    name: 'Nubra-Siachen Glacial Corridor',
    path: [
      [34.5020, 77.6820],
      [34.7000, 77.5200],
      [34.9500, 77.3500],
      [35.1500, 77.2100]
    ],
    color: '#06b6d4',
    priority: 'HIGH',
    blocked: false,
    terrain: 'Glacial moraine & snowpack',
    maxGradient: '12.0%',
    passClearance: 'Tracked / BV-206 Only',
    status: 'ACTIVE'
  },
  {
    id: 'corridor-changla',
    name: 'Chang La Strategic Corridor (Upshi -> Pangong)',
    path: [
      [33.8290, 77.8180],
      [33.9500, 78.0200],
      [34.0500, 78.1800],
      [33.9000, 78.3200],
      [33.7500, 78.4500]
    ],
    color: '#818cf8',
    priority: 'HIGH',
    blocked: false,
    terrain: 'Mountain pass (5,360m)',
    maxGradient: '15.0%',
    passClearance: 'Open',
    status: 'ACTIVE'
  },
  {
    id: 'corridor-thoise',
    name: 'Thoise Airhead Tactical Corridor (Khalsar -> Diskit -> Thoise)',
    path: [
      [34.5020, 77.6820],
      [34.5450, 77.5600],
      [34.6000, 77.4800],
      [34.6540, 77.4220]
    ],
    color: '#38bdf8',
    priority: 'HIGH',
    blocked: false,
    terrain: 'Nubra river valley all-weather road',
    maxGradient: '6.5%',
    passClearance: 'All Vehicles & Heavy Transporters',
    status: 'OPTIMAL (Airhead Lifeline)'
  },
  {
    id: 'corridor-darbuk',
    name: 'Darbuk Forward Staging Corridor (Khalsar -> Agham -> Darbuk)',
    path: [
      [34.5020, 77.6820],
      [34.4100, 77.8200],
      [34.2800, 78.0100],
      [34.1500, 78.1400]
    ],
    color: '#f59e0b',
    priority: 'CRITICAL',
    blocked: false,
    terrain: 'Shyok river gorge sector (3,850m)',
    maxGradient: '9.8%',
    passClearance: 'Cleared for Convoy Groups',
    status: 'ACTIVE (DS-DBO Feeder)'
  }
];

export interface ChokePointItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  hazardType: string;
  severity: string;
  description: string;
  bypassRouteAvailable: boolean;
}

export const CHOKE_POINTS: ChokePointItem[] = [
  {
    id: 'choke-murgo',
    name: 'Murgo Choke Point (KM 134 DS-DBO)',
    lat: 35.1000,
    lng: 77.9800,
    hazardType: 'Snow Avalanche & Rockfall',
    severity: 'EXTREME',
    description: '180m snowpack avalanche blocking heavy Tatra transit. BRO dozers deployed.',
    bypassRouteAvailable: true
  },
  {
    id: 'choke-khardungla',
    name: 'Khardung La Summit Saddle',
    lat: 34.3400,
    lng: 77.6180,
    hazardType: 'Black Ice & Severe Blizzard',
    severity: 'HIGH',
    description: 'Ice accretion on hairpin turns. Anti-skid chains mandatory.',
    bypassRouteAvailable: false
  },
  {
    id: 'choke-shyok-bridge',
    name: 'Shyok River Bailey Bridge (MLC-24)',
    lat: 34.5800,
    lng: 77.8900,
    hazardType: 'Bridge Weight MLC Limit (24 Tons)',
    severity: 'MODERATE',
    description: 'Tatra 10T exceeds MLC rating. Transshipment split required.',
    bypassRouteAvailable: true
  }
];

export const ACTIVE_CONVOYS = [
  {
    id: 'convoy-cv101',
    callsign: 'GARUDA-01',
    vehicles: '4x Tatra 8x8 Heavy Utility Trucks',
    routeId: 'route-leh-khalsar',
    origin: 'HQ-LEH-01',
    destination: 'FSB-KHL-02',
    lat: 34.3100,
    lng: 77.6100,
    heading: 42,
    speedKmH: 28,
    cargoType: 'Arctic Fuel (POL) & Winter Rations',
    cargoWeight: '24,000 kg',
    fuelPayload: '16,000 L Arctic Grade Kerosene',
    ammoPayload: 'N/A',
    tempSensor: '-6.2°C (Optimal)',
    vibration: '0.34g (Normal)',
    eta: '1h 45m',
    progress: 55,
    status: 'EN_ROUTE',
    lastCheckpoint: 'South Pullu Post (RFID Verified 14:20 hrs)'
  },
  {
    id: 'convoy-cv102',
    callsign: 'CHETAK-04',
    vehicles: '2x BV-206 High-Altitude Tracked Carriers',
    routeId: 'route-siachen-axis',
    origin: 'FSB-KHL-02',
    destination: 'SIA-KMR-04',
    lat: 34.8200,
    lng: 77.4400,
    heading: 320,
    speedKmH: 22,
    cargoType: 'Class VIII Medical Oxygen & Rations',
    cargoWeight: '7,500 kg',
    fuelPayload: '2,500 L',
    ammoPayload: '8,000 rds 5.56 NATO',
    tempSensor: '-18.4°C (Safe Storage)',
    vibration: '0.41g (Rough Glacial Trail)',
    eta: '2h 10m',
    progress: 68,
    status: 'EN_ROUTE',
    lastCheckpoint: 'Sasoma Logistics Camp (RFID Scanned 15:10 hrs)'
  },
  {
    id: 'convoy-cv103',
    callsign: 'VAJRA-09',
    vehicles: '3x Ashok Leyland Stallion 4x4',
    routeId: 'route-upshi-pangong',
    origin: 'ESL-UPS-03',
    destination: 'PNG-F4-07',
    lat: 33.9800,
    lng: 78.1000,
    heading: 75,
    speedKmH: 35,
    cargoType: 'Class V Small Arms Ammo & Communication Spares',
    cargoWeight: '12,000 kg',
    fuelPayload: '3,000 L',
    ammoPayload: '45,000 rds',
    tempSensor: '-8.1°C',
    vibration: '0.28g (Smooth)',
    eta: '3h 15m',
    progress: 40,
    status: 'EN_ROUTE',
    lastCheckpoint: 'Karu Checkpost (RFID Verified 13:50 hrs)'
  },
  {
    id: 'convoy-cv104',
    callsign: 'RUDRA-02 (REROUTED)',
    vehicles: '4x Tatra 8x8 Heavy Utility Trucks',
    routeId: 'route-dsdbo-alternate',
    origin: 'FSB-KHL-02',
    destination: 'DBO-ALPHA',
    lat: 34.7500,
    lng: 77.7800,
    heading: 15,
    speedKmH: 26,
    cargoType: 'PRIORITY RELIEF: Arctic Heating Fuel & Class I Fresh Rations',
    cargoWeight: '28,000 kg',
    fuelPayload: '18,000 L Kerosene',
    ammoPayload: '20,000 rds',
    tempSensor: '-14.0°C (Secure)',
    vibration: '0.38g',
    eta: '6h 40m',
    progress: 25,
    status: 'AI_REROUTED',
    lastCheckpoint: 'AI Rerouted via Shyok Ridge Bypass (Avoided Murgo Avalanche)'
  }
];

export const AI_PREDICTIVE_INSIGHTS = [
  {
    id: 'insight-01',
    severity: 'CRITICAL',
    title: 'DBO-ALPHA: Critical Fuel Depletion Imminent (3.5 Days Left)',
    description: 'AI model detects sharp temperature drop to -24°C in SSN sector. Heating kerosene consumption increased by +42% above seasonal average.',
    recommendation: 'Authorize immediate dispatch of Convoy RUDRA-02 via Shyok Ridge Bypass before second blizzard window at 0300Z.',
    outpostId: 'op-dbo',
    confidence: '96.4%',
    actionRequired: 'DISPATCH_CONFIRMATION'
  },
  {
    id: 'insight-02',
    severity: 'WARNING',
    title: 'Murgo Choke Point Avalanche Hazard (DS-DBO Axis)',
    description: 'GIS terrain satellite sensor flagged 180m snow accumulation at KM 134. Primary axis impassable for heavy Tatra vehicles.',
    recommendation: 'Autonomous routing engine has diverted all Class III & V convoys to Western Bypass. Saves 14 hours of road clearance downtime.',
    outpostId: 'op-dbo',
    confidence: '98.1%',
    actionRequired: 'REROUTE_CONFIRMED'
  },
  {
    id: 'insight-03',
    severity: 'WARNING',
    title: 'Siachen Kumar Base: Class VIII Medical Buffer Breaching',
    description: 'Elevated casualty/frostbite risk due to blizzard. High-Altitude Pulmonary Edema (HAPE) medicine kit burn rate doubled (6 kits/day).',
    recommendation: 'Convoy CHETAK-04 tracked carriers currently 2h 10m away. Helidrop stand-by ordered from 114 HU Siachen Pioneers if ground track closes.',
    outpostId: 'op-siachen-base',
    confidence: '93.8%',
    actionRequired: 'MONITORING'
  },
  {
    id: 'insight-04',
    severity: 'INFO',
    title: 'Pangong F4 & Demchok Winter Pre-Stocking at 89%',
    description: 'Pre-winter stocking for southern and eastern border outposts is ahead of winter cutoff schedule by 11 days. Supply assurance index stable.',
    recommendation: 'Maintain standard weekly rotation of maintenance spares and battery warmers.',
    outpostId: 'op-pangong',
    confidence: '97.5%',
    actionRequired: 'INFO_ONLY'
  }
];

export const HISTORICAL_AND_PREDICTION_SERIES = {
  'op-dbo': {
    labels: ['D-10', 'D-8', 'D-6', 'D-4', 'D-2', 'Today', 'D+2', 'D+4', 'D+6', 'D+8', 'D+10', 'D+12', 'D+14'],
    class3_pol: {
      actual: [7800, 7100, 6300, 5200, 4200, 3200, null, null, null, null, null, null, null],
      predicted: [null, null, null, null, null, 3200, 2250, 1300, 350, 0, 0, 0, 0],
      predictedWithResupply: [null, null, null, null, null, 3200, 2250, 11500, 10550, 9600, 8650, 7700, 6750],
      safeThreshold: 4500
    },
    class1_rations: {
      actual: [3800, 3450, 3100, 2700, 2250, 1850, null, null, null, null, null, null, null],
      predicted: [null, null, null, null, null, 1850, 1530, 1210, 890, 570, 250, 0, 0],
      predictedWithResupply: [null, null, null, null, null, 1850, 1530, 4200, 3880, 3560, 3240, 2920, 2600],
      safeThreshold: 2200
    }
  },
  'op-siachen-base': {
    labels: ['D-10', 'D-8', 'D-6', 'D-4', 'D-2', 'Today', 'D+2', 'D+4', 'D+6', 'D+8', 'D+10', 'D+12', 'D+14'],
    class3_pol: {
      actual: [8200, 7400, 6550, 5700, 4900, 4100, null, null, null, null, null, null, null],
      predicted: [null, null, null, null, null, 4100, 3280, 2460, 1640, 820, 0, 0, 0],
      predictedWithResupply: [null, null, null, null, null, 4100, 3280, 6500, 5680, 4860, 4040, 3220, 2400],
      safeThreshold: 3500
    },
    class1_rations: {
      actual: [3900, 3600, 3300, 3000, 2700, 2400, null, null, null, null, null, null, null],
      predicted: [null, null, null, null, null, 2400, 2190, 1980, 1770, 1560, 1350, 1140, 930],
      predictedWithResupply: [null, null, null, null, null, 2400, 2190, 4100, 3890, 3680, 3470, 3260, 3050],
      safeThreshold: 1800
    }
  },
  'op-galwan': {
    labels: ['D-10', 'D-8', 'D-6', 'D-4', 'D-2', 'Today', 'D+2', 'D+4', 'D+6', 'D+8', 'D+10', 'D+12', 'D+14'],
    class3_pol: {
      actual: [9400, 8900, 8350, 7800, 7300, 6800, null, null, null, null, null, null, null],
      predicted: [null, null, null, null, null, 6800, 6260, 5720, 5180, 4640, 4100, 3560, 3020],
      predictedWithResupply: [null, null, null, null, null, 6800, 6260, 5720, 5180, 4640, 4100, 3560, 3020],
      safeThreshold: 2500
    },
    class1_rations: {
      actual: [4800, 4550, 4300, 4050, 3800, 3600, null, null, null, null, null, null, null],
      predicted: [null, null, null, null, null, 3600, 3420, 3240, 3060, 2880, 2700, 2520, 2340],
      predictedWithResupply: [null, null, null, null, null, 3600, 3420, 3240, 3060, 2880, 2700, 2520, 2340],
      safeThreshold: 1200
    }
  }
};

// ==========================================
// INTEGRATED DEFENSE AI MODULES DATASETS
// ==========================================

export const COPILOT_KNOWLEDGE_BASE = [
  {
    query: "What is the winter SOP reserve requirement for Siachen Kumar Base?",
    response: "According to HQ Northern Command SOP (Annexure C, Para 18.2): Forward glacial posts above 15,000 ft must maintain a minimum 14-day safety buffer of Arctic Grade Kerosene (Class III) and 21 days of Class I High-Calorie Rations during the winter blockage window. In the event of blizzard warnings, reorder triggers are advanced by 72 hours.",
    source: "Army Logistics Doctrine - Glacial Sector Ops (Vol. 4, Ch. 2)",
    relevance: "98.7%"
  },
  {
    query: "What are the protocol guidelines when Murgo Choke Point is blocked?",
    response: "Protocol D-DBO-09 specifies: When DS-DBO KM 134 Murgo section reports avalanche/snow depth >1.2m, primary heavy transit is suspended immediately. Convoy traffic must divert via the Western Shyok Ridge Bypass with 4x4 or 8x8 Tatra vehicles fitted with snow chains. Maximum convoy speed limited to 30 km/h.",
    source: "14 Corps Movement Control Order #2026/09",
    relevance: "96.4%"
  },
  {
    query: "What is the Class VIII medical protocol for high-altitude pulmonary edema (HAPE)?",
    response: "Under Medical Directive HQ-NC/MED/41: Every forward post must stock a minimum of 30 HAPE hyperbaric Gamow bags and emergency dexamethasone ampoules per 100 personnel. If burn rate exceeds 4 kits/day, standby air casualty evacuation (CASEVAC) alert is placed with 114 HU Siachen Pioneers.",
    source: "Directorate General Armed Forces Medical Services (DGAFMS) Field Guide",
    relevance: "99.1%"
  }
];

export const GUARDRAIL_VERIFICATION_STAGES = [
  {
    id: 'stage-1',
    name: 'Depot Reserve Verification',
    check: 'Ensure origin depot maintains >25% baseline reserve post-dispatch',
    status: 'PASSED',
    detail: 'FSB Khalsar holds 120,000L. Dispatching 18,000L leaves 85% healthy reserve.'
  },
  {
    id: 'stage-2',
    name: 'Route Risk & Weather Clearance',
    check: 'Autonomous check for active avalanches or closed passes',
    status: 'PASSED',
    detail: 'Avoided Murgo Pass (Blocked). Shyok Ridge Bypass confirmed clear by GIS radar.'
  },
  {
    id: 'stage-3',
    name: 'Vehicle Fleet Payload Limits',
    check: 'Verify gross vehicle weight and snow-traverse ratings',
    status: 'PASSED',
    detail: '4x Tatra 8x8 utility trucks assigned. Total weight: 28,000 kg (within 32,000 kg limit).'
  },
  {
    id: 'stage-4',
    name: 'Tamper & Manifest Authorization',
    check: 'Verify cryptographic RFID manifest signature before departure',
    status: 'PASSED',
    detail: 'RFID seal #IA-7782 verified. Commander digital dispatch token signed.'
  }
];

export const CARGO_CV_SCAN_DATA = {
  convoyId: 'convoy-cv104 (RUDRA-02)',
  scanTimestamp: 'Today 15:42 IST',
  checkpoint: 'South Pullu Staging Gate #2',
  vehicleReg: 'IA-14C-8841 (Tatra 8x8 Heavy Utility)',
  inspectionStatus: 'TAMPER_CLEAR',
  detections: [
    { label: 'Arctic Kerosene Fuel Drum (200L)', count: 90, confidence: '98.7%', bbox: [20, 30, 180, 220], status: 'SEAL_INTACT' },
    { label: 'High-Altitude Ration Crates (Class I)', count: 45, confidence: '97.2%', bbox: [210, 40, 360, 210], status: 'SEAL_INTACT' },
    { label: 'Class VIII Medical First-Response Crate', count: 8, confidence: '99.1%', bbox: [380, 60, 480, 230], status: 'SEAL_INTACT' },
    { label: '5.56mm Ammo Sealed Ammunition Case', count: 12, confidence: '98.4%', bbox: [500, 50, 600, 220], status: 'SEAL_INTACT' }
  ],
  opticalConfidenceOverall: '98.4%',
  weightSensorMismatch: '0.0% (Exact Match to Manifest)'
};

