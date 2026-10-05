import React, { useState } from 'react';
import { tacticalAudio } from '../../../utils/audio';

export const IplmsDemandForecastView: React.FC = () => {
  const [location, setLocation] = useState('Post Charlie');
  const [supplyClass, setSupplyClass] = useState('Class V - Ammunition');
  const [horizon, setHorizon] = useState<'7' | '30' | '90'>('7');

  return (
    <div className="iplms-view-container">
      {/* Top Filter Controls */}
      <div className="iplms-view-header-bar">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select className="iplms-dropdown-select" value={location} onChange={e => setLocation(e.target.value)}>
            <option>Post Charlie</option>
            <option>Post Delta</option>
            <option>Kargil Depot</option>
            <option>Dras Depot</option>
          </select>

          <select className="iplms-dropdown-select" value={supplyClass} onChange={e => setSupplyClass(e.target.value)}>
            <option>Class V - Ammunition</option>
            <option>Class I - Rations</option>
            <option>Class III - POL (Fuel)</option>
            <option>Medical Supplies</option>
          </select>
        </div>

        <div className="iplms-horizon-tabs">
          <button className={`filter-tab-pill ${horizon === '7' ? 'active' : ''}`} onClick={() => { setHorizon('7'); tacticalAudio.playBlip(); }}>7 Days</button>
          <button className={`filter-tab-pill ${horizon === '30' ? 'active' : ''}`} onClick={() => { setHorizon('30'); tacticalAudio.playBlip(); }}>30 Days</button>
          <button className={`filter-tab-pill ${horizon === '90' ? 'active' : ''}`} onClick={() => { setHorizon('90'); tacticalAudio.playBlip(); }}>90 Days</button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="iplms-grid-4col" style={{ marginBottom: '14px' }}>
        <div className="iplms-kpi-card">
          <div className="iplms-kpi-icon-wrap icon-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div className="iplms-kpi-content">
            <span className="iplms-kpi-label">Current Stock</span>
            <div className="iplms-kpi-val-row">
              <span className="iplms-kpi-value text-orange">30%</span>
              <span className="iplms-meta-sub">(450 units)</span>
            </div>
          </div>
        </div>

        <div className="iplms-kpi-card">
          <div className="iplms-kpi-icon-wrap icon-red">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div className="iplms-kpi-content">
            <span className="iplms-kpi-label">Forecast Demand</span>
            <div className="iplms-kpi-val-row">
              <span className="iplms-kpi-value text-red">+40%</span>
              <span className="iplms-meta-sub">(next 7 days)</span>
            </div>
          </div>
        </div>

        <div className="iplms-kpi-card">
          <div className="iplms-kpi-icon-wrap icon-crimson">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="iplms-kpi-content">
            <span className="iplms-kpi-label">Predicted Depletion</span>
            <div className="iplms-kpi-val-row">
              <span className="iplms-kpi-value text-red">18 hours</span>
            </div>
          </div>
        </div>

        <div className="iplms-kpi-card">
          <div className="iplms-kpi-icon-wrap icon-teal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="iplms-kpi-content">
            <span className="iplms-kpi-label">Confidence</span>
            <div className="iplms-kpi-val-row">
              <span className="iplms-kpi-value" style={{ color: '#10b981' }}>91%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Crossover Curve Chart */}
      <div className="iplms-panel-card iplms-p-4" style={{ marginBottom: '14px' }}>
        <div className="iplms-panel-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h4 className="iplms-panel-title">Demand vs Remaining Reserve Crossover</h4>
            <div className="chart-legend-row">
              <span className="legend-chip"><span className="legend-dot" style={{ backgroundColor: '#ef4444' }}></span> Forecast Demand</span>
              <span className="legend-chip"><span className="legend-dot" style={{ backgroundColor: '#38bdf8' }}></span> Current Stock</span>
              <span className="legend-chip"><span className="legend-line-dashed">---</span> Reorder Level</span>
            </div>
          </div>

          <div className="stockout-alert-pill">
            <span className="pulse-dot-red"></span>
            <span>Stockout Risk &lt; 24 hours</span>
          </div>
        </div>

        {/* SVG Curve */}
        <div style={{ height: '240px', position: 'relative', marginTop: '16px' }}>
          <svg width="100%" height="200" viewBox="0 0 800 200" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.06)" />
            <line x1="0" y1="80" x2="800" y2="80" stroke="rgba(255,255,255,0.06)" />
            <line x1="0" y1="120" x2="800" y2="120" stroke="rgba(255,255,255,0.06)" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="rgba(255,255,255,0.06)" />

            {/* Reorder Level dashed line */}
            <line x1="0" y1="110" x2="800" y2="110" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4" />

            {/* Stock Reserve Decline (Blue) */}
            <path
              d="M0,45 C150,55 300,75 420,110 C540,145 680,170 800,185"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
            />

            {/* Demand Spike (Red) */}
            <path
              d="M0,175 C150,165 300,145 420,110 C540,75 680,50 800,30"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
            />

            {/* Crossover Danger Point */}
            <circle cx="420" cy="110" r="7" fill="#ef4444" />
            <circle cx="420" cy="110" r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
            <line x1="420" y1="20" x2="420" y2="190" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>

          {/* Date Axis */}
          <div className="chart-date-axis">
            <span>04 Oct</span>
            <span>05 Oct</span>
            <span>06 Oct</span>
            <span style={{ color: '#ef4444', fontWeight: 700 }}>07 Oct (CRITICAL)</span>
            <span>08 Oct</span>
            <span>09 Oct</span>
            <span>10 Oct</span>
          </div>
        </div>
      </div>

      {/* Bottom 2 Panels: Forecast Insights (AI) + Contributing Factors */}
      <div className="iplms-grid-2col">
        {/* Forecast Insights (AI) */}
        <div className="iplms-panel-card iplms-p-4">
          <div className="iplms-panel-title-row" style={{ marginBottom: '12px' }}>
            <h4 className="iplms-panel-title">Forecast Insights (AI)</h4>
            <span className="iplms-meta-sub">Neural Prophet v2.4</span>
          </div>
          <div className="insights-list">
            <div className="insight-bullet">
              <span className="bullet-dot red"></span>
              <span>Demand increasing due to forward winter deployment activity</span>
            </div>
            <div className="insight-bullet">
              <span className="bullet-dot orange"></span>
              <span>Current stock is below safety reorder threshold of 35%</span>
            </div>
            <div className="insight-bullet">
              <span className="bullet-dot yellow"></span>
              <span>Primary resupply corridor via Route Charlie blocked by Km 114 Landslide</span>
            </div>
            <div className="insight-bullet">
              <span className="bullet-dot cyan"></span>
              <span>High probability of stockout within 18–22 hours without convoy dispatch</span>
            </div>
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="iplms-panel-card iplms-p-4">
          <div className="iplms-panel-title-row" style={{ marginBottom: '12px' }}>
            <h4 className="iplms-panel-title">Contributing Factors</h4>
            <span className="iplms-meta-sub">SHAP Feature Attribution</span>
          </div>

          <div className="factors-progress-list">
            <div className="factor-progress-item">
              <div className="factor-header">
                <span>Consumption Trend</span>
                <span className="cell-mono font-bold" style={{ color: '#ef4444' }}>42%</span>
              </div>
              <div className="factor-bar-track">
                <div className="factor-bar-fill" style={{ width: '42%', backgroundColor: '#ef4444' }}></div>
              </div>
            </div>

            <div className="factor-progress-item">
              <div className="factor-header">
                <span>Operational Activity</span>
                <span className="cell-mono font-bold" style={{ color: '#f97316' }}>28%</span>
              </div>
              <div className="factor-bar-track">
                <div className="factor-bar-fill" style={{ width: '28%', backgroundColor: '#f97316' }}></div>
              </div>
            </div>

            <div className="factor-progress-item">
              <div className="factor-header">
                <span>Route Availability</span>
                <span className="cell-mono font-bold" style={{ color: '#eab308' }}>18%</span>
              </div>
              <div className="factor-bar-track">
                <div className="factor-bar-fill" style={{ width: '18%', backgroundColor: '#eab308' }}></div>
              </div>
            </div>

            <div className="factor-progress-item">
              <div className="factor-header">
                <span>Weather Impact</span>
                <span className="cell-mono font-bold" style={{ color: '#06b6d4' }}>12%</span>
              </div>
              <div className="factor-bar-track">
                <div className="factor-bar-fill" style={{ width: '12%', backgroundColor: '#06b6d4' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
