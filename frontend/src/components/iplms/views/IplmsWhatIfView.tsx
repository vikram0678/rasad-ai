import React, { useState } from 'react';
import { tacticalAudio } from '../../../utils/audio';

export const IplmsWhatIfView: React.FC = () => {
  const [scenario, setScenario] = useState('Route A becomes unavailable');
  const [demandSurge, setDemandSurge] = useState('+ 20%');
  const [depotLoss, setDepotLoss] = useState('None');
  const [weatherCondition, setWeatherCondition] = useState('Heavy Snow');
  const [isSimulated, setIsSimulated] = useState(true);

  const results = [
    { metric: 'Affected Locations', current: '1', sim: '4', change: '+ 3', changeType: 'neg' },
    { metric: 'Total ETA (avg)', current: '14 h', sim: '22 h', change: '+ 57%', changeType: 'neg' },
    { metric: 'Inventory at Risk', current: '3', sim: '7', change: '+ 133%', changeType: 'neg' },
    { metric: 'Routes Available', current: '3', sim: '1', change: '- 67%', changeType: 'neg' },
    { metric: 'Vehicles Required', current: '6', sim: '12', change: '+ 100%', changeType: 'neg' },
    { metric: 'Overall Risk Level', current: 'Medium', sim: 'High', change: '⬆ CRITICAL', changeType: 'neg' },
  ];

  const handleRun = () => {
    tacticalAudio.playSonar();
    setIsSimulated(true);
  };

  return (
    <div className="iplms-view-container">
      <div className="what-if-grid">
        {/* Left: Simulation Setup Controls */}
        <div className="iplms-panel-card iplms-p-4" style={{ height: 'fit-content' }}>
          <h4 className="iplms-panel-title" style={{ marginBottom: '14px' }}>Simulate Scenario</h4>

          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label className="iplms-field-label">Scenario Event</label>
            <select className="iplms-dropdown-select full-width" value={scenario} onChange={e => setScenario(e.target.value)}>
              <option>Route A becomes unavailable</option>
              <option>Dras Depot isolated by avalanche</option>
              <option>Winter storm closes Zoji La pass</option>
              <option>Enemy artillery threat on Highway 1D</option>
            </select>
          </div>

          <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
            <h5 className="iplms-subheading-small" style={{ marginBottom: '10px' }}>Additional Parameters</h5>

            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label className="iplms-field-label">Demand Surge</label>
              <select className="iplms-dropdown-select full-width" value={demandSurge} onChange={e => setDemandSurge(e.target.value)}>
                <option>+ 20%</option>
                <option>+ 50% (Combat Operation)</option>
                <option>+ 10%</option>
                <option>Baseline</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label className="iplms-field-label">Depot Unavailable</label>
              <select className="iplms-dropdown-select full-width" value={depotLoss} onChange={e => setDepotLoss(e.target.value)}>
                <option>None</option>
                <option>Dras Depot</option>
                <option>Kargil Depot</option>
                <option>Zoji Depot</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="iplms-field-label">Weather Condition</label>
              <select className="iplms-dropdown-select full-width" value={weatherCondition} onChange={e => setWeatherCondition(e.target.value)}>
                <option>Heavy Snow</option>
                <option>Blizzard &amp; Whiteout</option>
                <option>Clear Skies</option>
                <option>Extreme Sub-Zero (-25°C)</option>
              </select>
            </div>

            <button className="iplms-action-btn primary full-width" onClick={handleRun} style={{ padding: '8px' }}>
              <span>Run Simulation</span>
            </button>
          </div>
        </div>

        {/* Right: Simulation Results & Impact Recommendation */}
        <div className="iplms-panel-card iplms-p-4">
          <div className="iplms-panel-title-row" style={{ marginBottom: '14px' }}>
            <h4 className="iplms-panel-title">Simulation Results</h4>
            <span className="iplms-meta-sub">Monte-Carlo Contingency Engine</span>
          </div>

          <table className="iplms-incident-table-full" style={{ marginBottom: '16px' }}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Current State</th>
                <th>Simulated State</th>
                <th style={{ textAlign: 'right' }}>Projected Change</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="incident-full-row">
                  <td className="font-bold">{r.metric}</td>
                  <td className="cell-mono">{r.current}</td>
                  <td className="cell-mono font-bold" style={{ color: '#f8fafc' }}>{r.sim}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="cell-mono font-bold" style={{ color: '#ef4444' }}>
                      {r.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Key Impact Box */}
          <div className="simulation-impact-box">
            <div className="impact-box-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <strong>Key Tactical Impact &amp; AI Recommendation</strong>
            </div>
            <p className="impact-box-text">
              If <strong>Route A</strong> becomes unavailable under <strong>{weatherCondition}</strong>, 4 forward locations will face severe stockout hazards within 24 hours. Delivery latency jumps from 14h to 22h (+57%).
            </p>
            <div className="impact-box-recommendation">
              <strong>RECOMMENDED ACTION:</strong> Authorize immediate diversion to <strong>Route B</strong>. Pre-position 2 convoy units of Class V Ammunition and Class I Rations at Kargil Intermediate Depot to absorb demand surge.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
