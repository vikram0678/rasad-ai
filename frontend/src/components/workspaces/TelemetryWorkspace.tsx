import React, { useState } from 'react';
import { tacticalAudio } from '../../utils/audio';

interface TelemetryWorkspaceProps {
  isSpoofed: boolean;
  onSpoofToggle: (spoofed: boolean) => void;
  onNotify: (msg: string) => void;
}

const SATELLITE_LOCKS = [
  { prn: 'NavIC-01 (IRNSS-1A)', elevation: '68°', azimuth: '142°', snr: '46 dB-Hz', status: 'LOCKED_SECURE' },
  { prn: 'NavIC-02 (IRNSS-1B)', elevation: '54°', azimuth: '210°', snr: '44 dB-Hz', status: 'LOCKED_SECURE' },
  { prn: 'NavIC-03 (IRNSS-1C)', elevation: '72°', azimuth: '095°', snr: '47 dB-Hz', status: 'LOCKED_SECURE' },
  { prn: 'NavIC-04 (IRNSS-1D)', elevation: '41°', azimuth: '315°', snr: '42 dB-Hz', status: 'LOCKED_SECURE' },
  { prn: 'RISAT-2B (SAR Recon)', elevation: '81°', azimuth: '180°', snr: '52 dB-Hz', status: 'ORBIT_OVERHEAD' },
  { prn: 'GSAT-7A (Rukmini IAF)', elevation: '63°', azimuth: '160°', snr: '49 dB-Hz', status: 'DATA_LINK_ENCRYPTED' }
];

