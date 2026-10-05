// Real-World Military Geography & Operational Sectors: HQ 14 Corps ("Fire & Fury")

export type MilitarySectorId = 'SECTOR_SSN' | 'SECTOR_DSDBO' | 'SECTOR_CHUSHUL' | 'SECTOR_WESTERN';

export interface MilitaryFacilityNode {
  id: string;
  name: string;
  designation: 'FSD' | 'FOD' | 'TC' | 'TCP' | 'ALG' | 'POST' | 'HQ';
  designationFull: string;
  sectorId: MilitarySectorId;
  lat: number;
  lng: number;
  altitudeM: number;
  role: string;
  holdingCapacity?: string;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
}

export interface MilitarySector {
  id: MilitarySectorId;
  name: string;
  shortName: string;
  formation: string;
  broProject: string;
  headquarters: string;
  centerCoordinates: [number, number];
  zoomLevel: number;
  elevationRangeM: string;
  keyPass: string;
  passWindow: string;
  outpostIds: string[];
  description: string;
  routeWaypoints: Array<{ name: string; altitudeM: number; distanceKm: number; hazard: string }>;
}

export const MILITARY_SECTORS: Record<MilitarySectorId, MilitarySector> = {
  SECTOR_SSN: {
    id: 'SECTOR_SSN',
    name: 'Sub-Sector North & Siachen Glacial Corridor',
    shortName: 'SSN / Siachen (102 Bde)',
    formation: '102 (I) Infantry Brigade ("Siachen Brigade")',
    broProject: 'Project HIMANK (GREF 111 RCC)',
    headquarters: 'Partapur Military Garrison & Thoise Air Base',
    centerCoordinates: [35.05, 77.30],
    zoomLevel: 9,
    elevationRangeM: '3,050m - 6,700m (Indira Col)',
    keyPass: 'Khardung La Pass (5,359m)',
    passWindow: '08:00 - 14:00 IST (Strict Convoy Timing)',
    outpostIds: ['op-siachen-base', 'op-bana-top', 'op-sasoma', 'depot-khalsar'],
    description: 'Extreme glacial terrain along the Saltoro Ridge and Nubra River. Air-bridge via Thoise and heavy-lift UAVs.',
    routeWaypoints: [
      { name: 'Central Depot Leh', altitudeM: 3500, distanceKm: 0, hazard: 'Clear Base' },
      { name: 'Khardung La Pass', altitudeM: 5359, distanceKm: 42, hazard: 'High Altitude Snow Drift' },
      { name: 'FSB Khalsar (Depot)', altitudeM: 3050, distanceKm: 88, hazard: 'River Confluence' },
      { name: 'Partapur / Thoise Base', altitudeM: 3180, distanceKm: 120, hazard: 'Airhead Operational' },
      { name: 'TC Sasoma (Staging)', altitudeM: 3550, distanceKm: 165, hazard: 'Narrow Gorges' },
      { name: 'Siachen Base Camp', altitudeM: 3650, distanceKm: 210, hazard: 'Glacial Snout' },
      { name: 'Kumar Base (Forward)', altitudeM: 4880, distanceKm: 235, hazard: 'Crevasse Zone' },
      { name: 'Bana Top Post', altitudeM: 6700, distanceKm: 255, hazard: 'Extreme Hypoxia & Sub-Zero' }
    ]
  },
  SECTOR_DSDBO: {
    id: 'SECTOR_DSDBO',
    name: 'Darbuk-Shyok-DBO & Depsang Highway Axis',
    shortName: 'DS-DBO / Depsang (81 Bde)',
    formation: '81 Infantry Brigade (Northern Sub-Sector)',
    broProject: 'Project HIMANK (Task Force 753 BRTF)',
    headquarters: 'Darbuk Logistics Node & DBO Advance Landing Ground',
    centerCoordinates: [35.15, 77.90],
    zoomLevel: 9,
    elevationRangeM: '3,100m - 5,065m (DBO Plateau)',
    keyPass: 'Murgo Km 134 Choke Point & Karakoram Pass',
    passWindow: '09:00 - 15:00 IST (Daylight Convoy Convoy Only)',
    outpostIds: ['op-dbo', 'op-galwan', 'depot-khalsar'],
    description: 'Strategic DS-DBO Highway skirting the Shyok river and Chip Chap river towards Karakoram Pass.',
    routeWaypoints: [
      { name: 'FSB Khalsar Base', altitudeM: 3050, distanceKm: 0, hazard: 'Valley Floor' },
      { name: 'Shyok River Bridge', altitudeM: 3750, distanceKm: 48, hazard: 'Flash Flood Watch' },
      { name: 'Sultan Chhushku', altitudeM: 4050, distanceKm: 95, hazard: 'Icy Scree' },
      { name: 'Murgo Km 134 Choke Point', altitudeM: 4400, distanceKm: 134, hazard: 'Avalanche Red Zone' },
      { name: 'Burtsa Camp', altitudeM: 4650, distanceKm: 175, hazard: 'Depsang Plain Entry' },
      { name: 'Qizil Langar', altitudeM: 4850, distanceKm: 215, hazard: 'High Wind-Chill' },
      { name: 'Daulat Beg Oldi (DBO ALG)', altitudeM: 5065, distanceKm: 255, hazard: 'Sub-Zero Hard Freeze (-32°C)' }
    ]
  },
  SECTOR_CHUSHUL: {
    id: 'SECTOR_CHUSHUL',
    name: 'Pangong Tso – Chushul – Nyoma Corridor',
    shortName: 'Pangong / Chushul (3 Div)',
    formation: '3 Infantry Division ("Trishul Division" / 114 Bde)',
    broProject: 'Project HIMANK (16 BRTF)',
    headquarters: 'Karu Supply Hub & Nyoma Advance Landing Ground',
    centerCoordinates: [33.65, 78.50],
    zoomLevel: 9,
    elevationRangeM: '3,380m - 5,360m (Chang La)',
    keyPass: 'Chang La Pass (5,360m) & Rezang La (5,050m)',
    passWindow: '07:30 - 16:00 IST (Chang La Transit Window)',
    outpostIds: ['op-pangong', 'op-chushul', 'op-demchok', 'depot-upshi'],
    description: 'High-altitude mechanized armored deployment sector spanning Pangong Tso north/south banks down to Demchok and Nyoma fighter airhead.',
    routeWaypoints: [
      { name: 'FSD Karu (Main Logistics Depot)', altitudeM: 3500, distanceKm: 0, hazard: 'Theatre Railhead Relay' },
      { name: 'TCP Zingral', altitudeM: 4600, distanceKm: 28, hazard: 'Pass Ascent Control' },
      { name: 'Chang La Pass', altitudeM: 5360, distanceKm: 42, hazard: 'Heavy Ice & Blizzard Risk' },
      { name: 'TCP Tsoltak', altitudeM: 4800, distanceKm: 56, hazard: 'Pass Descent Checkpoint' },
      { name: 'Tangtse FSD Base', altitudeM: 3950, distanceKm: 85, hazard: 'Armored Tank Depot' },
      { name: 'Lukung (Pangong North Bank)', altitudeM: 4280, distanceKm: 120, hazard: 'Lake Corridor' },
      { name: 'Chushul Gap Military Post', altitudeM: 4350, distanceKm: 168, hazard: 'Open Tank Plain' },
      { name: 'Rezang La Battle Memorial', altitudeM: 5050, distanceKm: 195, hazard: 'High Winds' },
      { name: 'Nyoma ALG Airhead', altitudeM: 4180, distanceKm: 245, hazard: 'Tactical Runway' },
      { name: 'Demchok Southern Sentry', altitudeM: 4210, distanceKm: 310, hazard: 'Indus River Axis' }
    ]
  },
  SECTOR_WESTERN: {
    id: 'SECTOR_WESTERN',
    name: 'Kargil – Dras – Zojila Western Lifeline',
    shortName: 'Kargil / Zojila (8 Mtn Div)',
    formation: '8 Mountain Division ("Forever in Operation" / 121 Bde)',
    broProject: 'Project VIJAYAK (BRO)',
    headquarters: 'Kargil Garrison & Dras Brigade Headquarters',
    centerCoordinates: [34.45, 75.80],
    zoomLevel: 9,
    elevationRangeM: '2,670m - 4,108m (Fotu La)',
    keyPass: 'Zojila Pass (3,528m) & Fotu La (4,108m)',
    passWindow: '10:00 - 17:00 IST (Subject to Zojila Snow Clearance)',
    outpostIds: ['op-kargil', 'op-dras', 'depot-leh'],
    description: 'National Highway NH-1D arterial connection linking Kashmir Valley to Ladakh. Critical route for heavy bulk winter stocking.',
    routeWaypoints: [
      { name: 'Srinagar Transit Base', altitudeM: 1585, distanceKm: 0, hazard: 'Valley Main Railhead' },
      { name: 'Sonamarg Staging Camp', altitudeM: 2740, distanceKm: 84, hazard: 'Zojila Base Camp' },
      { name: 'Zojila Pass Crest', altitudeM: 3528, distanceKm: 108, hazard: 'Severe Snow Avalanche Shutes' },
      { name: 'Dras Battle Honors Post', altitudeM: 3280, distanceKm: 145, hazard: 'Second Coldest Inhabited Place' },
      { name: 'Kargil Military Station', altitudeM: 2670, distanceKm: 205, hazard: 'Suru River Confluence' },
      { name: 'Namika La Pass', altitudeM: 3700, distanceKm: 255, hazard: 'Winding Gradients' },
      { name: 'Fotu La Pass', altitudeM: 4108, distanceKm: 290, hazard: 'Highest NH-1D Elevation' },
      { name: 'Khaltsi Checkpoint', altitudeM: 2980, distanceKm: 345, hazard: 'Indus Crossing' },
      { name: '14 Corps HQ Depot Leh', altitudeM: 3500, distanceKm: 434, hazard: 'Main Operational Hub' }
    ]
  }
};

