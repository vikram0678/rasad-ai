import React, { useState, useEffect } from 'react';
import { tacticalAudio } from '../../utils/audio';

interface IplmsBottomPanelsProps {
  onViewAllFleet?: () => void;
  onViewAllDispatches?: () => void;
  onOpenSimulatorTab?: () => void;
  onNotify?: (msg: string) => void;
}

interface ResilienceData {
  score: number;
  status: string;
  metrics: {
    inventory: number;
    routes: number;
    fleet: number;
    forecast: number;
    connectivity: number;
  };
}

interface WargameImpact {
  scenario: string;
  locations_affected: number;
  eta_increase: string;
  alternative_routes_available: boolean;
  additional_vehicles_required: number;
  impact_summary: string[];
}

export const IplmsBottomPanels: React.FC<IplmsBottomPanelsProps> = ({
  onViewAllFleet,
  onViewAllDispatches,
  onOpenSimulatorTab,
  onNotify
}) => {
  // 1. Scenario Simulation State
  const [selectedScenario, setSelectedScenario] = useState<string>('Route A becomes unavailable');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [impactData, setImpactData] = useState<WargameImpact>({
    scenario: 'Route A becomes unavailable',
    locations_affected: 3,
    eta_increase: '4-12 hours',
    alternative_routes_available: true,
    additional_vehicles_required: 6,
    impact_summary: [
      '3 locations affected',
      'ETA increase: 4-12 hours',
      'Alternative routes available',
      'Additional 6 vehicles required'
    ]
  });

  // 2. Resilience Metrics State
  const [resilience, setResilience] = useState<ResilienceData>({
    score: 82,
    status: 'Healthy',
    metrics: {
      inventory: 87,
      routes: 79,
      fleet: 72,
      forecast: 91,
      connectivity: 84
    }
  });

  // Fetch live resilience from backend with instant fallback
  useEffect(() => {
    let isMounted = true;
    fetch('http://127.0.0.1:8005/api/v1/resilience')
      .then(res => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then(data => {
        if (isMounted && data?.score) {
          setResilience({
            score: data.score,
            status: data.status,
            metrics: data.metrics
          });
        }
      })
      .catch(() => {
        // Fallback already pre-loaded
      });
    return () => { isMounted = false; };
  }, []);

  // Handle Simulation Run
  const handleRunSimulation = async () => {
    setIsSimulating(true);
    tacticalAudio.playSonarPing();
    onNotify?.(`Simulating wargame scenario: "${selectedScenario}"...`);

    try {
      const res = await fetch('http://127.0.0.1:8005/api/v1/simulator/wargame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: selectedScenario })
      });
      if (res.ok) {
        const json = await res.json();
        setImpactData(json);
        onNotify?.(`Simulation complete: ${json.locations_affected} nodes affected.`);
      } else {
        throw new Error('Simulation endpoint fallback');
      }
    } catch {
      // Local dynamic fallback
      if (selectedScenario.includes('snowfall')) {
        setImpactData({
          scenario: selectedScenario,
          locations_affected: 4,
          eta_increase: '12-24 hours',
          alternative_routes_available: true,
          additional_vehicles_required: 8,
          impact_summary: [
            '4 locations affected (Zoji La Pass)',
            'ETA increase: 12-24 hours',
            'Manali-Sarchu bypass active',
            'Additional 8 vehicles required'
          ]
        });
      } else if (selectedScenario.includes('surge')) {
        setImpactData({
          scenario: selectedScenario,
          locations_affected: 2,
          eta_increase: '2-6 hours',
          alternative_routes_available: true,
          additional_vehicles_required: 4,
          impact_summary: [
            '2 locations affected (Leh/Charlie)',
            'ETA increase: 2-6 hours',
            'Fuel bowser priority convoys active',
            'Additional 4 tankers required'
          ]
        });
      } else {
        setImpactData({
          scenario: selectedScenario,
          locations_affected: 3,
          eta_increase: '4-12 hours',
          alternative_routes_available: true,
          additional_vehicles_required: 6,
          impact_summary: [
            '3 locations affected',
            'ETA increase: 4-12 hours',
            'Alternative routes available',
            'Additional 6 vehicles required'
          ]
        });
      }
    } finally {
      setIsSimulating(false);
      tacticalAudio.playAlertTone();
    }
  };

  return (
    <div className="iplms-bottom-four-cards">
      {/* CARD 1: Fleet Availability & Allocation */}
      <div className="iplms-panel-card iplms-bottom-card">
        <div className="iplms-bottom-card-header">
          <h4 className="iplms-bottom-card-title">Fleet Availability &amp; Allocation</h4>
          <button className="iplms-bottom-link-btn" onClick={onViewAllFleet}>
            View All →
          </button>
        </div>

        <div className="iplms-fleet-allocation-list">
          {/* Row 1: 6x6 Tactical Trucks */}
          <div className="fleet-item-row">
            <div className="fleet-item-left">
              <span className="fleet-svg-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </span>
              <span className="fleet-item-label">6x6 Tactical Trucks</span>
            </div>
            <div className="fleet-item-right">
              <span className="fleet-item-count"><strong>45</strong> / 60</span>
              <span className="fleet-pill-badge green">75%</span>
            </div>
          </div>

          {/* Row 2: All Terrain Vehicles (ATV) */}
          <div className="fleet-item-row">
            <div className="fleet-item-left">
              <span className="fleet-svg-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="18" r="3" />
                  <path d="M6 15h12l-2-7H8l-2 7z" />
                </svg>
              </span>
              <span className="fleet-item-label">All Terrain Vehicles (ATV)</span>
            </div>
            <div className="fleet-item-right">
              <span className="fleet-item-count"><strong>28</strong> / 40</span>
              <span className="fleet-pill-badge green">70%</span>
            </div>
          </div>

          {/* Row 3: Logistics Drones (UAV) */}
          <div className="fleet-item-row">
            <div className="fleet-item-left">
              <span className="fleet-svg-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </span>
              <span className="fleet-item-label">Logistics Drones (UAV)</span>
            </div>
            <div className="fleet-item-right">
              <span className="fleet-item-count"><strong>15</strong> / 20</span>
              <span className="fleet-pill-badge green">75%</span>
            </div>
          </div>

          {/* Row 4: Helicopter (Heavy Lift) */}
          <div className="fleet-item-row">
            <div className="fleet-item-left">
              <span className="fleet-svg-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M12 6v6m0 0a4 4 0 0 1 4 4v2H8v-2a4 4 0 0 1 4-4z" />
                  <line x1="5" y1="18" x2="19" y2="18" />
                </svg>
              </span>
              <span className="fleet-item-label">Helicopter (Heavy Lift)</span>
            </div>
            <div className="fleet-item-right">
              <span className="fleet-item-count"><strong>6</strong> / 10</span>
              <span className="fleet-pill-badge amber">60%</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: Ongoing Dispatches (4) */}
      <div className="iplms-panel-card iplms-bottom-card">
        <div className="iplms-bottom-card-header">
          <h4 className="iplms-bottom-card-title">Ongoing Dispatches (4)</h4>
          <button className="iplms-bottom-link-btn" onClick={onViewAllDispatches}>
            View All →
          </button>
        </div>

        <div className="iplms-dispatches-sublist">
          {/* Dispatch 1 */}
          <div className="dispatch-compact-row">
            <div className="dispatch-left-col">
              <span className="dispatch-truck-icon">🚚</span>
              <span className="dispatch-route-text">Base Manali → Post Echo</span>
            </div>
            <div className="dispatch-right-col">
              <span className="dispatch-status-badge green">En Route</span>
              <span className="dispatch-eta-text">ETA 6h</span>
            </div>
          </div>

          {/* Dispatch 2 */}
          <div className="dispatch-compact-row">
            <div className="dispatch-left-col">
              <span className="dispatch-truck-icon">🚚</span>
              <span className="dispatch-route-text">Base Jammu → Dras Depot</span>
            </div>
            <div className="dispatch-right-col">
              <span className="dispatch-status-badge green">En Route</span>
              <span className="dispatch-eta-text">ETA 8h</span>
            </div>
          </div>

          {/* Dispatch 3 */}
          <div className="dispatch-compact-row">
            <div className="dispatch-left-col">
              <span className="dispatch-truck-icon">🚚</span>
              <span className="dispatch-route-text">Base Leh → Post Bravo</span>
            </div>
            <div className="dispatch-right-col">
              <span className="dispatch-status-badge blue">Preparing</span>
              <span className="dispatch-eta-text">ETA 12h</span>
            </div>
          </div>

          {/* Dispatch 4 */}
          <div className="dispatch-compact-row">
            <div className="dispatch-left-col">
              <span className="dispatch-truck-icon">🚚</span>
              <span className="dispatch-route-text">Base Srinagar → Kargil</span>
            </div>
            <div className="dispatch-right-col">
              <span className="dispatch-status-badge red">On Hold</span>
              <span className="dispatch-eta-text">-</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: What-If Simulator */}
      <div className="iplms-panel-card iplms-bottom-card">
        <div className="iplms-bottom-card-header">
          <h4 className="iplms-bottom-card-title">What-If Simulator</h4>
          {onOpenSimulatorTab && (
            <button className="iplms-bottom-link-btn" onClick={onOpenSimulatorTab}>
              Launch ↗
            </button>
          )}
        </div>

        <div className="whatif-compact-body">
          <div className="whatif-select-group">
            <label className="whatif-field-label">Simulate Scenario</label>
            <select
              className="whatif-dropdown-input"
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
            >
              <option value="Route A becomes unavailable">Route A becomes unavailable</option>
              <option value="Heavy snowfall at Zoji La Pass (+48h)">Heavy snowfall at Zoji La Pass (+48h)</option>
              <option value="Fuel consumption surge at Siachen (+35%)">Fuel consumption surge at Siachen (+35%)</option>
              <option value="Emergency medical airlift required at Kargil">Emergency medical airlift required at Kargil</option>
            </select>
          </div>

          <button
            className="whatif-run-btn"
            onClick={handleRunSimulation}
            disabled={isSimulating}
          >
            {isSimulating ? 'Simulating Dynamic Physics...' : 'Run Simulation'}
          </button>

          <div className="whatif-impact-section">
            <div className="whatif-impact-title">Impact Summary</div>
            <div className="whatif-bullets-list">
              {impactData.impact_summary.map((item, idx) => (
                <div key={idx} className="whatif-bullet-item">
                  <span className="whatif-teal-bullet">⦿</span>
                  <span className="whatif-bullet-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CARD 4: Network Resilience & Risk */}
      <div className="iplms-panel-card iplms-bottom-card">
        <div className="iplms-bottom-card-header">
          <h4 className="iplms-bottom-card-title">Network Resilience &amp; Risk</h4>
        </div>

        <div className="resilience-compact-body">
          {/* Left: Circular Arc Radial Gauge */}
          <div className="resilience-radial-wrap">
            <svg className="resilience-gauge-svg" viewBox="0 0 100 100">
              {/* Background Arc Track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="8"
                strokeDasharray="188.5 251.3"
                strokeDashoffset="-31.4"
                strokeLinecap="round"
              />
              {/* Active Gauge Meter (~82% fill) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#resilienceGrad)"
                strokeWidth="8"
                strokeDasharray="154.5 251.3"
                strokeDashoffset="-31.4"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="resilienceGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="resilience-gauge-center">
              <div className="gauge-score-value">{resilience.score} <span className="gauge-score-max">/ 100</span></div>
              <div className="gauge-score-status">{resilience.status}</div>
            </div>
          </div>

          {/* Right: 5 Metric Progress Bars */}
          <div className="resilience-bars-col">
            <div className="resilience-bar-row">
              <span className="r-label">Inventory</span>
              <div className="r-bar-track">
                <div className="r-bar-fill green" style={{ width: `${resilience.metrics.inventory}%` }}></div>
              </div>
              <span className="r-val">{resilience.metrics.inventory}%</span>
            </div>

            <div className="resilience-bar-row">
              <span className="r-label">Routes</span>
              <div className="r-bar-track">
                <div className="r-bar-fill green" style={{ width: `${resilience.metrics.routes}%` }}></div>
              </div>
              <span className="r-val">{resilience.metrics.routes}%</span>
            </div>

            <div className="resilience-bar-row">
              <span className="r-label">Fleet</span>
              <div className="r-bar-track">
                <div className="r-bar-fill amber" style={{ width: `${resilience.metrics.fleet}%` }}></div>
              </div>
              <span className="r-val">{resilience.metrics.fleet}%</span>
            </div>

            <div className="resilience-bar-row">
              <span className="r-label">Forecast</span>
              <div className="r-bar-track">
                <div className="r-bar-fill green" style={{ width: `${resilience.metrics.forecast}%` }}></div>
              </div>
              <span className="r-val">{resilience.metrics.forecast}%</span>
            </div>

            <div className="resilience-bar-row">
              <span className="r-label">Connectivity</span>
              <div className="r-bar-track">
                <div className="r-bar-fill green" style={{ width: `${resilience.metrics.connectivity}%` }}></div>
              </div>
              <span className="r-val">{resilience.metrics.connectivity}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
