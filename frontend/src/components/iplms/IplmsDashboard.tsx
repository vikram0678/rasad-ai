import React, { useState, useEffect, useCallback } from 'react';
import { IplmsHeader } from './IplmsHeader';
import { IplmsKpiRibbon } from './IplmsKpiRibbon';
import { IplmsMap } from './IplmsMap';
import { IplmsIncidentsPanel } from './IplmsIncidentsPanel';
import { IplmsInventoryChart } from './IplmsInventoryChart';
import { IplmsDemandForecast } from './IplmsDemandForecast';
import { IplmsFleetAndDispatches } from './IplmsFleetAndDispatches';
import { IplmsBottomPanels } from './IplmsBottomPanels';
import { IPLMS_INCIDENTS, IplmsIncident, IplmsSupplyNode } from '../../data/iplmsData';
import { tacticalAudio } from '../../utils/audio';
import { RasadTourModal } from '../tour/RasadTourModal';

// Dedicated Views for Tabs 2 to 10
import { IplmsFullMapView } from './views/IplmsFullMapView';
import { IplmsIncidentsView } from './views/IplmsIncidentsView';
import { IplmsInventoryView } from './views/IplmsInventoryView';
import { IplmsDemandForecastView } from './views/IplmsDemandForecastView';
import { IplmsFleetView } from './views/IplmsFleetView';
import { IplmsRoutePlanningView } from './views/IplmsRoutePlanningView';
import { IplmsWhatIfView } from './views/IplmsWhatIfView';
import { IplmsCopilotView } from './views/IplmsCopilotView';
import { IplmsReportsView } from './views/IplmsReportsView';

interface IplmsDashboardProps {
  onNotify?: (msg: string) => void;
  onOpenPlanner?: () => void;
  onOpenDemandTab?: () => void;
  onOpenTelemetry?: () => void;
}

