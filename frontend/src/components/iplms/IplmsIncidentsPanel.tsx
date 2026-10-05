import React, { useState } from 'react';
import { IPLMS_INCIDENTS, IplmsIncident } from '../../data/iplmsData';
import { tacticalAudio } from '../../utils/audio';

interface IplmsIncidentsPanelProps {
  selectedIncidentId: string;
  onSelectIncident: (inc: IplmsIncident) => void;
  onApproveDispatch: (incidentId: string) => void;
  approvedIncidentIds: Set<string>;
}

export const IplmsIncidentsPanel: React.FC<IplmsIncidentsPanelProps> = ({
  selectedIncidentId,
  onSelectIncident,
  onApproveDispatch,
  approvedIncidentIds
}) => {
  type FilterTab = 'ALL' | 'CRITICAL' | 'HIGH' | 'WARNING';
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
  type DetailTab = 'overview' | 'inventory' | 'forecast' | 'routes' | 'recommendation';
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('overview');

  // Filtered incidents
  const filteredIncidents = IPLMS_INCIDENTS.filter((item) => {
    if (activeFilter === 'CRITICAL') return item.priority === 'CRITICAL';
    if (activeFilter === 'HIGH') return item.priority === 'HIGH';
    if (activeFilter === 'WARNING') return item.priority === 'WARNING';
    return true;
  });

  // Current selected incident
  const currentIncident =
    IPLMS_INCIDENTS.find(i => i.id === selectedIncidentId) || filteredIncidents[0] || IPLMS_INCIDENTS[0];

  const isApproved = approvedIncidentIds.has(currentIncident.id);

  const handleFilterClick = (filter: FilterTab) => {
    setActiveFilter(filter);
    tacticalAudio.playBlip();
    const matches = IPLMS_INCIDENTS.filter((item) => {
      if (filter === 'CRITICAL') return item.priority === 'CRITICAL';
      if (filter === 'HIGH') return item.priority === 'HIGH';
      if (filter === 'WARNING') return item.priority === 'WARNING';
      return true;
    });
    if (matches.length > 0 && !matches.some(m => m.id === currentIncident.id)) {
      onSelectIncident(matches[0]);
    }
  };

  return (
    <div className="iplms-incidents-panel-wrap">
      {/* 1. TOP SECTION: ACTIVE LOGISTICS INCIDENTS TABLE */}
      <div className="iplms-panel-card incidents-table-card">
        <div className="iplms-panel-header">
          <h3 className="iplms-panel-title">Active Logistics Incidents</h3>
          <button
            className="iplms-link-btn"
            onClick={() => handleFilterClick('ALL')}
            title="Show All Incidents"
          >
            View All ({IPLMS_INCIDENTS.length}) →
          </button>
        </div>

        {/* Tab Filters */}
        <div className="iplms-filter-tabs">
          <button
            className={`filter-tab ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => handleFilterClick('ALL')}
          >
            All (13)
          </button>
          <button
            className={`filter-tab tab-critical ${activeFilter === 'CRITICAL' ? 'active' : ''}`}
            onClick={() => handleFilterClick('CRITICAL')}
          >
            Critical (3)
          </button>
          <button
            className={`filter-tab tab-high ${activeFilter === 'HIGH' ? 'active' : ''}`}
            onClick={() => handleFilterClick('HIGH')}
          >
            High (5)
          </button>
          <button
            className={`filter-tab tab-warning ${activeFilter === 'WARNING' ? 'active' : ''}`}
            onClick={() => handleFilterClick('WARNING')}
          >
            Warning (5)
          </button>
        </div>

        {/* Incidents Table */}
        <div className="iplms-table-scroll">
          <table className="iplms-incident-table">
            <thead>
              <tr>
                <th style={{ width: '28px' }}>#</th>
                <th>Location</th>
                <th>Issue</th>
                <th>Predicted Time</th>
                <th style={{ textAlign: 'right' }}>Priority</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((inc) => {
                const isSelected = inc.id === currentIncident.id;
                const priorityBadgeClass =
                  inc.priority === 'CRITICAL'
                    ? 'priority-badge-critical'
                    : inc.priority === 'HIGH'
                    ? 'priority-badge-high'
                    : 'priority-badge-warning';

                const locationDotClass =
                  inc.priority === 'CRITICAL'
                    ? 'dot-critical'
                    : inc.priority === 'HIGH'
                    ? 'dot-high'
                    : 'dot-warning';

                return (
                  <tr
                    key={inc.id}
                    className={`incident-row ${isSelected ? 'row-selected' : ''}`}
                    onClick={() => {
                      onSelectIncident(inc);
                      tacticalAudio.playBlip();
                    }}
                  >
                    <td className="cell-num">{inc.num}</td>
                    <td className="cell-loc">
                      <span className={`status-dot ${locationDotClass}`}></span>
                      <span className="location-name">{inc.locationName}</span>
                    </td>
                    <td className="cell-issue">{inc.issue}</td>
                    <td className="cell-time">{inc.predictedTime}</td>
                    <td className="cell-priority" style={{ textAlign: 'right' }}>
                      <span className={`priority-pill ${priorityBadgeClass}`}>
                        {inc.priority}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. BOTTOM SECTION: INCIDENT DETAIL & DISPATCH ACTION CARD */}
      <div className="iplms-panel-card incident-detail-card">
        {/* Detail Header */}
        <div className="detail-card-header">
          <div className="detail-title-left">
            <span className="alert-circle-icon">!</span>
            <h4 className="detail-location-title">{currentIncident.locationName}</h4>
            <span className={`detail-priority-tag ${currentIncident.priority.toLowerCase()}`}>
              {currentIncident.priority}
            </span>
          </div>
          <div className="detail-timestamp">
            Last updated: {currentIncident.lastUpdated}
          </div>
        </div>

        {/* Subtabs */}
        <div className="detail-subtabs">
          <button
            className={`detail-tab ${activeDetailTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveDetailTab('overview'); tacticalAudio.playBlip(); }}
          >
            Overview
          </button>
          <button
            className={`detail-tab ${activeDetailTab === 'inventory' ? 'active' : ''}`}
            onClick={() => { setActiveDetailTab('inventory'); tacticalAudio.playBlip(); }}
          >
            Inventory
          </button>
          <button
            className={`detail-tab ${activeDetailTab === 'forecast' ? 'active' : ''}`}
            onClick={() => { setActiveDetailTab('forecast'); tacticalAudio.playBlip(); }}
          >
            Forecast
          </button>
          <button
            className={`detail-tab ${activeDetailTab === 'routes' ? 'active' : ''}`}
            onClick={() => { setActiveDetailTab('routes'); tacticalAudio.playBlip(); }}
          >
            Route Options
          </button>
          <button
            className={`detail-tab ${activeDetailTab === 'recommendation' ? 'active' : ''}`}
            onClick={() => { setActiveDetailTab('recommendation'); tacticalAudio.playBlip(); }}
          >
            Recommended Action
          </button>
        </div>

        {/* Dynamic Detail Card Content based on activeDetailTab */}
        <div className="detail-card-body">
          {/* TAB 1: OVERVIEW */}
          {activeDetailTab === 'overview' && (
            <>
              {/* Left Column: Telemetry & State */}
              <div className="detail-metrics-column">
                <div className="metric-row">
                  <span className="metric-label">Supply Class</span>
                  <span className="metric-value font-highlight">{currentIncident.supplyClass}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Current Stock</span>
                  <span className="metric-value stock-alert">
                    {currentIncident.stockPercent}% ({currentIncident.currentUnits} units)
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Predicted Depletion</span>
                  <span className="metric-value text-red font-bold">
                    {currentIncident.predictedDepletion}
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Priority</span>
                  <span className={`metric-value ${currentIncident.priority.toLowerCase()}`}>
                    {currentIncident.priority}
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Personnel Strength</span>
                  <span className="metric-value">
                    {currentIncident.personnelStrength} <span className="delta-up">{currentIncident.personnelDelta}</span>
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Recent Consumption</span>
                  <span className="metric-value text-orange">
                    {currentIncident.recentConsumption}
                  </span>
                </div>
              </div>

              {/* Right Column: AI Recommended Plan */}
              <div className="detail-plan-column">
                <div className="plan-header-row">
                  <span className="plan-title">Recommended Plan</span>
                  <span className="ai-suggested-pill">AI Suggested</span>
                </div>

                <div className="plan-details-list">
                  <div className="plan-item">
                    <span className="plan-prop">Source</span>
                    <span className="plan-val">{currentIncident.recommendedPlan.source}</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-prop">Route</span>
                    <span className="plan-val">{currentIncident.recommendedPlan.route}</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-prop">Transport</span>
                    <span className="plan-val">{currentIncident.recommendedPlan.transport}</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-prop">ETA</span>
                    <span className="plan-val font-highlight">{currentIncident.recommendedPlan.eta}</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-prop">Confidence</span>
                    <span className="plan-val font-confidence">{currentIncident.recommendedPlan.confidence}%</span>
                  </div>
                </div>

                {/* Action Buttons: Human-In-The-Loop Signoff */}
                <div className="plan-action-row">
                  <button
                    className={`btn-approve-dispatch ${isApproved ? 'approved' : ''}`}
                    onClick={() => onApproveDispatch(currentIncident.id)}
                    title="Logistics Commander Formal Resupply Authorization"
                  >
                    {isApproved ? (
                      <>
                        <span>✓</span>
                        <span>Dispatch Approved</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Approve Dispatch</span>
                      </>
                    )}
                  </button>

                  <button
                    className="btn-view-alternatives"
                    onClick={() => setActiveDetailTab('routes')}
                    title="Inspect Secondary & Contingency Supply Corridors"
                  >
                    View All Alternatives
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: INVENTORY */}
          {activeDetailTab === 'inventory' && (
            <div className="subtab-pane-full">
              <div className="subtab-grid-2col">
                <div className="subtab-card">
                  <div className="subtab-card-title">Stock Breakdown</div>
                  <div className="subtab-metric-item"><span>Holding:</span> <b>{currentIncident.currentUnits} {currentIncident.unitLabel}</b></div>
                  <div className="subtab-metric-item"><span>Capacity:</span> <b>{(currentIncident.currentUnits / (currentIncident.stockPercent / 100)).toFixed(0)} units</b></div>
                  <div className="subtab-metric-item"><span>Safety Threshold:</span> <b style={{ color: '#f59e0b' }}>40% Required</b></div>
                  <div className="subtab-metric-item"><span>Deficit Volume:</span> <b style={{ color: '#ef4444' }}>{Math.max(0, 500 - currentIncident.currentUnits)} units</b></div>
                </div>
                <div className="subtab-card">
                  <div className="subtab-card-title">Storage & Logistics</div>
                  <div className="subtab-metric-item"><span>Storage Type:</span> <b>Subterranean Hardened Bunker</b></div>
                  <div className="subtab-metric-item"><span>Cold Rating:</span> <b>-40°C Arctic Certified</b></div>
                  <div className="subtab-metric-item"><span>Batch LOT:</span> <b>LOT-2026-N{currentIncident.num}</b></div>
                  <div className="subtab-metric-item"><span>Asset Verification:</span> <b>RFID Mesh (Locked)</b></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FORECAST */}
          {activeDetailTab === 'forecast' && (
            <div className="subtab-pane-full">
              <div className="subtab-grid-2col">
                <div className="subtab-card">
                  <div className="subtab-card-title">DeepAR + Neural Forecast</div>
                  <div className="subtab-metric-item"><span>Model:</span> <b>Hybrid Bi-LSTM + Prophet (v2.4)</b></div>
                  <div className="subtab-metric-item"><span>Mean Absolute Error (MAE):</span> <b>33.3 units (97.2% acc)</b></div>
                  <div className="subtab-metric-item"><span>Confidence Interval:</span> <b>95% Credible Window</b></div>
                  <div className="subtab-metric-item"><span>Stockout Velocity:</span> <b style={{ color: '#ef4444' }}>{currentIncident.predictedDepletion}</b></div>
                </div>
                <div className="subtab-card">
                  <div className="subtab-card-title">Weather & Climate Stressors</div>
                  <div className="subtab-metric-item"><span>Ambient Temp:</span> <b style={{ color: '#60a5fa' }}>-18°C (Extreme Sub-Zero)</b></div>
                  <div className="subtab-metric-item"><span>Consumption Surge:</span> <b style={{ color: '#f59e0b' }}>+35% Thermal & Operational</b></div>
                  <div className="subtab-metric-item"><span>Visibility:</span> <b>&lt; 500m (Heavy Snow)</b></div>
                  <div className="subtab-metric-item"><span>Alert Status:</span> <b style={{ color: '#ef4444' }}>IMMEDIATE ACTION MANDATED</b></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ROUTE OPTIONS */}
          {activeDetailTab === 'routes' && (
            <div className="subtab-pane-full">
              <div className="route-comparison-table-wrap">
                <table className="route-comparison-table">
                  <thead>
                    <tr>
                      <th>AXIS</th>
                      <th>DISTANCE</th>
                      <th>ETA</th>
                      <th>RISK</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                      <td><b>Primary (via Leh)</b></td>
                      <td>165 km</td>
                      <td>07 hrs</td>
                      <td>HIGH (Km 114)</td>
                      <td><span className="priority-pill priority-badge-critical">BLOCKED</span></td>
                    </tr>
                    <tr style={{ background: 'rgba(16, 185, 129, 0.12)' }}>
                      <td><b>Secondary (via Manali) ★</b></td>
                      <td>380 km</td>
                      <td>14 hrs</td>
                      <td>LOW (92% pass)</td>
                      <td><span className="priority-pill" style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#34d399' }}>RECOMMENDED</span></td>
                    </tr>
                    <tr>
                      <td><b>Airbridge (UAV Sortie)</b></td>
                      <td>95 km</td>
                      <td>1.5 hrs</td>
                      <td>MED (Wind 40 km/h)</td>
                      <td><span className="priority-pill priority-badge-warning">CONTINGENCY</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: RECOMMENDED ACTION */}
          {activeDetailTab === 'recommendation' && (
            <div className="subtab-pane-full">
              <div className="directive-box">
                <div className="directive-title">OPERATIONAL LOGISTICS DIRECTIVE #0{currentIncident.num}</div>
                <p className="directive-desc">
                  Authorize immediate release of <strong>{currentIncident.supplyClass}</strong> from <strong>{currentIncident.recommendedPlan.source}</strong> utilizing <strong>{currentIncident.recommendedPlan.transport}</strong> via <strong>{currentIncident.recommendedPlan.route}</strong>.
                </p>
                <div className="directive-meta-row">
                  <span>Routing Confidence: <b>{currentIncident.recommendedPlan.confidence}%</b></span>
                  <span>Estimated Convoy Arrival: <b>{currentIncident.recommendedPlan.eta}</b></span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <button
                    className={`btn-approve-dispatch ${isApproved ? 'approved' : ''}`}
                    onClick={() => onApproveDispatch(currentIncident.id)}
                    style={{ width: '100%', padding: '8px' }}
                  >
                    {isApproved ? '✓ Operational Directive Signed & Active' : 'Sign & Authorize Resupply Directive'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
