import React, { useState } from 'react';
import { IplmsMap } from '../IplmsMap';
import { tacticalAudio } from '../../../utils/audio';

export const IplmsRoutePlanningView: React.FC = () => {
  const [source, setSource] = useState('Base Manali');
  const [destination, setDestination] = useState('Post Charlie');
  const [selectedRoute, setSelectedRoute] = useState<'A' | 'B' | 'C'>('A');

  const routes = [
    {
      id: 'A',
      name: 'Route A (Primary Valley Bypass)',
      dist: '280 km',
      eta: '14 hours',
      risk: 'Low',
      riskColor: '#10b981',
      status: 'Available',
      statusColor: '#10b981',
      desc: 'Avoids landslide via Zoji La Southern Ridge. Cleared by BRO.'
    },
    {
      id: 'B',
      name: 'Route B (High Pass Corridor)',
      dist: '320 km',
      eta: '17 hours',
      risk: 'Medium',
      riskColor: '#f59e0b',
      status: 'Available',
      statusColor: '#10b981',
      desc: 'Moderate icy conditions over Dras pass. Snow chains mandatory.'
    },
    {
      id: 'C',
      name: 'Route C (Direct Highway 1D)',
      dist: '360 km',
      eta: '21 hours',
      risk: 'High',
      riskColor: '#ef4444',
      status: 'Blocked',
      statusColor: '#ef4444',
      desc: 'Blocked at Km 114 by major rockfall and snow accumulation.'
    }
  ];

  return (
    <div className="iplms-view-container">
      <div className="route-planning-grid">
        {/* Left: Input Selection Column */}
        <div className="iplms-panel-card iplms-p-4" style={{ height: 'fit-content' }}>
          <h4 className="iplms-panel-title" style={{ marginBottom: '14px' }}>Route Configuration</h4>

          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label className="iplms-field-label">Source Node</label>
            <select className="iplms-dropdown-select full-width" value={source} onChange={e => setSource(e.target.value)}>
              <option>Base Manali</option>
              <option>Base Srinagar</option>
              <option>Base Jammu</option>
              <option>Base Leh</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="iplms-field-label">Destination Post</label>
            <select className="iplms-dropdown-select full-width" value={destination} onChange={e => setDestination(e.target.value)}>
              <option>Post Charlie</option>
              <option>Post Delta</option>
              <option>Post Alpha</option>
              <option>Post Bravo</option>
              <option>Post Foxtrot</option>
            </select>
          </div>

          <button
            className="iplms-action-btn primary full-width"
            onClick={() => tacticalAudio.playSonar()}
            style={{ padding: '8px' }}
          >
            <span>Find Optimal Routes</span>
          </button>
        </div>

        {/* Center: Live Tactical GIS Map */}
        <div className="route-center-map" style={{ height: '560px', position: 'relative' }}>
          <IplmsMap selectedNodeId="post-charlie" onSelectNode={() => {}} />
        </div>

        {/* Right: Route Options Card List */}
        <div className="iplms-panel-card iplms-p-3" style={{ height: 'fit-content' }}>
          <div className="iplms-panel-title-row" style={{ marginBottom: '12px' }}>
            <h4 className="iplms-panel-title">Route Options (3)</h4>
            <span className="iplms-meta-sub">A* Elevation Engine</span>
          </div>

          <div className="route-cards-list">
            {routes.map(r => (
              <div
                key={r.id}
                className={`route-option-card ${selectedRoute === r.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedRoute(r.id as any);
                  tacticalAudio.playBlip();
                }}
              >
                <div className="route-card-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="route-letter-badge">{r.id}</span>
                    <strong style={{ fontSize: '0.78rem' }}>{r.name}</strong>
                  </div>
                  <span
                    className="status-pill"
                    style={{ backgroundColor: `${r.statusColor}22`, color: r.statusColor, border: `1px solid ${r.statusColor}44` }}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="route-card-metrics">
                  <div>
                    <span className="meta-dim">Distance: </span>
                    <strong className="cell-mono">{r.dist}</strong>
                  </div>
                  <div>
                    <span className="meta-dim">ETA: </span>
                    <strong className="cell-mono">{r.eta}</strong>
                  </div>
                  <div>
                    <span className="meta-dim">Risk: </span>
                    <strong style={{ color: r.riskColor }}>{r.risk}</strong>
                  </div>
                </div>

                <p className="route-desc">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
