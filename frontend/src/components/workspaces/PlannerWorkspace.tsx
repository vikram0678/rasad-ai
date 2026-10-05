import React, { useState } from 'react';
import { tacticalAudio } from '../../utils/audio';
import { MultiDepotBalancing } from './MultiDepotBalancing';

interface FleetVehicle {
  id: string;
  type: string;
  count: number;
  capacityKg: number;
  rangeKm: number;
  snowRating: string;
  status: 'READY' | 'DEPLOYED' | 'MAINTENANCE';
}

const FLEET_ASSETS: FleetVehicle[] = [
  { id: 'FL-01', type: 'Tatra 8x8 Heavy Utility Truck', count: 8, capacityKg: 10000, rangeKm: 650, snowRating: 'Arctic Grade Cat IV', status: 'READY' },
  { id: 'FL-02', type: 'Ashok Leyland 4x4 Stallion', count: 12, capacityKg: 5000, rangeKm: 550, snowRating: 'Snow Chains Fitted', status: 'READY' },
  { id: 'FL-03', type: 'HAL ALH Dhruv Helicopter', count: 4, capacityKg: 1500, rangeKm: 630, snowRating: 'High-Altitude Blades', status: 'READY' },
  { id: 'FL-04', type: 'Heavy-Lift Autonomous UAV (Hexacopter)', count: 6, capacityKg: 100, rangeKm: 120, snowRating: 'Anti-Ice Rotors', status: 'READY' }
];

interface RouteWaypoint {
  name: string;
  distanceKm: number;
  altitudeM: number;
  transitTimeMin: number;
  hazardRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  status: string;
}

const WAYPOINTS: RouteWaypoint[] = [
  { name: 'FSB Khalsar (Depot Base)', distanceKm: 0, altitudeM: 3050, transitTimeMin: 0, hazardRisk: 'LOW', status: 'Clear Corridor' },
  { name: 'Khardung La Pass Checkpoint', distanceKm: 42, altitudeM: 5359, transitTimeMin: 75, hazardRisk: 'HIGH', status: 'Pass Window Open (14:00)' },
  { name: 'Shyok River Bridge Bypass', distanceKm: 110, altitudeM: 3750, transitTimeMin: 160, hazardRisk: 'LOW', status: 'Bailey Bridge Operational' },
  { name: 'Murgo Choke Point Km 134', distanceKm: 185, altitudeM: 4400, transitTimeMin: 260, hazardRisk: 'MEDIUM', status: 'Snow Drift Monitored' },
  { name: 'Daulat Beg Oldie (OP_DBO)', distanceKm: 255, altitudeM: 5065, transitTimeMin: 360, hazardRisk: 'HIGH', status: 'Advance Base Reached' }
];

interface PlannerWorkspaceProps {
  onNotify: (msg: string) => void;
  onOpenGuardrail: () => void;
}

