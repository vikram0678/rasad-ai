import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import { DEPOTS, FORWARD_OUTPOSTS, ACTIVE_CONVOYS, SUPPLY_CORRIDORS, CHOKE_POINTS } from '../data/mockData';
import { Outpost } from '../types';

const BASEMAP_TILES: Record<string, { url: string; options: L.TileLayerOptions }> = {
  terrain: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 18, attribution: 'Esri Topo' }
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 18, attribution: 'Esri Satellite' }
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    options: { maxZoom: 19, subdomains: 'abcd', attribution: 'CartoDB Dark' }
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: { maxZoom: 19, attribution: 'OpenStreetMap' }
  }
};

export interface TacticalMapHandle {
  flyToOutpost: (outpostId: string) => void;
  recenterHQ: () => void;
  focusDBO: () => void;
  focusAerialCorridors: () => void;
}

interface TacticalMapProps {
  selectedOutpostId: string;
  onSelectOutpost: (id: string) => void;
  onToast: (msg: string) => void;
  simDay?: number;
  outposts?: Outpost[];
  onAdvanceSimulation?: () => void;
  onSimulateBlizzard?: () => void;
  blizzardActive?: boolean;
  onToggleElevation?: () => void;
  showElevation?: boolean;
}

export const TacticalMap = forwardRef<TacticalMapHandle, TacticalMapProps>(({
  selectedOutpostId,
  onSelectOutpost,
  onToast,
  simDay = 0,
  outposts,
  onAdvanceSimulation,
  onSimulateBlizzard,
  blizzardActive = false,
  onToggleElevation,
  showElevation = false
}, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  const depotLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const outpostLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const routesLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const convoyLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const hazardLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const weatherLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const aerialLayerRef = useRef<L.LayerGroup>(L.layerGroup());

  const outpostMarkersRef = useRef<Record<string, L.Marker>>({});
  const convoyMarkersRef = useRef<Record<string, L.Marker>>({});

  const [activeBasemap, setActiveBasemap] = useState<string>('terrain');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('ALL');
  const [criticalFilterActive, setCriticalFilterActive] = useState<boolean>(false);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);

  const [layerVisibility, setLayerVisibility] = useState({
    weather: true,
    routes: true,
    hazards: true,
    convoys: true,
    aerial: true
  });

  useImperativeHandle(ref, () => ({
    flyToOutpost: (id: string) => {
      const op = FORWARD_OUTPOSTS.find(o => o.id === id);
      if (op && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([op.lat, op.lng], 9.5, { duration: 1.2 });
        const marker = outpostMarkersRef.current[id];
        if (marker) marker.openPopup();
      }
    },
    recenterHQ: () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([34.1526, 77.5771], 9);
        onToast('GIS Map recentered to 14 Corps HQ Depot - Leh');
      }
    },
    focusDBO: () => {
      const dbo = FORWARD_OUTPOSTS.find(o => o.id === 'op-dbo');
      if (dbo && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([dbo.lat, dbo.lng], 10, { duration: 1.2 });
        onSelectOutpost('op-dbo');
        onToast('Focused on DBO Strategic Pass & Air Strip');
      }
    },
    focusAerialCorridors: () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([34.80, 77.75], 8.5);
        setLayerVisibility(v => ({ ...v, aerial: true }));
        aerialLayerRef.current.addTo(mapInstanceRef.current);
        onToast('IAF C-130J & Drone Corridors Focused on Tactical GIS Map');
      }
    }
  }));

  const setBasemap = (key: string) => {
    setActiveBasemap(key);
    const map = mapInstanceRef.current;
    if (!map) return;
    const tileConfig = BASEMAP_TILES[key] || BASEMAP_TILES.terrain;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    baseTileLayerRef.current = L.tileLayer(tileConfig.url, tileConfig.options).addTo(map);
    baseTileLayerRef.current.bringToBack();
    onToast(`Active Basemap: ${key.toUpperCase()}`);
  };

  const toggleLayer = (layerKey: keyof typeof layerVisibility) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const nextVal = !layerVisibility[layerKey];
    setLayerVisibility(prev => ({ ...prev, [layerKey]: nextVal }));

    const layerMap: Record<string, L.LayerGroup> = {
      weather: weatherLayerRef.current,
      routes: routesLayerRef.current,
      hazards: hazardLayerRef.current,
      convoys: convoyLayerRef.current,
      aerial: aerialLayerRef.current
    };

    const targetLayer = layerMap[layerKey];
    if (targetLayer) {
      if (nextVal) targetLayer.addTo(map);
      else map.removeLayer(targetLayer);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    let map: L.Map;
    try {
      map = L.map(mapContainerRef.current, {
        center: [34.50, 77.90],
        zoom: 8,
        zoomControl: true,
        attributionControl: false,
        minZoom: 5,
        maxZoom: 18
      });
      mapInstanceRef.current = map;
    } catch {
      return;
    }

    const tileConfig = BASEMAP_TILES.terrain;
    baseTileLayerRef.current = L.tileLayer(tileConfig.url, tileConfig.options).addTo(map);

    depotLayerRef.current.addTo(map);
    routesLayerRef.current.addTo(map);
    hazardLayerRef.current.addTo(map);
    outpostLayerRef.current.addTo(map);
    convoyLayerRef.current.addTo(map);
    weatherLayerRef.current.addTo(map);
    aerialLayerRef.current.addTo(map);

    try {
      renderDepots();
      renderRoutes();
      renderHazards();
      renderWeatherHazardZone();
      renderAerialCorridors();
      renderConvoys();
    } catch {
      // Gracefully continue
    }

    L.control.scale({ position: 'bottomright', metric: true, imperial: false }).addTo(map);

    const ro = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        try {
          map.invalidateSize();
        } catch {
          // ignore
        }
      }
    });
    ro.observe(mapContainerRef.current);

    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        try {
          map.invalidateSize();
        } catch {
          // ignore
        }
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    renderOutposts();
  }, [selectedSectorFilter, criticalFilterActive, selectedOutpostId, outposts]);

  useEffect(() => {
    renderRoutes();
    if (blizzardActive && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([34.0500, 78.1800], 9.5, { duration: 1.5 });
    }
  }, [blizzardActive]);

  const renderDepots = () => {
    depotLayerRef.current.clearLayers();
    DEPOTS.forEach(depot => {
      const depotIcon = L.divIcon({
        className: 'tactical-marker-depot',
        html: `
          <div style="background: linear-gradient(135deg, #0284c7, #0369a1); border: 2px solid #38bdf8; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px rgba(56, 189, 248, 0.6); cursor: pointer;">
            <span style="font-size: 16px;">🏛️</span>
          </div>
          <div class="marker-label-tag">${depot.name.split(' - ')[0]}</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([depot.lat, depot.lng], { icon: depotIcon });
      marker.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #38bdf8;">
          <div style="color: #38bdf8; font-weight: 800; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 6px;">${depot.name}</div>
          <div><b>Type:</b> ${depot.type}</div>
          <div><b>Commander:</b> ${depot.commander}</div>
          <div><b>Capacity:</b> ${depot.capacityUsed} of ${depot.capacityTotal}</div>
          <div><b>Fuel Reserve:</b> ${depot.fuelReserve}</div>
          <div style="color: #10b981; font-weight: bold; margin-top: 4px;">Status: ${depot.status}</div>
        </div>
      `);
      depotLayerRef.current.addLayer(marker);
    });
  };

  const renderRoutes = () => {
    routesLayerRef.current.clearLayers();
    SUPPLY_CORRIDORS.forEach(corridor => {
      const isBlocked = corridor.blocked || (blizzardActive && corridor.id === 'corridor-changla');
      const routeColor = isBlocked ? '#ef4444' : corridor.color;
      const polyline = L.polyline(corridor.path, {
        color: routeColor,
        weight: isBlocked || corridor.priority === 'CRITICAL' ? 4 : 2.5,
        opacity: 0.85,
        dashArray: isBlocked ? '8, 8' : undefined
      });

      polyline.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid ${routeColor};">
          <div style="color: ${routeColor}; font-weight: 800; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 6px;">🛣️ ${corridor.name}</div>
          <div><b>Terrain:</b> ${corridor.terrain}</div>
          <div><b>Max Gradient:</b> ${corridor.maxGradient}</div>
          <div><b>Pass Clearance:</b> ${corridor.passClearance}</div>
          <div><b>Transit Status:</b> <span style="color: ${isBlocked ? '#ef4444' : '#10b981'}; font-weight: bold;">${isBlocked ? 'BLOCKED (Avalanche Hazard)' : corridor.status}</span></div>
        </div>
      `);
      routesLayerRef.current.addLayer(polyline);
    });
  };

  const renderHazards = () => {
    hazardLayerRef.current.clearLayers();
    CHOKE_POINTS.forEach(choke => {
      const chokeIcon = L.divIcon({
        className: 'tactical-marker-choke',
        html: `
          <div style="background: ${choke.severity === 'EXTREME' ? '#ef4444' : '#f59e0b'}; border: 2px solid #ffffff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px ${choke.severity === 'EXTREME' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.8)'};">
            <span style="font-size: 13px;">⚠️</span>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([choke.lat, choke.lng], { icon: chokeIcon });
      marker.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #ef4444;">
          <div style="color: #ef4444; font-weight: 800; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 6px;">⚠️ ${choke.name}</div>
          <div><b>Hazard:</b> ${choke.hazardType}</div>
          <div><b>Severity:</b> ${choke.severity}</div>
          <div style="margin-top: 4px; color: #cbd5e1;">${choke.description}</div>
          <div style="color: #38bdf8; margin-top: 6px;">Bypass Available: ${choke.bypassRouteAvailable ? 'YES (Shyok Bypass)' : 'NO'}</div>
        </div>
      `);
      hazardLayerRef.current.addLayer(marker);
    });
  };

  const renderWeatherHazardZone = () => {
    weatherLayerRef.current.clearLayers();
    const blizzardCoordinates: [number, number][] = [
      [35.50, 77.10],
      [35.60, 78.20],
      [35.00, 78.40],
      [34.85, 77.80],
      [35.20, 77.00]
    ];

    const polygon = L.polygon(blizzardCoordinates, {
      color: '#38bdf8',
      fillColor: '#0284c7',
      fillOpacity: 0.18,
      weight: 2,
      dashArray: '5, 8'
    });

    polygon.bindTooltip('<b>❄️ BLIZZARD RADAR WARNING (HQ NORTHERN SECTOR)</b><br>Wind Chill: -28°C | Velocity: 65 km/h', {
      permanent: false,
      direction: 'top'
    });
    weatherLayerRef.current.addLayer(polygon);
  };

  const renderAerialCorridors = () => {
    aerialLayerRef.current.clearLayers();

    const c130FlightPath: [number, number][] = [
      [34.1350, 77.5460],
      [34.7000, 77.7500],
      [35.4022, 77.9297]
    ];

    const c130Line = L.polyline(c130FlightPath, {
      color: '#06b6d4',
      weight: 3.5,
      opacity: 0.9,
      dashArray: '10, 8',
      lineCap: 'round'
    }).addTo(aerialLayerRef.current);

    c130Line.bindPopup(`
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc; background: #082f49; padding: 10px; border-radius: 6px; border: 1px solid #06b6d4;">
        <div style="color: #38bdf8; font-weight: 800; border-bottom: 1px solid #0284c7; padding-bottom: 4px; margin-bottom: 6px;">✈️ IAF C-130J SUPER HERCULES AIR-BRIDGE</div>
        <div><b>Sector:</b> Leh AFS (VILH) ➔ DBO ALG</div>
        <div><b>Altitude Floor:</b> FL-240 (7,200m AMSL)</div>
        <div><b>Delivery System:</b> Heavy Parachute Low-Velocity Drop (LVAD)</div>
        <div><b>Payload Capability:</b> 18.5 Metric Tons Bulk POL & Rations</div>
        <div style="color: #34d399; margin-top: 4px;">✔ Airspace Clear • GPS Vector Locked</div>
      </div>
    `);

    L.circle([35.4022, 77.9297], {
      radius: 3500,
      color: '#06b6d4',
      weight: 2,
      dashArray: '4, 4',
      fillColor: '#06b6d4',
      fillOpacity: 0.12
    }).addTo(aerialLayerRef.current).bindPopup(`
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #f8fafc; background: #0f172a; padding: 8px; border-radius: 4px; border: 1px solid #06b6d4;">
        🎯 <b>DROP ZONE: DBO-DZ-BRAVO</b><br>
        Terrain: Glacial Sand Flats (5,065m)<br>
        Air Delivery Clearance: ACTIVE
      </div>
    `);

    const droneFlightPaths = [
      { path: [[34.5020, 77.6820], [35.1500, 77.2100]] as [number, number][], name: "DRONE-VECTOR-SIACHEN", target: "Siachen Kumar Base" },
      { path: [[34.5020, 77.6820], [34.7800, 78.1800]] as [number, number][], name: "DRONE-VECTOR-GALWAN", target: "Galwan PP-14" }
    ];

    droneFlightPaths.forEach(df => {
      L.polyline(df.path, {
        color: '#e879f9',
        weight: 2.5,
        opacity: 0.85,
        dashArray: '5, 6'
      }).addTo(aerialLayerRef.current).bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #f8fafc; background: #3b0764; padding: 8px; border-radius: 4px; border: 1px solid #e879f9;">
          🛸 <b>AUTONOMOUS LOGISTICS UAV CORRIDOR</b><br>
          Vector: ${df.name}<br>
          Target: ${df.target}<br>
          Mission: Urgent Blood Plasma, HAPE Gamow Bags, Radio Batteries<br>
          Flight Ceiling: 6,000m • Autonomous Waypoint Navigation
        </div>
      `);
    });
  };

  const renderConvoys = () => {
    convoyLayerRef.current.clearLayers();
    ACTIVE_CONVOYS.forEach(convoy => {
      const name = (convoy as any).callsign || (convoy as any).name || 'Convoy';
      const cargo = (convoy as any).cargoType || (convoy as any).cargo || 'Supplies';
      const progress = (convoy as any).progress ?? (convoy as any).progressPct ?? 50;

      const convoyIcon = L.divIcon({
        className: 'tactical-marker-convoy',
        html: `
          <div style="background: #10b981; border: 2px solid #ffffff; width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(16, 185, 129, 0.7); cursor: pointer;">
            <span style="font-size: 14px;">🚚</span>
          </div>
          <div class="marker-label-tag" style="background: rgba(6, 78, 59, 0.95);">${name.split(' ')[0]}</div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([convoy.lat, convoy.lng], { icon: convoyIcon });
      marker.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #10b981;">
          <div style="color: #34d399; font-weight: 800; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 6px;">${name}</div>
          <div><b>Vehicles:</b> ${convoy.vehicles}</div>
          <div><b>Payload:</b> ${cargo}</div>
          <div><b>ETA:</b> ${convoy.eta} (Progress: ${progress}%)</div>
          <div><b>Cargo Temp:</b> ${convoy.tempSensor}</div>
          <div style="color: #10b981; font-weight: bold; margin-top: 4px;">Status: ${convoy.status}</div>
        </div>
      `);
      convoyLayerRef.current.addLayer(marker);
      convoyMarkersRef.current[convoy.id] = marker;
    });
  };

  const renderOutposts = () => {
    outpostLayerRef.current.clearLayers();

    const sourceList = outposts && outposts.length > 0 ? outposts : FORWARD_OUTPOSTS;
    const filtered = sourceList.filter(op => {
      if (criticalFilterActive && op.daysOfSupply >= 4) return false;
      if (selectedSectorFilter === 'SECTOR_SSN') {
        return op.sector.toLowerCase().includes('siachen') || op.sector.toLowerCase().includes('north') || op.sector.toLowerCase().includes('ssn');
      }
      if (selectedSectorFilter === 'SECTOR_DSDBO') {
        return op.sector.toLowerCase().includes('dbo') || op.sector.toLowerCase().includes('ds-dbo') || op.sector.toLowerCase().includes('highway');
      }
      if (selectedSectorFilter === 'SECTOR_CHUSHUL') {
        return op.sector.toLowerCase().includes('chushul') || op.sector.toLowerCase().includes('pangong');
      }
      if (selectedSectorFilter === 'SECTOR_WESTERN') {
        return op.sector.toLowerCase().includes('kargil') || op.sector.toLowerCase().includes('zojila');
      }
      return true;
    });

    filtered.forEach(outpost => {
      let pinColor = '#10b981';
      let shadowColor = 'rgba(16, 185, 129, 0.6)';
      if (outpost.daysOfSupply < 4) {
        pinColor = '#ef4444';
        shadowColor = 'rgba(239, 68, 68, 0.8)';
      } else if (outpost.daysOfSupply < 6) {
        pinColor = '#f59e0b';
        shadowColor = 'rgba(245, 158, 11, 0.7)';
      }

      const isSelected = outpost.id === selectedOutpostId;
      const borderStyle = isSelected ? '3px solid #38bdf8' : '2px solid #ffffff';
      const scale = isSelected ? 'scale(1.2)' : 'scale(1)';

      const outpostIcon = L.divIcon({
        className: 'tactical-marker-outpost',
        html: `
          <div style="transform: ${scale}; transition: transform 0.2s; background: ${pinColor}; border: ${borderStyle}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px ${shadowColor}; cursor: pointer;">
            <span style="font-size: 13px;">🏔️</span>
          </div>
          <div class="marker-label-tag">${outpost.name.split(' (')[0]}</div>
          <div style="font-size: 10px; font-family: 'JetBrains Mono', monospace; color: ${pinColor}; font-weight: bold; background: rgba(0,0,0,0.8); padding: 1px 4px; border-radius: 3px; margin-top: 1px;">
            ${outpost.daysOfSupply} DOS
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([outpost.lat, outpost.lng], { icon: outpostIcon });
      marker.on('click', () => {
        onSelectOutpost(outpost.id);
      });

      marker.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #f8fafc; background: #0f172a; padding: 12px; border-radius: 8px; border: 1.5px solid ${pinColor}; min-width: 220px;">
          <div style="color: ${pinColor}; font-weight: 800; font-size: 13px; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 6px;">${outpost.name}</div>
          <div><b>Sector:</b> ${outpost.sector}</div>
          <div><b>Altitude:</b> ${outpost.altitude}</div>
          <div><b>Garrison:</b> ${outpost.troops} troops</div>
          <div style="margin-top: 4px; padding: 4px; background: rgba(30, 41, 59, 0.6); border-radius: 4px;">
            <b>Days of Supply:</b> <span style="color: ${pinColor}; font-weight: bold;">${outpost.daysOfSupply} Days</span>
          </div>
          <div style="margin-top: 6px; font-size: 11px;">
            <div>• POL (Fuel): ${outpost.supplies.class3_pol.current} / ${outpost.supplies.class3_pol.capacity} L</div>
            <div>• Rations: ${outpost.supplies.class1_rations.current} / ${outpost.supplies.class1_rations.capacity} kg</div>
          </div>
        </div>
      `);

      outpostLayerRef.current.addLayer(marker);
      outpostMarkersRef.current[outpost.id] = marker;
    });
  };

  return (
    <div className="panel map-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b131e', border: 'none', borderRadius: 0, padding: 0 }}>
      {/* Sub-toolbar (Matching Screenshot 2) */}
      <div className="tactical-subtoolbar">
        <div className="tactical-subtoolbar-left">
          {/* Sector Filter Dropdown */}
          <div className="subtoolbar-select-wrapper">
            <select
              className="subtoolbar-sector-select"
              value={selectedSectorFilter}
              onChange={e => {
                const val = e.target.value;
                setSelectedSectorFilter(val);
                if (mapInstanceRef.current) {
                  if (val === 'SECTOR_SSN') mapInstanceRef.current.flyTo([35.15, 77.10], 9.5);
                  else if (val === 'SECTOR_DSDBO') mapInstanceRef.current.flyTo([35.10, 77.85], 9.5);
                  else if (val === 'SECTOR_CHUSHUL') mapInstanceRef.current.flyTo([33.70, 78.60], 9.5);
                  else if (val === 'SECTOR_WESTERN') mapInstanceRef.current.flyTo([34.40, 75.80], 9.5);
                  else mapInstanceRef.current.flyTo([34.50, 77.90], 8.5);
                }
              }}
              title="Filter map outposts by operational sector"
            >
              <option value="ALL">All sectors (14)</option>
              <option value="SECTOR_SSN">SSN &amp; Siachen (102 Bde)</option>
              <option value="SECTOR_DSDBO">DS-DBO Highway (81 Bde)</option>
              <option value="SECTOR_CHUSHUL">Pangong / Chushul (3 Div)</option>
              <option value="SECTOR_WESTERN">Kargil / Zojila (8 Mtn Div)</option>
            </select>
            <span className="subtoolbar-select-arrow">▾</span>
          </div>

          {/* Critical (<4 days) Toggle */}
          <button
            className={`subtoolbar-critical-toggle ${criticalFilterActive ? 'active' : ''}`}
            onClick={() => setCriticalFilterActive(prev => !prev)}
            title="Filter to critical forward outposts with less than 4 days of supply"
          >
            <span className={`critical-radio-circle ${criticalFilterActive ? 'active' : ''}`}></span>
            <span>Critical (&lt;4 days)</span>
          </button>
        </div>

        <div className="tactical-subtoolbar-right">
          {/* Terrain & elevation button */}
          <button
            className={`subtoolbar-action-btn ${showElevation ? 'active' : ''}`}
            onClick={() => {
              if (onToggleElevation) {
                onToggleElevation();
              }
            }}
            title="Toggle high-altitude route elevation cross-section profile"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
            </svg>
            <span>Terrain &amp; elevation</span>
          </button>

          {/* Layers & basemap button */}
          <button
            className={`subtoolbar-action-btn ${isLayersOpen ? 'active' : ''}`}
            onClick={() => setIsLayersOpen(prev => !prev)}
            title="Toggle layers, basemaps, and tactical overlays"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            <span>Layers &amp; basemap</span>
          </button>

          {/* Layers Popover Sheet */}
          <div className={`layers-popover-sheet ${isLayersOpen ? 'open' : ''}`}>
            <div className="popover-header">
              <span>MAP DETAILS &amp; BASEMAP</span>
              <button className="drawer-close-btn" style={{ fontSize: '1.2rem' }} onClick={() => setIsLayersOpen(false)}>&times;</button>
            </div>

            <div style={{ fontFamily: 'inherit', fontSize: '0.74rem', color: '#8098AB', fontWeight: 700 }}>
              SELECT BASEMAP:
            </div>
            <div className="basemap-choice-grid">
              <button
                className={`basemap-choice-btn ${activeBasemap === 'terrain' ? 'active' : ''}`}
                onClick={() => setBasemap('terrain')}
              >
                Terrain Topo
              </button>
              <button
                className={`basemap-choice-btn ${activeBasemap === 'satellite' ? 'active' : ''}`}
                onClick={() => setBasemap('satellite')}
              >
                Satellite Hybrid
              </button>
              <button
                className={`basemap-choice-btn ${activeBasemap === 'dark' ? 'active' : ''}`}
                onClick={() => setBasemap('dark')}
              >
                Dark Tactical
              </button>
              <button
                className={`basemap-choice-btn ${activeBasemap === 'street' ? 'active' : ''}`}
                onClick={() => setBasemap('street')}
              >
                Street View
              </button>
            </div>

            <div style={{ fontFamily: 'inherit', fontSize: '0.74rem', color: '#8098AB', fontWeight: 700, marginTop: '6px' }}>
              TACTICAL OVERLAYS:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="layer-toggle-row">
                <span>Blizzard Weather Radar</span>
                <input type="checkbox" checked={layerVisibility.weather} onChange={() => toggleLayer('weather')} />
              </label>
              <label className="layer-toggle-row">
                <span>Supply Routes &amp; Passes</span>
                <input type="checkbox" checked={layerVisibility.routes} onChange={() => toggleLayer('routes')} />
              </label>
              <label className="layer-toggle-row">
                <span>Choke Points &amp; Hazards</span>
                <input type="checkbox" checked={layerVisibility.hazards} onChange={() => toggleLayer('hazards')} />
              </label>
              <label className="layer-toggle-row">
                <span>Moving Convoy GPS</span>
                <input type="checkbox" checked={layerVisibility.convoys} onChange={() => toggleLayer('convoys')} />
              </label>
              <label className="layer-toggle-row">
                <span>IAF C-130J &amp; Drone Corridors</span>
                <input type="checkbox" checked={layerVisibility.aerial} onChange={() => toggleLayer('aerial')} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div id="tactical-map" ref={mapContainerRef} style={{ width: '100%', flex: 1, minHeight: '340px' }}></div>
    </div>
  );
});

TacticalMap.displayName = 'TacticalMap';