export const TelemetryWorkspace: React.FC<TelemetryWorkspaceProps> = ({
  isSpoofed,
  onSpoofToggle,
  onNotify
}) => {
  const [kalmanFilterActive, setKalmanFilterActive] = useState<boolean>(true);
  const [rfGain, setRfGain] = useState<number>(45);

  const handleTestJamming = () => {
    const next = !isSpoofed;
    onSpoofToggle(next);
    if (next) {
      tacticalAudio.playAlert();
      onNotify('ELECTRONIC WARFARE ALERT: Injected hostile GPS spoofing vector on 1575.42 MHz (L1).');
    } else {
      tacticalAudio.playSonar();
      onNotify('ELECTRONIC WARFARE: Restored authentic NavIC / GPS constellation lock.');
    }
  };

  return (
    <div className="command-overview-container">
      {/* Workspace Header */}
      <div className="overview-header">
        <div className="overview-title-group">
          <div className="subtag">RASAD / RESILIENCE / ELECTRONIC WARFARE (EW) &amp; ANTI-SPOOFING</div>
          <h1>Telemetry &amp; Electronic Warfare Resilience Console</h1>
          <div className="subtitle">
            Carrier-to-Noise density monitoring (L1/L5), NavIC / IRNSS constellation lock, and Kalman Filter Inertial Navigation System (INS) failover.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleTestJamming}
            className="btn-export-brief"
            style={{
              background: isSpoofed ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.2)',
              borderColor: isSpoofed ? '#ef4444' : '#38bdf8',
              color: isSpoofed ? '#fca5a5' : '#38bdf8'
            }}
          >
            {isSpoofed ? '⚠️ Disengage Hostile GPS Jamming' : '⚡ Simulate Hostile GPS Jamming'}
          </button>
        </div>
      </div>

      {/* 4 Status KPI Cards */}
      <div className="executive-kpi-grid">
        <div className={`exec-kpi-card ${isSpoofed ? 'alert-card' : ''}`}>
          <div className="exec-kpi-header">
            <span className="exec-kpi-title">RF Spectrum Integrity</span>
            <span className="exec-kpi-icon">🛰️</span>
          </div>
          <div className={`exec-kpi-val ${isSpoofed ? 'alert-val' : ''}`} style={{ color: isSpoofed ? '#ef4444' : '#10b981' }}>
            {isSpoofed ? 'SPOOF DETECTED' : 'CLEAR (46 dB-Hz)'}
          </div>
          <div className="exec-kpi-sub">
            {isSpoofed ? 'Pseudorange Residual Divergence > 500m' : 'Carrier signal SNR healthy'}
          </div>
        </div>

        <div className="exec-kpi-card">
          <div className="exec-kpi-header">
            <span className="exec-kpi-title">Navigation Failover Mode</span>
            <span className="exec-kpi-icon">🧭</span>
          </div>
          <div className="exec-kpi-val" style={{ color: isSpoofed ? '#f59e0b' : '#38bdf8' }}>
            {isSpoofed ? 'INS DEAD-RECKONING' : 'PRIMARY NAVIC + GPS'}
          </div>
          <div className="exec-kpi-sub">
            {isSpoofed ? 'Inertial Ring-Laser Gyro active' : '7-channel military crypto lock'}
          </div>
        </div>

        <div className="exec-kpi-card">
          <div className="exec-kpi-header">
            <span className="exec-kpi-title">Kalman Filter Status</span>
            <span className="exec-kpi-icon">🛡️</span>
          </div>
          <div className="exec-kpi-val" style={{ color: '#10b981' }}>
            ENGAGED (60 Hz)
          </div>
          <div className="exec-kpi-sub">Accelerometers + Wheel Odometry</div>
        </div>

        <div className="exec-kpi-card">
          <div className="exec-kpi-header">
            <span className="exec-kpi-title">Estimated Position Error</span>
            <span className="exec-kpi-icon">📍</span>
          </div>
          <div className="exec-kpi-val" style={{ color: isSpoofed ? '#f59e0b' : '#10b981' }}>
            {isSpoofed ? '&plusmn; 4.8 meters' : '&plusmn; 0.9 meters'}
          </div>
          <div className="exec-kpi-sub">Within safe canyon tracking tolerances</div>
        </div>
      </div>

      {/* Two Column Layout: Spectrum Waterfall (Left) + Satellite Locks Table (Right) */}
      <div className="overview-split-row">
        {/* Left: GPS vs INS Deviation Monitor */}
        <div className="operating-picture-panel">
          <div className="operating-picture-header">
            <div className="operating-title-block">
              <h3>GPS vs. Inertial Sensor Sanity Monitor</h3>
              <p>Real-time cross-check of wheel odometry against satellite reported velocity</p>
            </div>
            <span className={`badge-outpost-count ${isSpoofed ? 'alert-val' : ''}`}>
              {isSpoofed ? 'ANOMALY DETECTED' : 'NORMAL LINK'}
            </span>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Reported Satellite Lat/Lng:</span>
                <span style={{ color: isSpoofed ? '#ef4444' : '#f8fafc', fontWeight: 'bold' }}>
                  {isSpoofed ? '34.8920° N, 78.4410° E (ANOMALOUS DRIFT)' : '34.6200° N, 77.7500° E (AUTHORIZED ROUTE)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Inertial Ring Gyro Lat/Lng:</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                  34.6202° N, 77.7504° E (TRUE GROUND TRACK)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Kalman Filter Residual Error:</span>
                <span style={{ color: isSpoofed ? '#ef4444' : '#38bdf8', fontWeight: 'bold' }}>
                  {isSpoofed ? '12,410 meters (EXCEEDS 50m THRESHOLD)' : '1.4 meters (HEALTHY)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>RF Carrier Jamming Ratio:</span>
                <span style={{ color: isSpoofed ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                  {isSpoofed ? 'J/S = +38 dB (CRITICAL JAMMING DETECTED)' : 'J/S = -18 dB (CLEAR BACKGROUND)'}
                </span>
              </div>
            </div>

            {/* Simulated Waterfall Spectrum Visual */}
            <div style={{ height: '90px', background: '#050a14', border: '1px solid #1e293b', borderRadius: '6px', position: 'relative', overflow: 'hidden', padding: '10px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#64748b', marginBottom: '4px' }}>
                RF CARRIER FREQUENCY WATERFALL SPECTRUM (1575.42 MHz &plusmn; 10 MHz)
              </div>
              <div style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
                {Array.from({ length: 48 }).map((_, i) => {
                  const isCenter = i >= 20 && i <= 28;
                  const height = isSpoofed
                    ? (isCenter ? 36 : Math.random() * 25 + 5)
                    : (isCenter ? 24 : Math.random() * 8 + 3);
                  const color = isSpoofed ? (isCenter ? '#ef4444' : '#f59e0b') : (isCenter ? '#38bdf8' : '#1e293b');
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${height}px`,
                        background: color,
                        borderRadius: '2px',
                        transition: 'height 0.3s ease'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: NavIC / Military Satellite Constellation Locks */}
        <div className="priority-watch-panel">
          <div className="priority-watch-header">
            <div>
              <h3>Space-Based Positioning Constellation</h3>
              <span className="count">NavIC (IRNSS) &amp; Tactical Satcom</span>
            </div>
            <span className="badge-open-decisions">6 SATELLITES</span>
          </div>

          <div className="dispatches-table-wrapper" style={{ padding: '0 8px' }}>
            <table className="c4isr-table">
              <thead>
                <tr>
                  <th>SATELLITE PRN</th>
                  <th>ELEV / AZ</th>
                  <th>SNR</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {SATELLITE_LOCKS.map(sat => (
                  <tr key={sat.prn}>
                    <td>
                      <b style={{ color: '#f8fafc', fontSize: '0.78rem' }}>{sat.prn}</b>
                    </td>
                    <td>{sat.elevation} / {sat.azimuth}</td>
                    <td style={{ color: '#38bdf8' }}>{sat.snr}</td>
                    <td>
                      <span className="status-pill-dispatch approved" style={{ fontSize: '0.65rem' }}>
                        {sat.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