export const IplmsDashboard: React.FC<IplmsDashboardProps> = ({
  onNotify,
  onOpenPlanner,
  onOpenDemandTab,
  onOpenTelemetry
}) => {
  // Navigation & Search state (11 distinct C4ISR tabs)
  type NavItem =
    | 'dashboard'
    | 'map'
    | 'incidents'
    | 'inventory'
    | 'forecast'
    | 'fleet'
    | 'routes'
    | 'simulator'
    | 'assistant'
    | 'reports'
    | 'settings';

  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected incident & Node
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('inc-01');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('post-charlie');
  const [approvedIncidents, setApprovedIncidents] = useState<Set<string>>(new Set(['inc-03']));

  // Handle selecting an incident from table
  const handleSelectIncident = (inc: IplmsIncident) => {
    setSelectedIncidentId(inc.id);
    setSelectedNodeId(inc.locationId);
    tacticalAudio.playBlip();
  };

  // Handle selecting a node from Map
  const handleSelectNode = (node: IplmsSupplyNode) => {
    setSelectedNodeId(node.id);
    const matchedInc = IPLMS_INCIDENTS.find(i => i.locationId === node.id);
    if (matchedInc) {
      setSelectedIncidentId(matchedInc.id);
    }
    tacticalAudio.playBlip();
  };

  // Human-in-the-loop Approve Dispatch action
  const handleApproveDispatch = (incidentId: string) => {
    const inc = IPLMS_INCIDENTS.find(i => i.id === incidentId);
    const next = new Set(approvedIncidents);

    if (next.has(incidentId)) {
      next.delete(incidentId);
      onNotify?.(`DISPATCH REVOKED: Resupply directive for ${inc?.locationName ?? incidentId} reset to pending.`);
    } else {
      next.add(incidentId);
      tacticalAudio.playSonar();
      onNotify?.(`✓ DISPATCH AUTHORIZED: Resupply convoy for ${inc?.locationName ?? incidentId} approved. Fleet assets allocated.`);
    }
    setApprovedIncidents(next);
  };

  const handleNavClick = (nav: NavItem) => {
    setActiveNav(nav);
    tacticalAudio.playBlip();
  };

  // Interactive Guided Operational Tour state (Vigiflood template)
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);

  const startTour = useCallback(() => {
    setActiveNav('dashboard');
    setTourStep(0);
    setIsTourOpen(true);
    tacticalAudio.playSonar();
  }, []);

  const closeTour = useCallback(() => {
    setIsTourOpen(false);
    setTourStep(0);
  }, []);

  // Listen to global tour launch event (e.g. from hotkeys, copilot or header)
  useEffect(() => {
    const handleGlobalTour = () => startTour();
    window.addEventListener('rasad-start-tour', handleGlobalTour);
    return () => window.removeEventListener('rasad-start-tour', handleGlobalTour);
  }, [startTour]);

  return (
    <div className="iplms-app-wrapper">
      {/* 1. TOP HEADER */}
      <IplmsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onStartTour={startTour}
        onNotificationClick={() =>
          onNotify?.('13 Active logistics incidents across Ladakh theatre. 3 critical shortages require attention.')
        }
        incidentCount={13 - approvedIncidents.size}
      />

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN WORKSPACE */}
      <div className="iplms-body-layout">
        {/* Left Navigation Sidebar */}
        <aside className="iplms-sidebar">
          {/* 1. Dashboard */}
          <button
            className={`iplms-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
            title="Executive C4ISR Overview"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Dashboard</span>
          </button>

          {/* 2. Operational Map */}
          <button
            className={`iplms-nav-item ${activeNav === 'map' ? 'active' : ''}`}
            onClick={() => handleNavClick('map')}
            title="Full Tactical GIS Map"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            <span>Operational Map</span>
          </button>

          {/* 3. Incidents */}
          <button
            className={`iplms-nav-item ${activeNav === 'incidents' ? 'active' : ''}`}
            onClick={() => handleNavClick('incidents')}
            title="13 Active Supply Shortages"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Incidents</span>
            <span className="iplms-nav-badge">13</span>
          </button>

          {/* 4. Inventory */}
          <button
            className={`iplms-nav-item ${activeNav === 'inventory' ? 'active' : ''}`}
            onClick={() => handleNavClick('inventory')}
            title="Class I-V Military Stock Ledger"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>Inventory</span>
          </button>

          {/* 5. Demand Forecast */}
          <button
            className={`iplms-nav-item ${activeNav === 'forecast' ? 'active' : ''}`}
            onClick={() => handleNavClick('forecast')}
            title="7-Day Predictive Consumption Engine"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span>Demand Forecast</span>
          </button>

          {/* 6. Fleet Management */}
          <button
            className={`iplms-nav-item ${activeNav === 'fleet' ? 'active' : ''}`}
            onClick={() => handleNavClick('fleet')}
            title="144 Tactical Transport Assets"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span>Fleet Management</span>
          </button>

          {/* 7. Route Planning */}
          <button
            className={`iplms-nav-item ${activeNav === 'routes' ? 'active' : ''}`}
            onClick={() => handleNavClick('routes')}
            title="Multi-Corridor Mountain Pass Routing"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="6" cy="19" r="3" />
              <path d="M9 19h8.5a4.5 4.5 0 0 0 4.5-4.5v0a4.5 4.5 0 0 0-4.5-4.5H11" />
              <circle cx="18" cy="5" r="3" />
            </svg>
            <span>Route Planning</span>
          </button>

          {/* 8. What-If Simulator */}
          <button
            className={`iplms-nav-item ${activeNav === 'simulator' ? 'active' : ''}`}
            onClick={() => handleNavClick('simulator')}
            title="Contingency & Pass Closure Wargaming"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>What-If Simulator</span>
          </button>

          {/* 9. AI Assistant (Copilot) */}
          <button
            className={`iplms-nav-item ${activeNav === 'assistant' ? 'active' : ''}`}
            onClick={() => handleNavClick('assistant')}
            title="Air-Gapped Logistics Copilot"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
              <rect x="4" y="8" width="16" height="12" rx="2" />
              <circle cx="9" cy="13" r="1.5" />
              <circle cx="15" cy="13" r="1.5" />
            </svg>
            <span>AI Assistant</span>
          </button>

          {/* 10. Reports */}
          <button
            className={`iplms-nav-item ${activeNav === 'reports' ? 'active' : ''}`}
            onClick={() => handleNavClick('reports')}
            title="14 Corps Mission Readiness Analytics"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Reports</span>
          </button>

          {/* 11. Settings */}
          <button
            className={`iplms-nav-item ${activeNav === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('settings')}
            title="C4ISR System Settings & Cryptographic Keying"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Settings</span>
          </button>
        </aside>

        {/* Main Content Area - Render Active View */}
        <main className="iplms-main-content">
          {activeNav === 'dashboard' && (
            <>
              {/* Top 6 KPI Metric Cards */}
              <div id="tour-kpi-ribbon">
                <IplmsKpiRibbon
                  onCardClick={(kpiKey) => {
                    if (kpiKey === 'shortages' || kpiKey === 'incidents') {
                      setSelectedIncidentId('inc-01');
                    }
                    onNotify?.(`Filter applied: ${kpiKey.toUpperCase()}`);
                  }}
                />
              </div>

              {/* Middle Row: Tactical Map (Left) + Incidents Panel (Right) */}
              <div className="iplms-middle-grid">
                <div id="tour-tactical-map" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
                  <IplmsMap
                    selectedNodeId={selectedNodeId}
                    onSelectNode={handleSelectNode}
                    onSelectIncidentByLocation={(locId) => {
                      const inc = IPLMS_INCIDENTS.find(i => i.locationId === locId);
                      if (inc) setSelectedIncidentId(inc.id);
                    }}
                  />
                </div>

                <div id="tour-incidents-panel" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
                  <IplmsIncidentsPanel
                    selectedIncidentId={selectedIncidentId}
                    onSelectIncident={handleSelectIncident}
                    onApproveDispatch={handleApproveDispatch}
                    approvedIncidentIds={approvedIncidents}
                  />
                </div>
              </div>

              {/* Strategic Analytics Row: Inventory Status & Demand Forecast */}
              <div className="iplms-charts-row">
                {/* 1. Inventory Status */}
                <div id="tour-inventory-chart" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: '1 1 0' }}>
                  <IplmsInventoryChart
                    onSelectNodeByName={(name) => {
                      const inc = IPLMS_INCIDENTS.find(i => i.locationName.toLowerCase().includes(name.toLowerCase()));
                      if (inc) {
                        setSelectedIncidentId(inc.id);
                        setSelectedNodeId(inc.locationId);
                      }
                    }}
                  />
                </div>

                {/* 2. Demand Forecast Dual-Curve */}
                <div id="tour-forecast-chart" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: '1 1 0' }}>
                  <IplmsDemandForecast selectedLocationId={selectedNodeId} />
                </div>
              </div>

              {/* Bottom 4-Card Command Row: Fleet Allocation, Dispatches, What-If Simulator, Network Resilience */}
              <div id="tour-bottom-panels">
                <IplmsBottomPanels
                  onViewAllFleet={() => handleNavClick('fleet')}
                  onViewAllDispatches={() => handleNavClick('routes')}
                  onOpenSimulatorTab={() => handleNavClick('simulator')}
                  onNotify={onNotify}
                />
              </div>
            </>
          )}

          {activeNav === 'map' && (
            <IplmsFullMapView
              onSelectNode={handleSelectNode}
              onSelectIncident={(locId) => setSelectedNodeId(locId)}
            />
          )}

          {activeNav === 'incidents' && (
            <IplmsIncidentsView
              onSelectIncident={handleSelectIncident}
              onApproveDispatch={handleApproveDispatch}
            />
          )}

          {activeNav === 'inventory' && <IplmsInventoryView />}

          {activeNav === 'forecast' && <IplmsDemandForecastView />}

          {activeNav === 'fleet' && <IplmsFleetView />}

          {activeNav === 'routes' && <IplmsRoutePlanningView />}

          {activeNav === 'simulator' && <IplmsWhatIfView />}

          {activeNav === 'assistant' && <IplmsCopilotView />}

          {activeNav === 'reports' && <IplmsReportsView />}

          {activeNav === 'settings' && (
            <div className="iplms-panel-card iplms-p-4" style={{ maxWidth: '600px', margin: '20px auto' }}>
              <div className="iplms-panel-title-row" style={{ marginBottom: '16px' }}>
                <h4 className="iplms-panel-title">C4ISR Cryptographic &amp; Network Settings</h4>
                <span className="airgap-pill-badge">TOP SECRET // LEH COMMAND</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>SATCOM Ku-Band Carrier Frequency:</span>
                  <strong className="cell-mono" style={{ color: '#38bdf8' }}>14.250 GHz (Primary)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Air-Gap Mode:</span>
                  <strong style={{ color: '#10b981' }}>ENFORCED (No External WAN Outbound)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Tactical Audio Alerts:</span>
                  <strong style={{ color: '#10b981' }}>ENABLED (Synthetic Sonar &amp; Radar Pings)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Corps Area of Responsibility:</span>
                  <strong>HQ 14 Corps (Fire &amp; Fury, Ladakh)</strong>
                </div>
                <button
                  className="iplms-action-btn primary"
                  style={{ marginTop: '10px' }}
                  onClick={() => onNotify?.('Cryptographic keys validated. All 28 nodes synced.')}
                >
                  Verify Cryptographic Hashes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 🌟 Interactive Guided Operational Tour Modal (Illuminated Spotlight & HUD) */}
      <RasadTourModal
        isOpen={isTourOpen}
        onClose={closeTour}
        tourStep={tourStep}
        setTourStep={setTourStep}
      />
    </div>
  );
};
