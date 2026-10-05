import React from 'react';
import { IPLMS_FLEET, IPLMS_DISPATCHES } from '../../data/iplmsData';

interface IplmsFleetAndDispatchesProps {
  onViewAllFleet?: () => void;
  onViewAllDispatches?: () => void;
}

export const IplmsFleetAndDispatches: React.FC<IplmsFleetAndDispatchesProps> = ({
  onViewAllFleet,
  onViewAllDispatches
}) => {
  return (
    <div className="iplms-fleet-dispatches-grid">
      {/* 1. Fleet Availability & Allocation */}
      <div className="iplms-panel-card fleet-card">
        <div className="iplms-panel-header">
          <h4 className="iplms-widget-title">Fleet Availability &amp; Allocation</h4>
          <button className="iplms-link-btn" onClick={onViewAllFleet}>
            View All →
          </button>
        </div>

        <div className="iplms-fleet-list">
          {IPLMS_FLEET.map((item) => {
            const isLimited = item.status === 'Limited';
            const badgeClass = isLimited ? 'status-pill-limited' : 'status-pill-available';

            return (
              <div key={item.id} className="fleet-row-item">
                <div className="fleet-left-group">
                  <div className="fleet-type-icon">
                    {item.icon === 'truck' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    )}
                    {item.icon === 'atv' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="18" r="3" />
                        <path d="M6 15h12l-2-7H8l-2 7z" />
                      </svg>
                    )}
                    {item.icon === 'drone' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                        <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    )}
                    {item.icon === 'helicopter' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M12 6v6m0 0a4 4 0 0 1 4 4v2H8v-2a4 4 0 0 1 4-4z" />
                        <line x1="5" y1="18" x2="19" y2="18" />
                      </svg>
                    )}
                  </div>
                  <span className="fleet-name">{item.name}</span>
                </div>

                <div className="fleet-right-group">
                  <span className="fleet-counts">
                    <strong>{item.available}</strong> / {item.total}
                  </span>
                  <span className={`fleet-status-pill ${badgeClass}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Ongoing Dispatches */}
      <div className="iplms-panel-card dispatches-card">
        <div className="iplms-panel-header">
          <h4 className="iplms-widget-title">Ongoing Dispatches</h4>
          <button className="iplms-link-btn" onClick={onViewAllDispatches}>
            View All →
          </button>
        </div>

        <div className="iplms-dispatches-list">
          {IPLMS_DISPATCHES.map((dp) => {
            const isHold = dp.status === 'On Hold';
            const isPrep = dp.status === 'Preparing';
            const statusClass = isHold ? 'badge-on-hold' : isPrep ? 'badge-preparing' : 'badge-en-route';

            return (
              <div key={dp.id} className="dispatch-row-item">
                <div className="dispatch-id-box">{dp.id}</div>
                <div className="dispatch-route-info">
                  <span className="dispatch-route-name">{dp.from} → {dp.to}</span>
                </div>
                <div className="dispatch-status-group">
                  <span className={`dispatch-pill ${statusClass}`}>{dp.status}</span>
                  <span className="dispatch-eta">{dp.eta}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
