import React, { useState, useEffect } from 'react';

interface IplmsHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNotificationClick: () => void;
  onStartTour?: () => void;
  incidentCount?: number;
}

export const IplmsHeader: React.FC<IplmsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onNotificationClick,
  onStartTour,
  incidentCount = 7
}) => {
  const [currentTime, setCurrentTime] = useState<string>('04 Oct 2026 11:06:24');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as DD Mon YYYY HH:mm:ss
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = String(now.getDate()).padStart(2, '0');
      const mon = months[now.getMonth()];
      const year = now.getFullYear();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${day} ${mon} ${year} ${h}:${m}:${s}`);
    };
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="iplms-header">
      {/* Brand & Identity */}
      <div className="iplms-brand-group">
        <div className="iplms-logo-icon">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 30,28 2,28" stroke="#38bdf8" strokeWidth="2.5" fill="rgba(56, 189, 248, 0.15)" />
            <polygon points="16,10 24,25 8,25" stroke="#0ea5e9" strokeWidth="1.8" fill="rgba(14, 165, 233, 0.3)" />
            <circle cx="16" cy="18" r="3" fill="#38bdf8" />
          </svg>
        </div>
        <div className="iplms-title-stack">
          <div className="iplms-system-name">
            <span className="iplms-acronym">RASAD-AI</span>
            <span className="iplms-full-title">Indian Army - Integrated Predictive Logistics Management System</span>
          </div>
          <div className="iplms-sub-org">
            Ministry of Defence &nbsp;|&nbsp; Defence Services Staff College
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="iplms-search-container">
        <div className="iplms-search-box">
          <svg className="iplms-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="iplms-search-input"
            placeholder="Search base, depot, post, route or asset..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* System Telemetry & Role Badges */}
      <div className="iplms-header-right">
        {/* System Health */}
        <div className="iplms-status-chip">
          <span className="iplms-chip-label">System Status</span>
          <span className="iplms-indicator-dot secure"></span>
          <span className="iplms-indicator-val">SECURE</span>
        </div>

        {/* SATCOM Connectivity */}
        <div className="iplms-status-chip">
          <span className="iplms-chip-label">SATCOM</span>
          <span className="iplms-indicator-dot online"></span>
          <span className="iplms-indicator-val">ONLINE</span>
        </div>

        {/* Tactical Clock */}
        <div className="iplms-time-stamp" title="Synchronized Indian Standard Time (IST)">
          {currentTime}
        </div>

        {/* ✨ Guided Operational Quick Tour */}
        <button
          id="btn-start-quick-tour"
          className="iplms-tour-btn"
          onClick={onStartTour}
          title="Take a 60-Second Guided Operational Tour of RASAD-AI"
        >
          <span className="tour-sparkle-star">✨</span>
          <span>Quick Tour</span>
        </button>

        {/* Alert Bell */}
        <button
          className="iplms-bell-btn"
          onClick={onNotificationClick}
          title="Active Directives & Alerts"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {incidentCount > 0 && <span className="iplms-bell-badge">{incidentCount}</span>}
        </button>

        {/* User / Commander Profile */}
        <div className="iplms-user-chip">
          <div className="iplms-user-avatar">OC</div>
          <div className="iplms-user-meta">
            <div className="iplms-user-name">Ops Commander</div>
            <div className="iplms-user-command">Northern Command</div>
          </div>
        </div>
      </div>
    </header>
  );
};
