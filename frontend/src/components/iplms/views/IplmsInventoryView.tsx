import React, { useState } from 'react';
import { tacticalAudio } from '../../../utils/audio';

export const IplmsInventoryView: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('Class V - Ammunition');

  const classes = [
    'Class I - Rations',
    'Class II - Clothing',
    'Class III - POL (Fuel)',
    'Class IV - Construction',
    'Class V - Ammunition',
    'Medical Supplies',
    'Engineering Stores',
    'Others'
  ];

  const stockRows = [
    { loc: 'Base Jammu', stock: 82, status: 'Healthy', statusType: 'healthy', reorder: '30%', trendColor: '#10b981' },
    { loc: 'Base Srinagar', stock: 78, status: 'Healthy', statusType: 'healthy', reorder: '30%', trendColor: '#10b981' },
    { loc: 'Base Leh', stock: 65, status: 'Warning', statusType: 'warning', reorder: '40%', trendColor: '#f59e0b' },
    { loc: 'Base Manali', stock: 70, status: 'Healthy', statusType: 'healthy', reorder: '35%', trendColor: '#10b981' },
    { loc: 'Kargil Depot', stock: 60, status: 'Warning', statusType: 'warning', reorder: '40%', trendColor: '#f59e0b' },
    { loc: 'Dras Depot', stock: 48, status: 'Low', statusType: 'low', reorder: '50%', trendColor: '#f97316' },
    { loc: 'Zoji Depot', stock: 75, status: 'Healthy', statusType: 'healthy', reorder: '35%', trendColor: '#10b981' },
    { loc: 'Post Charlie', stock: 30, status: 'Critical', statusType: 'critical', reorder: '60%', trendColor: '#ef4444' },
    { loc: 'Post Delta', stock: 42, status: 'Warning', statusType: 'warning', reorder: '50%', trendColor: '#f59e0b' },
    { loc: 'Post Foxtrot', stock: 52, status: 'Warning', statusType: 'warning', reorder: '45%', trendColor: '#f59e0b' },
  ];

  return (
    <div className="iplms-view-container">
      {/* Top 4 KPI Cards */}
      <div className="iplms-grid-4col" style={{ marginBottom: '14px' }}>
        <div className="iplms-kpi-card">
          <div className="iplms-kpi-icon-wrap icon-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div className="iplms-kpi-content">
            <span className="iplms-kpi-label">Total Inventory Items</span>
            <div className="iplms-kpi-val-row">
              <span className="iplms-kpi-value">1,240</span>
            </div>
          </div>
        </div>

        <div className="iplms-kpi-card">
          <div className="iplms-kpi-icon-wrap icon-red">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <polygon points="12 2 2 22 22 22 12 2" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <circle cx="12" cy="17" r="1" fill="#ef4444" />
            </svg>
          </div>
          <div className="iplms-kpi-content">
            <span className="iplms-kpi-label">Critical Items</span>
            <div className="iplms-kpi-val-row">
              <span className="iplms-kpi-value text-red">38</span>
            </div>
          </div>
        </div>

        <div className="iplms-kpi-card">
          <div className="iplms-kpi-icon-wrap icon-yellow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="iplms-kpi-content">
            <span className="iplms-kpi-label">Low Stock Items</span>
            <div className="iplms-kpi-val-row">
              <span className="iplms-kpi-value text-orange">112</span>
            </div>
          </div>
        </div>

        <div className="iplms-kpi-card">
          <div className="iplms-kpi-icon-wrap icon-cyan">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div className="iplms-kpi-content">
            <span className="iplms-kpi-label">Inventory Value</span>
            <div className="iplms-kpi-val-row">
              <span className="iplms-kpi-value">₹ 124 Cr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="inventory-view-grid">
        {/* Left: Supply Classes Sidebar */}
        <div className="iplms-panel-card iplms-p-3" style={{ height: 'fit-content' }}>
          <div className="iplms-panel-title-row" style={{ marginBottom: '10px' }}>
            <h4 className="iplms-panel-title">Supply Classes</h4>
          </div>
          <div className="supply-classes-list">
            {classes.map((cls, i) => (
              <button
                key={i}
                className={`supply-class-btn ${selectedClass === cls ? 'active' : ''}`}
                onClick={() => {
                  setSelectedClass(cls);
                  tacticalAudio.playBlip();
                }}
              >
                <span className="class-dot"></span>
                <span>{cls}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Inventory Ledger Table */}
        <div className="iplms-panel-card">
          <div className="iplms-panel-header">
            <div>
              <h3 className="iplms-panel-title">{selectedClass}</h3>
              <span className="iplms-meta-sub">Active Stock Ledger across Ladakh Theatre</span>
            </div>
            <button className="iplms-action-btn primary">
              <span>+ Add Supply Record</span>
            </button>
          </div>

          <table className="iplms-incident-table-full">
            <thead>
              <tr>
                <th>Location</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Reorder Level</th>
                <th>Trend</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockRows.map((row, i) => (
                <tr key={i} className="incident-full-row">
                  <td className="cell-loc">
                    <strong>{row.loc}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="stock-progress-track">
                        <div
                          className="stock-progress-fill"
                          style={{
                            width: `${row.stock}%`,
                            backgroundColor: row.trendColor
                          }}
                        ></div>
                      </div>
                      <span className="cell-mono">{row.stock}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill status-${row.statusType}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="cell-mono">{row.reorder}</td>
                  <td>
                    <svg width="60" height="18" viewBox="0 0 60 18">
                      <path
                        d="M0,14 Q15,4 30,12 T60,6"
                        fill="none"
                        stroke={row.trendColor}
                        strokeWidth="2"
                      />
                    </svg>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="iplms-view-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