export const MILITARY_FACILITY_NODES: MilitaryFacilityNode[] = [
  // FSD & Depots
  { id: 'fsd-karu', name: 'Forward Supply Depot (FSD) Karu', designation: 'FSD', designationFull: 'Forward Supply Depot', sectorId: 'SECTOR_CHUSHUL', lat: 33.9180, lng: 77.7420, altitudeM: 3500, role: 'Bulk Class-I & Class-III Central Depot for 3 Div', holdingCapacity: '40,000 MT', status: 'OPTIMAL' },
  { id: 'fsd-tangtse', name: 'Forward Supply Depot Tangtse', designation: 'FSD', designationFull: 'Forward Supply Depot', sectorId: 'SECTOR_CHUSHUL', lat: 34.0200, lng: 78.1800, altitudeM: 3950, role: 'Pangong & Chushul Tank Garrison Logistics Feeder', holdingCapacity: '18,000 MT', status: 'OPTIMAL' },
  { id: 'fsd-khalsar', name: 'Forward Staging Base Khalsar', designation: 'FSD', designationFull: 'Forward Supply Depot', sectorId: 'SECTOR_SSN', lat: 34.5020, lng: 77.6820, altitudeM: 3050, role: 'Nubra Valley Transshipment Point for Siachen & DBO', holdingCapacity: '25,000 MT', status: 'WARNING' },

  // Transit Camps (TC)
  { id: 'tc-sasoma', name: 'Transit Camp 14 Sasoma', designation: 'TC', designationFull: 'Military Transit Camp', sectorId: 'SECTOR_SSN', lat: 34.9500, lng: 77.6800, altitudeM: 3550, role: 'Stage-3 Acclimatization & Mule Depot for Siachen', status: 'OPTIMAL' },
  { id: 'tc-upshi', name: 'Transit Camp Upshi', designation: 'TC', designationFull: 'Military Transit Camp', sectorId: 'SECTOR_CHUSHUL', lat: 33.8290, lng: 77.8180, altitudeM: 3380, role: 'Manali-Leh Axis Reception & Staging Depot', status: 'OPTIMAL' },

  // Traffic Control Posts (TCP - Military Police)
  { id: 'tcp-south-pullu', name: 'TCP South Pullu (CMP)', designation: 'TCP', designationFull: 'Traffic Control Post', sectorId: 'SECTOR_SSN', lat: 34.2500, lng: 77.6100, altitudeM: 4650, role: 'Khardung La Ascent Traffic Regulation (Pass Window 14:00)', status: 'OPTIMAL' },
  { id: 'tcp-north-pullu', name: 'TCP North Pullu (CMP)', designation: 'TCP', designationFull: 'Traffic Control Post', sectorId: 'SECTOR_SSN', lat: 34.3400, lng: 77.6300, altitudeM: 4720, role: 'Nubra Descent Convoy Gate & Chains Inspection', status: 'OPTIMAL' },
  { id: 'tcp-zingral', name: 'TCP Zingral (CMP)', designation: 'TCP', designationFull: 'Traffic Control Post', sectorId: 'SECTOR_CHUSHUL', lat: 33.9800, lng: 77.9200, altitudeM: 4600, role: 'Chang La West Pass Gate', status: 'OPTIMAL' },

  // Advance Landing Grounds (ALG)
  { id: 'alg-dbo', name: 'DBO Advance Landing Ground', designation: 'ALG', designationFull: 'Advance Landing Ground', sectorId: 'SECTOR_DSDBO', lat: 35.4022, lng: 77.9297, altitudeM: 5065, role: 'World’s Highest Airstrip (C-130J Super Hercules Ops)', status: 'CRITICAL' },
  { id: 'alg-nyoma', name: 'Nyoma Advance Landing Ground', designation: 'ALG', designationFull: 'Advance Landing Ground', sectorId: 'SECTOR_CHUSHUL', lat: 33.2000, lng: 78.6800, altitudeM: 4180, role: 'IAF Upgraded Fighter & Transport Base (Fwd Logistics Airhead)', status: 'OPTIMAL' },
  { id: 'alg-thoise', name: 'Thoise Air Force Base', designation: 'ALG', designationFull: 'Advance Landing Ground', sectorId: 'SECTOR_SSN', lat: 34.6500, lng: 77.4200, altitudeM: 3100, role: 'Air Lifeline for Siachen Glacier (IL-76, AN-32, C-17)', status: 'OPTIMAL' },
  { id: 'alg-kargil', name: 'Kargil Airfield', designation: 'ALG', designationFull: 'Advance Landing Ground', sectorId: 'SECTOR_WESTERN', lat: 34.5200, lng: 76.1500, altitudeM: 2920, role: 'Western Tactical Airstrip & Emergency Heli-Bridge', status: 'OPTIMAL' }
];
