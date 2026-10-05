import React, { useState } from 'react';
import { tacticalAudio } from '../../../utils/audio';

export const IplmsReportsView: React.FC = () => {
  const [subtab, setSubtab] = useState<'health' | 'trends' | 'perf' | 'export'>('health');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [locFilter, setLocFilter] = useState('All Locations');

  return (
    <div className="iplms-view-container">
      {/* Header Tabs & Filters */}
      <div className="iplms-view-header-bar">
        <div className="iplms-subtabs-group">
          <button className={`subtab-btn ${subtab === 'health' ? 'active' : ''}`} onClick={() => { setSubtab('health'); tacticalAudio.playBlip(); }}>Logistics Health</button>
          <button className={`subtab-btn ${subtab === 'trends' ? 'active' : ''}`} onClick={() => { setSubtab('trends'); tacticalAudio.playBlip(); }}>Trends</button>
          <button className={`subtab-btn ${subtab === 'perf' ? 'active' : ''}`} onClick={() => { setSubtab('perf'); tacticalAudio.playBlip(); }}>Performance</button>
          <button className={`subtab-btn ${subtab === 'export' ? 'active' : ''}`} onClick={() => { setSubtab('export'); tacticalAudio.playBlip(); }}>Export</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select className="iplms-dropdown-select" value={timeRange} onChange={e => setTimeRange(e.target.value)}>
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
            <option>Winter Season 2026</option>
          </select>

          <select className="iplms-dropdown-select" value={locFilter} onChange={e => setLocFilter(e.target.value)}>
            <option>All Locations</option>
            <option>Northern Command (14 Corps)</option>
            <option>Dras Sub-Sector</option>
            <option>Siachen Base</option>
          </select>

          <button className="iplms-action-btn primary" onClick={() => tacticalAudio.playSonar()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* 2x2 Analytics Grid */}
      <div className="iplms-grid-2col" style={{ gap: '14px' }}>
        {/* 1. Network Resilience Trend */}
        <div className="iplms-panel-card iplms-p-4">
          <div className="iplms-panel-title-row">
            <h4 className="iplms-panel-title">Network Resilience Trend</h4>
            <span className="iplms-meta-sub">Score: 84 / 100</span>
          </div>

          <div style={{ height: '180px', position: 'relative', marginTop: '12px' }}>
            <svg width="100%" height="140" viewBox="0 0 400 140" preserveAspectRatio="none">
              <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(255,255,255,0.06)" />
              <line x1="0" y1="70" x2="400" y2="70" stroke="rgba(255,255,255,0.06)" />
              <line x1="0" y1="110" x2="400" y2="110" stroke="rgba(255,255,255,0.06)" />

              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points="10,95 100,110 200,60 300,75 390,40"
              />
              <circle cx="10" cy="95" r="3.5" fill="#10b981" />
              <circle cx="100" cy="110" r="3.5" fill="#10b981" />
              <circle cx="200" cy="60" r="4.5" fill="#10b981" />
              <circle cx="300" cy="75" r="3.5" fill="#10b981" />
              <circle cx="390" cy="40" r="5" fill="#10b981" />
            </svg>
            <div className="chart-date-axis">
              <span>10 Sep</span>
              <span>17 Sep</span>
              <span>24 Sep</span>
              <span>01 Oct</span>
            </div>
          </div>
        </div>

        {/* 2. Incident Resolution Time */}
        <div className="iplms-panel-card iplms-p-4">
          <div className="iplms-panel-title-row">
            <h4 className="iplms-panel-title">Incident Resolution Time</h4>
            <span className="iplms-meta-sub">Avg 18.4 Hours</span>
          </div>

          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '24px', padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ height: '50px', width: '36px', background: '#38bdf8', borderRadius: '4px' }}></div>
              <span className="cell-mono" style={{ fontSize: '0.65rem' }}>Class I</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ height: '70px', width: '36px', background: '#06b6d4', borderRadius: '4px' }}></div>
              <span className="cell-mono" style={{ fontSize: '0.65rem' }}>Class III</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ height: '120px', width: '36px', background: '#ef4444', borderRadius: '4px' }}></div>
              <span className="cell-mono font-bold" style={{ fontSize: '0.65rem', color: '#ef4444' }}>Class V (Ammo)</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ height: '40px', width: '36px', background: '#10b981', borderRadius: '4px' }}></div>
              <span className="cell-mono" style={{ fontSize: '0.65rem' }}>Medical</span>
            </div>
          </div>
        </div>

        {/* 3. Supply Class Consumption */}
        <div className="iplms-panel-card iplms-p-4">
          <div className="iplms-panel-title-row">
            <h4 className="iplms-panel-title">Supply Class Consumption</h4>
            <div className="chart-legend-row">
              <span className="legend-chip"><span className="legend-dot" style={{ background: '#0284c7' }}></span> Base</span>
              <span className="legend-chip"><span className="legend-dot" style={{ background: '#10b981' }}></span> Depots</span>
              <span className="legend-chip"><span className="legend-dot" style={{ background: '#f43f5e' }}></span> Posts</span>
            </div>
          </div>

          <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: '20px' }}>
            {['Class I', 'Class II', 'Class III', 'Class V', 'Medical'].map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
                  <div style={{ width: '10px', height: `${40 + (idx * 12)}px`, background: '#0284c7', borderRadius: '2px' }}></div>
                  <div style={{ width: '10px', height: `${55 + (idx * 8)}px`, background: '#10b981', borderRadius: '2px' }}></div>
                  <div style={{ width: '10px', height: `${75 - (idx * 6)}px`, background: '#f43f5e', borderRadius: '2px' }}></div>
                </div>
                <span className="cell-mono" style={{ fontSize: '0.65rem' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Prediction Accuracy */}
        <div className="iplms-panel-card iplms-p-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="iplms-panel-title-row">
            <h4 className="iplms-panel-title">Prediction Accuracy (Last 30 Days)</h4>
            <span className="iplms-meta-sub">MAPE: 6.3%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '20px 0' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="110" height="110" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeDasharray="93.7, 100"
                />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>93.7%</span>
                <span style={{ display: 'block', fontSize: '0.60rem', color: '#94a3b8' }}>Accuracy</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="accuracy-stat-item">
                <span className="meta-dim">Model:</span>
                <strong style={{ color: '#38bdf8' }}> Prophet + XGBoost Ensemble</strong>
              </div>
              <div className="accuracy-stat-item">
                <span className="meta-dim">Mean Absolute Error:</span>
                <strong className="cell-mono"> 14.2 units</strong>
              </div>
              <div className="accuracy-stat-item">
                <span className="meta-dim">False Positive Stockout:</span>
                <strong style={{ color: '#10b981' }}> &lt; 1.8%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
