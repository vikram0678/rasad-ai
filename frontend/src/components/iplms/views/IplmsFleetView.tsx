import React, { useState } from 'react';
import { tacticalAudio } from '../../../utils/audio';

export const IplmsFleetView: React.FC = () => {
  const [subtab, setSubtab] = useState<'overview' | 'vehicles' | 'missions' | 'maintenance'>('overview');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const vehicles = [
    { id: 'TRK-001', type: '6x6 Truck', capacity: '3.5T', loc: 'Base Manali', status: 'Available', statusType: 'available', last: '5 mins ago' },
    { id: 'TRK-045', type: '6x6 Truck', capacity: '3.5T', loc: 'Base Jammu', status: 'En Route', statusType: 'enroute', last: '12 mins ago' },
    { id: 'ATV-012', type: 'All Terrain', capacity: '1.5T', loc: 'Dras Depot', status: 'Available', statusType: 'available', last: '8 mins ago' },
    { id: 'UAV-003', type: 'Logistics Drone', capacity: '200 kg', loc: 'Post Alpha', status: 'Available', statusType: 'available', last: '2 mins ago' },
    { id: 'HL-006', type: 'Helicopter', capacity: '3.0T', loc: 'Srinagar', status: 'Limited', statusType: 'limited', last: '15 mins ago' },
    { id: 'TRK-078', type: '6x6 Truck', capacity: '3.5T', loc: 'Zoji Depot', status: 'Under Maint', statusType: 'maintenance', last: '3 hours ago' },
    { id: 'ATV-019', type: 'All Terrain', capacity: '1.5T', loc: 'Post Bravo', status: 'En Route', statusType: 'enroute', last: '20 mins ago' },
    { id: 'TRK-101', type: '6x6 Truck', capacity: '3.5T', loc: 'Kargil Depot', status: 'Available', statusType: 'available', last: '6 mins ago' },
  ];

  const filteredVehicles = vehicles.filter(v => {
    if (typeFilter !== 'All' && !v.type.includes(typeFilter)) return false;
    if (statusFilter !== 'All' && v.status !== statusFilter) return false;
    if (search && !v.id.toLowerCase().includes(search.toLowerCase()) && !v.loc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="iplms-view-container">
      {/* Subtabs Bar */}
      <div className="iplms-view-header-bar">
        <div className="iplms-subtabs-group">
          <button className={`subtab-btn ${subtab === 'overview' ? 'active' : ''}`} onClick={() => { setSubtab('overview'); tacticalAudio.playBlip(); }}>Overview</button>
          <button className={`subtab-btn ${subtab === 'vehicles' ? 'active' : ''}`} onClick={() => { setSubtab('vehicles'); tacticalAudio.playBlip(); }}>Vehicles</button>
          <button className={`subtab-btn ${subtab === 'missions' ? 'active' : ''}`} onClick={() => { setSubtab('missions'); tacticalAudio.playBlip(); }}>Missions</button>
          <button className={`subtab-btn ${subtab === 'maintenance' ? 'active' : ''}`} onClick={() => { setSubtab('maintenance'); tacticalAudio.playBlip(); }}>Maintenance</button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="iplms-grid-4col" style={{ marginBottom: '14px' }}>
        <div className="iplms-kpi-card">
          <div className="iplms-kpi-icon-wrap icon-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div className="iplms-kpi-content">
            <span className="iplms-kpi-label">Total Vehicles</span>
            <div className="iplms-kpi-val-row">
              <span className="iplms-kpi-value">144</span>
            </div>
          </div>
        </div>

        <div className="iplms-kpi-card">
          <div className="iplms-kpi-icon-wrap icon-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="iplms-kpi-content">
            <span className="iplms-kpi-label">Available</span>
            <div className="iplms-kpi-val-row">
              <span className="iplms-kpi-value" style={{ color: '#10b981' }}>89</span>
              <span className="iplms-meta-sub">(62%)</span>
            </div>
          </div>
        </div>

        <div className="iplms-kpi-card">
          <div className="iplms-kpi-icon-wrap icon-yellow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <polygon points="12 2 19 21 12 17 5 21 12 2" />
            </svg>
          </div>
          <div className="iplms-kpi-content">
            <span className="iplms-kpi-label">Deployed</span>
            <div className="iplms-kpi-val-row">
              <span className="iplms-kpi-value text-orange">38</span>
              <span className="iplms-meta-sub">(26%)</span>
            </div>
          </div>
        </div>

        <div className="iplms-kpi-card">
          <div className="iplms-kpi-icon-wrap icon-red">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div className="iplms-kpi-content">
            <span className="iplms-kpi-label">Under Maintenance</span>
            <div className="iplms-kpi-val-row">
              <span className="iplms-kpi-value text-red">17</span>
              <span className="iplms-meta-sub">(12%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Filter Bar & Table Card */}
      <div className="iplms-panel-card">
        <div className="iplms-panel-header">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select className="iplms-dropdown-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="All">All Vehicle Types</option>
              <option value="Truck">6x6 Trucks</option>
              <option value="Terrain">All Terrain</option>
              <option value="Drone">Logistics Drones</option>
              <option value="Helicopter">Helicopters</option>
            </select>

            <select className="iplms-dropdown-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="En Route">En Route</option>
              <option value="Limited">Limited</option>
              <option value="Under Maint">Under Maintenance</option>
            </select>
          </div>

          <input
            type="text"
            className="iplms-table-search"
            placeholder="Search vehicle ID or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <table className="iplms-incident-table-full">
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Status</th>
              <th>Last Known</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map(veh => (
              <tr key={veh.id} className="incident-full-row">
                <td className="cell-mono font-bold" style={{ color: '#38bdf8' }}>{veh.id}</td>
                <td>{veh.type}</td>
                <td className="cell-mono">{veh.capacity}</td>
                <td><strong>{veh.loc}</strong></td>
                <td>
                  <span className={`status-pill status-${veh.statusType}`}>
                    {veh.status}
                  </span>
                </td>
                <td className="cell-mono" style={{ color: '#94a3b8' }}>{veh.last}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="iplms-view-btn">
                    Track
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
