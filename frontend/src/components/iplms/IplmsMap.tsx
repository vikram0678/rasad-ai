import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { IPLMS_NODES, IPLMS_ROUTES, IplmsSupplyNode } from '../../data/iplmsData';

interface IplmsMapProps {
  selectedNodeId?: string;
  onSelectNode: (node: IplmsSupplyNode) => void;
  onSelectIncidentByLocation?: (locationId: string) => void;
}

type BasemapKey = 'hybrid' | 'satellite' | 'terrain' | 'dark';

const BASEMAP_TILES: Record<BasemapKey, { name: string; url: string; options: L.TileLayerOptions }> = {
  hybrid: {
    name: 'Satellite + Places',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    options: { maxZoom: 18, attribution: 'Google Hybrid Satellite & Place Names' }
  },
  satellite: {
    name: 'Raw Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 18, attribution: 'Esri Satellite Imagery' }
  },
  terrain: {
    name: 'Tactical Topo',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 18, attribution: 'Esri World Topo' }
  },
  dark: {
    name: 'C2 Dark Ops',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    options: { maxZoom: 19, subdomains: 'abcd', attribution: 'CartoDB Dark' }
  }
};

const REFERENCE_OVERLAYS = {
  places: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 18, zIndex: 350, attribution: 'Esri Boundaries & Place Names' }
  },
  roads: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 18, zIndex: 350, attribution: 'Esri Passes & Corridors' }
  }
};