export const PlannerWorkspace: React.FC<PlannerWorkspaceProps> = ({ onNotify, onOpenGuardrail }) => {
  const [plannerSubTab, setPlannerSubTab] = useState<'cvrptw' | 'depots'>('cvrptw');
  const [selectedFleet, setSelectedFleet] = useState<string>('FL-01');
  const [tatraCount, setTatraCount] = useState<number>(3);
  const [stallionCount, setStallionCount] = useState<number>(4);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [solutionFound, setSolutionFound] = useState<boolean>(true);

  const totalPayloadCapacity = (tatraCount * 10000) + (stallionCount * 5000);

  const handleRunOptimizer = () => {
    tacticalAudio.playBlip();
    setIsSolving(true);
    setTimeout(() => {
      setIsSolving(false);
      setSolutionFound(true);
      tacticalAudio.playSonar();
      onNotify('CVRPTW SOLVER: Computed Pareto-optimal 2-convoy routing matrix. Zero time-window violations.');
    }, 700);
  };

  return (
    <div className="command-overview-container">
      {/* Workspace Header */}
      <div className="overview-header">
        <div className="overview-title-group">
          <div className="subtag">RASAD / OPERATIONS / CVRPTW OR-SOLVER &amp; FLEET PLANNER</div>
          <h1>Logistics Fleet Planner &amp; Route Matrix</h1>
          <div className="subtitle">
            Capacitated Vehicle Routing Problem with Time Windows (CVRPTW), multi-depot payload optimization, and avalanche detour calculation.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {plannerSubTab === 'cvrptw' && (
            <button
              className="btn-export-brief"
              onClick={handleRunOptimizer}
              disabled={isSolving}
              style={{ background: 'rgba(56, 189, 248, 0.2)', borderColor: '#38bdf8' }}
            >
              {isSolving ? '⚙️ Solving MILP Matrix...' : '⚡ Re-Calculate Optimal Routes'}
            </button>
          )}
          <button className="btn-export-brief" onClick={onOpenGuardrail}>
            🛡️ Verify Guardrails
          </button>
        </div>
      </div>

      {/* Sub-navigation tabs: CVRPTW Routing vs Multi-Depot Balancing */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
        <button
          onClick={() => {
            tacticalAudio.playBlip();
            setPlannerSubTab('cvrptw');
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid',
            borderColor: plannerSubTab === 'cvrptw' ? '#38bdf8' : '#334155',
            background: plannerSubTab === 'cvrptw' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
            color: plannerSubTab === 'cvrptw' ? '#38bdf8' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>🚛</span>
          <span>CVRPTW FLEET &amp; WAYPOINT ROUTING</span>
        </button>
        <button
          onClick={() => {
            tacticalAudio.playBlip();
            setPlannerSubTab('depots');
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid',
            borderColor: plannerSubTab === 'depots' ? '#f59e0b' : '#334155',
            background: plannerSubTab === 'depots' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.6)',
            color: plannerSubTab === 'depots' ? '#fbbf24' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>🔄</span>
          <span>MULTI-DEPOT SUPPLY BALANCING MATRIX</span>
          <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.25)', color: '#fca5a5', border: '1px solid #ef4444' }}>
            KHARDUNG LA 14:00
          </span>
        </button>
      </div>

      {plannerSubTab === 'depots' ? (
        <MultiDepotBalancing onNotify={onNotify} />
      ) : (
        <>

      {/* Fleet Allocation & Capacity Sliders */}
      <div className="executive-kpi-grid">
        <div className="exec-kpi-card">
          <div className="exec-kpi-header">
            <span className="exec-kpi-title">Total Allocated Capacity</span>
            <span className="exec-kpi-icon">⚖️</span>
          </div>
          <div className="exec-kpi-val" style={{ color: '#38bdf8' }}>
            {(totalPayloadCapacity / 1000).toFixed(1)} Tons
          </div>
          <div className="exec-kpi-sub">
            {tatraCount} Tatras + {stallionCount} Stallions
          </div>
        </div>

        <div className="exec-kpi-card">
          <div className="exec-kpi-header">
            <span className="exec-kpi-title">Tatra 8x8 Heavy Trucks</span>
            <span className="exec-kpi-icon">🚚</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{tatraCount} Units</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setTatraCount(p => Math.max(1, p - 1))}
                style={{ padding: '2px 8px', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
              >
                -
              </button>
              <button
                onClick={() => setTatraCount(p => Math.min(8, p + 1))}
                style={{ padding: '2px 8px', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>
          <div className="exec-kpi-sub">{tatraCount * 10} t payload capacity</div>
        </div>

        <div className="exec-kpi-card">
          <div className="exec-kpi-header">
            <span className="exec-kpi-title">Stallion 4x4 Medium Trucks</span>
            <span className="exec-kpi-icon">🚛</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stallionCount} Units</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setStallionCount(p => Math.max(0, p - 1))}
                style={{ padding: '2px 8px', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
              >
                -
              </button>
              <button
                onClick={() => setStallionCount(p => Math.min(12, p + 1))}
                style={{ padding: '2px 8px', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>
          <div className="exec-kpi-sub">{stallionCount * 5} t payload capacity</div>
        </div>

        <div className="exec-kpi-card">
          <div className="exec-kpi-header">
            <span className="exec-kpi-title">Estimated Transit Time</span>
            <span className="exec-kpi-icon">⏱️</span>
          </div>
          <div className="exec-kpi-val" style={{ color: '#10b981' }}>
            5h 45m
          </div>
          <div className="exec-kpi-sub">Arrival before 17:30 IST window</div>
        </div>
      </div>

      {/* Two Column Layout: Fleet Manifest Table (Left) + Waypoint Time Windows (Right) */}
      <div className="overview-split-row">
        {/* Left: Available Fleet Inventory Matrix */}
        <div className="operating-picture-panel">
          <div className="operating-picture-header">
            <div className="operating-title-block">
              <h3>Northern Command Vehicle Fleet Matrix</h3>
              <p>Staging readiness at FSB Khalsar &amp; Central Depot Leh</p>
            </div>
            <span className="badge-outpost-count">4 ASSET CLASSES</span>
          </div>

          <div className="dispatches-table-wrapper">
            <table className="c4isr-table">
              <thead>
                <tr>
                  <th>ASSET ID / TYPE</th>
                  <th>AVAILABLE</th>
                  <th>PAYLOAD RATING</th>
                  <th>ARCTIC SPECS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {FLEET_ASSETS.map(asset => (
                  <tr
                    key={asset.id}
                    onClick={() => setSelectedFleet(asset.id)}
                    style={{ background: selectedFleet === asset.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent', cursor: 'pointer' }}
                  >
                    <td>
                      <b style={{ color: '#f8fafc' }}>{asset.id}</b> · {asset.type}
                    </td>
                    <td>{asset.count} Units</td>
                    <td>{asset.capacityKg.toLocaleString()} kg</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.74rem' }}>{asset.snowRating}</td>
                    <td>
                      <span className="status-pill-dispatch approved">
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="operating-picture-footer">
            <div style={{ color: '#94a3b8' }}>
              Selected: <b style={{ color: '#38bdf8' }}>{FLEET_ASSETS.find(a => a.id === selectedFleet)?.type}</b> · Max Range: {FLEET_ASSETS.find(a => a.id === selectedFleet)?.rangeKm} km
            </div>
            <div style={{ color: '#10b981' }}>
              &bull; 100% Vehicles Pre-Heated With Bukhari Block Heaters
            </div>
          </div>
        </div>

        {/* Right: Waypoint Route Progression & Time Windows */}
        <div className="priority-watch-panel">
          <div className="priority-watch-header">
            <div>
              <h3>DS-DBO Axis Waypoints</h3>
              <span className="count">Time-Window Arrival Constraints</span>
            </div>
            <span className="badge-open-decisions">VERIFIED</span>
          </div>

          <div className="priority-items-list">
            {WAYPOINTS.map((wp, idx) => (
              <div key={wp.name} className="priority-item-card">
                <div className="priority-item-top">
                  <div className="priority-item-name">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
                      WP-0{idx + 1}
                    </span>
                    <span>{wp.name}</span>
                  </div>
                  <span
                    className={`priority-badge ${
                      wp.hazardRisk === 'HIGH' ? 'p1' : wp.hazardRisk === 'MEDIUM' ? 'time' : 'quarantine'
                    }`}
                  >
                    {wp.hazardRisk} RISK
                  </span>
                </div>
                <div className="priority-item-category">
                  {wp.distanceKm} km · {wp.altitudeM} m Altitude · +{wp.transitTimeMin} min
                </div>
                <div className="priority-item-desc" style={{ color: '#cbd5e1' }}>
                  {wp.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
