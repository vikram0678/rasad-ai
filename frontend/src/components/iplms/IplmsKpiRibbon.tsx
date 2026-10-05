import React from 'react';

interface IplmsKpiRibbonProps {
  onCardClick?: (kpiKey: string) => void;
}

export const IplmsKpiRibbon: React.FC<IplmsKpiRibbonProps> = ({ onCardClick }) => {
  return (
    <div className="iplms-kpi-grid">
      {/* 1. Total Locations */}
      <div className="iplms-kpi-card" onClick={() => onCardClick?.('locations')} role="button" tabIndex={0}>
        <div className="iplms-kpi-icon-wrap icon-blue">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="iplms-kpi-content">
          <div className="iplms-kpi-label">Total Locations</div>
          <div className="iplms-kpi-value">28</div>
          <div className="iplms-kpi-subtext">5 Bases &nbsp;|&nbsp; 8 Depots &nbsp;|&nbsp; 15 Posts</div>
        </div>
      </div>

      {/* 2. Active Incidents */}
      <div className="iplms-kpi-card kpi-alert" onClick={() => onCardClick?.('incidents')} role="button" tabIndex={0}>
        <div className="iplms-kpi-icon-wrap icon-red">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="iplms-kpi-content">
          <div className="iplms-kpi-label">Active Incidents</div>
          <div className="iplms-kpi-value value-red">13</div>
          <div className="iplms-kpi-subtext">
            <span className="text-red">3 Critical</span> &nbsp;|&nbsp; <span className="text-orange">5 High</span> &nbsp;|&nbsp; <span className="text-yellow">5 Warning</span>
          </div>
        </div>
      </div>

      {/* 3. Critical Shortages */}
      <div className="iplms-kpi-card" onClick={() => onCardClick?.('shortages')} role="button" tabIndex={0}>
        <div className="iplms-kpi-icon-wrap icon-crimson">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="iplms-kpi-content">
          <div className="iplms-kpi-label">Critical Shortages (≤ 24h)</div>
          <div className="iplms-kpi-value value-crimson">3</div>
          <div className="iplms-kpi-subtext">Across 3 locations</div>
        </div>
      </div>

      {/* 4. Routes Blocked */}
      <div className="iplms-kpi-card" onClick={() => onCardClick?.('routes')} role="button" tabIndex={0}>
        <div className="iplms-kpi-icon-wrap icon-purple">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="19" r="3" />
            <path d="M9 19h8.5a4.5 4.5 0 0 0 4.5-4.5v0a4.5 4.5 0 0 0-4.5-4.5H11" />
            <circle cx="18" cy="5" r="3" />
            <line x1="6" y1="12" x2="6" y2="16" />
            <line x1="4" y1="10" x2="8" y2="14" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="8" y1="10" x2="4" y2="14" stroke="#ef4444" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="iplms-kpi-content">
          <div className="iplms-kpi-label">Routes Blocked</div>
          <div className="iplms-kpi-value">2</div>
          <div className="iplms-kpi-subtext">Out of 18 active routes</div>
        </div>
      </div>

      {/* 5. Fleet Availability */}
      <div className="iplms-kpi-card" onClick={() => onCardClick?.('fleet')} role="button" tabIndex={0}>
        <div className="iplms-kpi-icon-wrap icon-cyan">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <div className="iplms-kpi-content">
          <div className="iplms-kpi-label">Fleet Availability</div>
          <div className="iplms-kpi-value">62%</div>
          <div className="iplms-kpi-subtext">89 / 144 vehicles</div>
        </div>
      </div>

      {/* 6. Total Inventory Value */}
      <div className="iplms-kpi-card" onClick={() => onCardClick?.('inventory')} role="button" tabIndex={0}>
        <div className="iplms-kpi-icon-wrap icon-teal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        </div>
        <div className="iplms-kpi-content">
          <div className="iplms-kpi-label">Total Inventory Value</div>
          <div className="iplms-kpi-value-row">
            <span className="iplms-kpi-value">₹ 124 Cr</span>
            <span className="iplms-kpi-delta-pill">↑ 2.4%</span>
          </div>
          <div className="iplms-kpi-subtext">vs last week</div>
        </div>
      </div>
    </div>
  );
};