export const IplmsMap: React.FC<IplmsMapProps> = ({
  selectedNodeId = 'post-charlie',
  onSelectNode,
  onSelectIncidentByLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  const nodesLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const routesLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const weatherLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const labelsLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const nodeMarkersRef = useRef<Record<string, L.Marker>>({});

  const [activeBasemap, setActiveBasemap] = useState<BasemapKey>('hybrid');
  const [showPlaceNames, setShowPlaceNames] = useState<boolean>(true);
  const [isLayersMenuOpen, setIsLayersMenuOpen] = useState<boolean>(false);
  const [showWeatherLayer, setShowWeatherLayer] = useState<boolean>(false);
  const [showRoutesLayer, setShowRoutesLayer] = useState<boolean>(false);
  const [showNodesLayer, setShowNodesLayer] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(true);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Ladakh Theatre Center Coordinates
    const map = L.map(mapContainerRef.current, {
      center: [33.85, 76.6],
      zoom: 7,
      minZoom: 6,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    // Add Base Tile Layer (Default Hybrid Satellite + Place Names)
    const baseTile = L.tileLayer(BASEMAP_TILES.hybrid.url, BASEMAP_TILES.hybrid.options);
    baseTile.addTo(map);
    baseTileLayerRef.current = baseTile;

    // Add Feature Layers
    routesLayerRef.current.addTo(map);
    labelsLayerRef.current.addTo(map);
    nodesLayerRef.current.addTo(map);
    weatherLayerRef.current.addTo(map);

    mapInstanceRef.current = map;

    // Force size calculation
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Switch Basemaps (Hybrid vs Satellite vs Terrain vs Dark)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (baseTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(baseTileLayerRef.current);
    }
    const tileConfig = BASEMAP_TILES[activeBasemap] || BASEMAP_TILES.hybrid;
    const newTile = L.tileLayer(tileConfig.url, tileConfig.options);
    newTile.addTo(mapInstanceRef.current);
    newTile.bringToBack();
    baseTileLayerRef.current = newTile;
  }, [activeBasemap]);

  // 2b. Geographic Place Names & Passes Reference Overlay Effect
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    labelsLayerRef.current.clearLayers();

    // If place names enabled and not on Google Hybrid (which already has embedded vector names)
    // Add transparent Esri Boundaries, Towns & Passes reference layers
    if (showPlaceNames && activeBasemap !== 'hybrid') {
      const placesLayer = L.tileLayer(REFERENCE_OVERLAYS.places.url, REFERENCE_OVERLAYS.places.options);
      const roadsLayer = L.tileLayer(REFERENCE_OVERLAYS.roads.url, REFERENCE_OVERLAYS.roads.options);
      labelsLayerRef.current.addLayer(placesLayer);
      labelsLayerRef.current.addLayer(roadsLayer);
    }
  }, [showPlaceNames, activeBasemap]);

  const handleTogglePlaceNames = () => {
    setShowPlaceNames(prev => {
      const next = !prev;
      if (!next && activeBasemap === 'hybrid') {
        setActiveBasemap('satellite'); // Switch to raw satellite with zero labels
      } else if (next && activeBasemap === 'satellite') {
        setActiveBasemap('hybrid'); // Switch to hybrid with places
      }
      return next;
    });
  };

  // 3. Render Nodes & Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    nodesLayerRef.current.clearLayers();
    nodeMarkersRef.current = {};

    if (!showNodesLayer) return;

    IPLMS_NODES.forEach((node) => {
      const isSelected = node.id === selectedNodeId;
      let html = '';

      if (node.role === 'base') {
        html = `
          <div class="leaflet-node-marker node-base ${isSelected ? 'selected' : ''}">
            <div class="marker-square"></div>
            <div class="marker-label">
              <span class="m-name">${node.name}</span>
              <span class="m-stock stock-healthy">${node.stockPercent}% stock</span>
            </div>
          </div>
        `;
      } else if (node.role === 'depot') {
        const stockClass = node.stockPercent < 50 ? 'stock-caution' : 'stock-healthy';
        html = `
          <div class="leaflet-node-marker node-depot ${isSelected ? 'selected' : ''}">
            <div class="marker-triangle">▲</div>
            <div class="marker-label">
              <span class="m-name">${node.name}</span>
              <span class="m-stock ${stockClass}">${node.stockPercent}% stock</span>
            </div>
          </div>
        `;
      } else {
        // Forward Post
        const isCrit = node.status === 'critical';
        const isLow = node.status === 'low';
        const postClass = isCrit ? 'post-critical' : isLow ? 'post-low' : 'post-ok';
        const tag = isCrit ? 'Critical' : isLow ? 'Low Stock' : 'OK';

        html = `
          <div class="leaflet-node-marker node-post ${postClass} ${isSelected ? 'selected' : ''}">
            <div class="marker-circle">
              ${isCrit ? '<span class="pulse-ring"></span>' : ''}
            </div>
            <div class="marker-label">
              <span class="m-name">${node.name}</span>
              <span class="m-tag ${postClass}">${tag}</span>
            </div>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        className: 'iplms-div-icon',
        html,
        iconSize: [110, 36],
        iconAnchor: [55, 18]
      });

      const marker = L.marker([node.lat, node.lng], { icon: customIcon });
      marker.on('click', () => {
        onSelectNode(node);
        onSelectIncidentByLocation?.(node.id);
        mapInstanceRef.current?.panTo([node.lat, node.lng], { animate: true, duration: 0.8 });
      });

      marker.addTo(nodesLayerRef.current);
      nodeMarkersRef.current[node.id] = marker;
    });
  }, [selectedNodeId, showNodesLayer, onSelectNode, onSelectIncidentByLocation]);

  // 4. Render Routes & Corridors
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    routesLayerRef.current.clearLayers();

    if (!showRoutesLayer) return;

    const nodeLookup = new Map<string, IplmsSupplyNode>();
    IPLMS_NODES.forEach(n => nodeLookup.set(n.id, n));

    IPLMS_ROUTES.forEach((route) => {
      const from = nodeLookup.get(route.fromId);
      const to = nodeLookup.get(route.toId);
      if (!from || !to) return;

      const isBlocked = route.status === 'blocked';
      const isCaution = route.status === 'caution';

      const color = isBlocked ? '#ef4444' : isCaution ? '#f59e0b' : '#10b981';
      const dashArray = isCaution ? '6, 6' : undefined;
      const weight = isBlocked ? 4.5 : isCaution ? 3.5 : 3.5;

      // Realistic mountain curvature midpoint
      const midLat = (from.lat + to.lat) / 2 + (from.lng > to.lng ? 0.08 : -0.08);
      const midLng = (from.lng + to.lng) / 2 + (from.lat > to.lat ? -0.10 : 0.10);

      const latlngs: L.LatLngExpression[] = [
        [from.lat, from.lng],
        [midLat, midLng],
        [to.lat, to.lng]
      ];

      // Outer tactical glow line
      L.polyline(latlngs, {
        color,
        weight: weight + 3,
        opacity: 0.25,
        interactive: false
      }).addTo(routesLayerRef.current);

      // Core line
      const poly = L.polyline(latlngs, {
        color,
        weight,
        opacity: 0.95,
        dashArray
      });

      poly.bindTooltip(
        `<b>${route.name}</b><br/>Status: <span style="color:${color};font-weight:700">${route.status.toUpperCase()}</span><br/>Distance: ${route.distanceKm} km · Terrain: ${route.terrainDifficulty}`,
        { className: 'iplms-route-tooltip' }
      );

      poly.addTo(routesLayerRef.current);

      // If route is blocked, add the Landslide Hazard Pin
      if (isBlocked && route.id === 'route-kargil-leh') {
        const hazardIcon = L.divIcon({
          className: 'iplms-hazard-icon',
          html: `
            <div class="leaflet-hazard-badge">
              <span class="hazard-x">✕</span>
              <span class="hazard-txt">Route Blocked<br/><strong>Landslide</strong></span>
            </div>
          `,
          iconSize: [120, 32],
          iconAnchor: [60, 16]
        });

        L.marker([midLat, midLng], { icon: hazardIcon })
          .addTo(routesLayerRef.current)
          .bindPopup('<b>NH-1D Kargil-Leh Blockade</b><br/>Active debris flow at Km 114. Clearance taskforce dispatched.');
      }
    });
  }, [showRoutesLayer]);

  // 5. Render Weather Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    weatherLayerRef.current.clearLayers();

    if (!showWeatherLayer) return;

    // High altitude snow storm zone over Dras-Kargil axis
    const snowZone = L.polygon(
      [
        [34.8, 75.2],
        [34.7, 76.6],
        [34.1, 76.4],
        [34.2, 75.0]
      ],
      {
        color: '#60a5fa',
        fillColor: 'rgba(96, 165, 250, 0.18)',
        fillOpacity: 0.2,
        weight: 1.5,
        dashArray: '4, 4'
      }
    );

    snowZone.bindTooltip('❄️ Heavy Snow Corridor (-8°C, Wind 40 km/h) · Pass Closure Warning', { sticky: true });
    snowZone.addTo(weatherLayerRef.current);
  }, [showWeatherLayer]);

  // Pan to selected node when selectedNodeId changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const targetNode = IPLMS_NODES.find(n => n.id === selectedNodeId);
    if (targetNode) {
      mapInstanceRef.current.panTo([targetNode.lat, targetNode.lng], { animate: true, duration: 0.8 });
    }
  }, [selectedNodeId]);

  // Handle Fullscreen toggle
  const handleToggleFullscreen = () => {
    setIsFullscreen(p => !p);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetTheatre = () => {
    mapInstanceRef.current?.fitBounds([
      [32.2, 74.5],
      [34.9, 78.5]
    ], { padding: [20, 20] });
  };

  return (
    <div className={`iplms-map-card ${isFullscreen ? 'map-fullscreen' : ''}`}>
      {/* Map Header */}
      <div className="iplms-map-header">
        <div className="iplms-map-title-block">
          <h3 className="iplms-map-heading">Operational Map</h3>
          <p className="iplms-map-subheading">Supply Network, Live Status &amp; Multiple Incident View</p>
        </div>

        {/* Tactical Layer Controls matching Screenshot */}
        <div className="iplms-map-controls">
          <div className="iplms-map-layer-dropdown">
            <button
              className="iplms-map-btn"
              onClick={() => {
                setActiveBasemap(prev => (prev === 'satellite' ? 'terrain' : prev === 'terrain' ? 'dark' : 'satellite'));
              }}
              title="Select Base Layer"
            >
              <span>All Layers</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          <button
            className={`iplms-map-btn ${activeBasemap === 'terrain' ? 'active' : ''}`}
            onClick={() => setActiveBasemap(prev => (prev === 'terrain' ? 'satellite' : 'terrain'))}
            title="Digital Elevation Model Terrain"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
            <span>Terrain</span>
          </button>

          <button
            className={`iplms-map-btn ${showWeatherLayer ? 'active' : ''}`}
            onClick={() => setShowWeatherLayer(p => !p)}
            title="Toggle Live Severe Weather Layer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              <line x1="8" y1="19" x2="8" y2="21" />
              <line x1="12" y1="19" x2="12" y2="21" />
              <line x1="16" y1="19" x2="16" y2="21" />
            </svg>
            <span>Weather</span>
          </button>

          <button
            className={`iplms-map-btn ${showRoutesLayer ? 'active' : ''}`}
            onClick={() => setShowRoutesLayer(p => !p)}
            title="Toggle Supply Routes & Corridors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="2" fill="currentColor" />
              <circle cx="5" cy="18" r="2" fill="currentColor" />
              <circle cx="19" cy="18" r="2" fill="currentColor" />
              <path d="M12 7v5M7 17l4-4M17 17l-4-4" />
            </svg>
            <span>Route Status</span>
          </button>

          <button
            className={`iplms-map-btn ${showNodesLayer ? 'active' : ''}`}
            onClick={() => setShowNodesLayer(p => !p)}
            title="Toggle Bases, Depots and Posts"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L22 12L12 22L2 12Z" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            </svg>
            <span>Supply Nodes</span>
          </button>

          <button
            className={`iplms-map-btn icon-only ${isFullscreen ? 'active' : ''}`}
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen Theatre View"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div className="iplms-map-viewport">
        {/* Leaflet GIS Map Container */}
        <div ref={mapContainerRef} className="iplms-leaflet-container" style={{ width: '100%', height: '100%' }}></div>

        {/* Floating Top-Left Tactical Map Legend: 3 Distinct Sections (Collapsible) */}
        {isLegendOpen ? (
          <div className="iplms-map-legend-group">
            {/* Header toggle bar to collapse */}
            <div className="iplms-legend-top-bar">
              <span className="legend-top-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <circle cx="4" cy="6" r="1.5" fill="currentColor" />
                  <circle cx="4" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="4" cy="18" r="1.5" fill="currentColor" />
                </svg>
                <span>Legend</span>
              </span>
              <button
                className="iplms-legend-collapse-btn"
                onClick={() => setIsLegendOpen(false)}
                title="Collapse Legend"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>

            {/* Section 1: Supply Nodes */}
            <div className="iplms-legend-card">
              <div className="legend-row">
                <span className="legend-icon icon-square-blue"></span>
                <span className="legend-text">Base Hub</span>
              </div>
              <div className="legend-row">
                <span className="legend-icon icon-tri-yellow">▲</span>
                <span className="legend-text">Intermediate Depot</span>
              </div>
              <div className="legend-row">
                <span className="legend-icon icon-circle-green"></span>
                <span className="legend-text">Forward Post</span>
              </div>
              <div className="legend-row">
                <span className="legend-icon icon-circle-red"></span>
                <span className="legend-text">Critical Post</span>
              </div>
            </div>

            {/* Section 2: Route Statuses */}
            <div className="iplms-legend-card">
              <div className="legend-row">
                <span className="legend-route-line line-open">
                  <span></span><span></span>
                </span>
                <span className="legend-text">Open Route</span>
              </div>
              <div className="legend-row">
                <span className="legend-route-line line-caution">
                  <span></span><span></span>
                </span>
                <span className="legend-text">Caution Route</span>
              </div>
              <div className="legend-row">
                <span className="legend-route-line line-blocked">
                  <span></span><span></span><span></span>
                </span>
                <span className="legend-text">Blocked Route</span>
              </div>
            </div>

            {/* Section 3: Hazard Markers */}
            <div className="iplms-legend-card">
              <div className="legend-row">
                <svg className="hazard-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span className="legend-text">Landslide</span>
              </div>
              <div className="legend-row">
                <svg className="hazard-svg" width="14" height="14" viewBox="0 0 24 24" fill="#93c5fd">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#93c5fd" />
                  <path d="m8 20-1 2m5-2-1 2m5-2-1 2" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="legend-text">Heavy Snow</span>
              </div>
              <div className="legend-row">
                <svg className="hazard-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 13c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
                  <path d="M2 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
                </svg>
                <span className="legend-text">Flood Risk</span>
              </div>
              <div className="legend-row">
                <svg className="hazard-svg" width="14" height="14" viewBox="0 0 24 24" fill="#f43f5e" stroke="#f43f5e">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" fill="#f43f5e" />
                  <line x1="12" y1="9" x2="12" y2="13" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="17" r="1" fill="#ffffff" />
                </svg>
                <span className="legend-text">Adverse Weather</span>
              </div>
            </div>
          </div>
        ) : (
          /* Collapsed State: Small button indicating the symbol */
          <button
            className="iplms-legend-pill-trigger"
            onClick={() => setIsLegendOpen(true)}
            title="Expand Tactical Legend"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="4" cy="6" r="1.5" fill="currentColor" />
              <circle cx="4" cy="12" r="1.5" fill="currentColor" />
              <circle cx="4" cy="18" r="1.5" fill="currentColor" />
            </svg>
            <span>Legend</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}

        {/* Bottom-Right Tactical Controls (Matching Screenshot: Zoom Pill, Point, Layers, Weather) */}
        <div className="iplms-map-bottom-right-controls">
          {/* Zoom Pill (+ on top, - on bottom with divider) */}
          <div className="iplms-map-zoom-pill">
            <button className="iplms-map-pill-btn" onClick={handleZoomIn} title="Zoom In">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <div className="iplms-pill-divider"></div>
            <button className="iplms-map-pill-btn" onClick={handleZoomOut} title="Zoom Out">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Point / Recenter Button (Target Crosshair) */}
          <button className="iplms-map-icon-btn" onClick={handleResetTheatre} title="Point / Recenter Theatre">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="7" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
            </svg>
          </button>

          {/* Place Names & Pass Labels Filter Toggle */}
          <button
            className={`iplms-map-icon-btn ${showPlaceNames ? 'active' : ''}`}
            onClick={handleTogglePlaceNames}
            title={showPlaceNames ? "Geographic Place Names: Visible (Click to Hide)" : "Geographic Place Names: Hidden (Click to Show)"}
            style={showPlaceNames ? { background: '#122e4d', borderColor: '#3b82f6', color: '#60a5fa' } : { opacity: 0.65 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" fill="currentColor" fillOpacity={showPlaceNames ? "0.35" : "0"} />
            </svg>
          </button>

          {/* Layers Button with Tactical Basemap Selection Popup */}
          <div style={{ position: 'relative' }}>
            <button
              className={`iplms-map-icon-btn ${isLayersMenuOpen ? 'active' : ''}`}
              onClick={() => setIsLayersMenuOpen(prev => !prev)}
              title={`Basemap: ${BASEMAP_TILES[activeBasemap]?.name || activeBasemap} (Click to change)`}
              style={isLayersMenuOpen ? { background: '#122e4d', borderColor: '#3b82f6', color: '#60a5fa' } : {}}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" fill="currentColor" fillOpacity="0.25" />
                <polyline points="2 12 12 17 22 12" />
                <polyline points="2 17 12 22 22 17" />
              </svg>
            </button>

            {isLayersMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '40px',
                  right: 0,
                  background: 'rgba(9, 19, 34, 0.95)',
                  border: '1px solid #1a324f',
                  borderRadius: '8px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  minWidth: '165px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.85)',
                  backdropFilter: 'blur(8px)',
                  zIndex: 1000
                }}
              >
                <div style={{ padding: '3px 8px', fontSize: '10px', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Basemap View
                </div>
                {(Object.keys(BASEMAP_TILES) as BasemapKey[]).map((key) => {
                  const isActive = activeBasemap === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveBasemap(key);
                        setIsLayersMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        background: isActive ? '#173456' : 'transparent',
                        color: isActive ? '#60a5fa' : '#cbd5e1',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: isActive ? 600 : 400,
                        textAlign: 'left',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <span>{BASEMAP_TILES[key].name}</span>
                      {isActive && <span style={{ color: '#38bdf8', fontSize: '11px' }}>●</span>}
                    </button>
                  );
                })}
                <div style={{ height: '1px', background: '#1a324f', margin: '4px 0' }} />
                <button
                  onClick={() => {
                    handleTogglePlaceNames();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    background: showPlaceNames ? '#0f2942' : 'transparent',
                    color: showPlaceNames ? '#38bdf8' : '#94a3b8',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 500,
                    textAlign: 'left'
                  }}
                >
                  <span>🏷️ Place Names Filter</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: showPlaceNames ? '#22c55e' : '#64748b' }}>
                    {showPlaceNames ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Weather Callout Card */}
          <div className="iplms-weather-card">
            <div className="weather-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17.5 15.5H8.5a4.5 4.5 0 1 1 .9-8.9A5.5 5.5 0 0 1 19 9.5a3.5 3.5 0 0 1-1.5 6Z" fill="#5b88c7" />
                <circle cx="8" cy="18.5" r="1" fill="#7ba5e4" />
                <circle cx="12" cy="18.5" r="1" fill="#7ba5e4" />
                <circle cx="16" cy="18.5" r="1" fill="#7ba5e4" />
                <circle cx="10" cy="21" r="1" fill="#7ba5e4" />
                <circle cx="14" cy="21" r="1" fill="#7ba5e4" />
              </svg>
            </div>
            <div className="weather-card-content">
              <div className="weather-card-title">Heavy Snow</div>
              <div className="weather-card-stats">
                <span className="weather-temp">-8°C</span>
                <span className="weather-stat-divider">|</span>
                <span className="weather-wind">Wind 40 km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
