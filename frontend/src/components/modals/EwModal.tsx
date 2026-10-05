import React, { useState } from 'react';

interface EwModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
  onSpoofStatusChange: (isSpoofed: boolean) => void;
}

export const EwModal: React.FC<EwModalProps> = ({
  isOpen,
  onClose,
  onNotify,
  onSpoofStatusChange
}) => {
  const [rawGps, setRawGps] = useState('34.7215° N, 77.8142° E (Alt: 4,410m)');
  const [kalmanGps, setKalmanGps] = useState('34.7214° N, 77.8140° E (Innovation: 0.0002)');
  const [velocity, setVelocity] = useState('28.4 km/h (Mountain Threshold: ≤120 km/h)');
  const [isSpoofed, setIsSpoofed] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[18:42:01 IST] [EW-CORE] 1D Kalman Filter initialised. Measurement noise R=0.50, Q=0.01.',
    '[18:42:04 IST] [GPS-SEC] Convoy RUDRA-01 beacon verified against RISAT-2B Doppler radar.',
    '[18:42:08 IST] [AIR-GAP] Local Toughbook VHF tactical mesh authenticated with HMAC-SHA256.'
  ]);

  if (!isOpen) return null;

  const appendLog = (msg: string) => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setTerminalLogs(prev => [...prev, `[${timeStr} IST] ${msg}`]);
  };

  const handleTestNormalGps = () => {
    setRawGps('34.7215° N, 77.8142° E (Alt: 4,410m)');
    setKalmanGps('34.7214° N, 77.8140° E (Innovation: 0.0002)');
    setVelocity('28.4 km/h (Mountain Threshold: ≤120 km/h)');
    setIsSpoofed(false);
    onSpoofStatusChange(false);
    appendLog('[GPS-VALID] Kalman filter residual 0.0002 < 0.005 threshold. Beacon verified.');
    onNotify('🛰️ EW Integrity Check Passed: Convoy RUDRA-01 GPS Authenticated');
  };

  const handleSimulateSpoof = () => {
    setRawGps('36.8500° N, 80.2100° E (SPOOFED BEACON)');
    setKalmanGps('34.7220° N, 77.8150° E (KALMAN REJECTED JUMP)');
    setVelocity('485.2 km/h (VIOLATION: Exceeds 120 km/h limit!)');
    setIsSpoofed(true);
    onSpoofStatusChange(true);
    appendLog('[EW-ALERT] GPS MEACONING DETECTED! Velocity 485 km/h exceeds 120 km/h threshold. Reverting to Dead-Reckoning IMU!');
    onNotify('🚨 EW ALERT: GPS Spoofing Attack Intercepted by Kalman Vector Shield!');
  };

  return (
    <div className="tactical-modal-backdrop open" onClick={onClose}>
      <div className="tactical-modal-box" style={{ maxWidth: '780px' }} onClick={e => e.stopPropagation()}>
        <div className="tactical-modal-header">
          <div className="tactical-modal-title">
            <span>🛰️</span> ELECTRONIC WARFARE (EW) &amp; KALMAN FILTER ANTI-SPOOF HUB
          </div>
          <button className="drawer-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="tactical-modal-body">
          <div style={{ marginBottom: '14px', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45 }}>
            Active electronic warfare resilience monitor. Filters malicious GPS meaconing, phantom teleportation jumps, and warehouse manifest tampering using a <b>1D Kalman Filter</b> with velocity boundary checks (v ≤ 120 km/h).
          </div>

          <div className="ew-telemetry-panel">
            <div className="ew-stat-row">
              <span className="label">Target Convoy:</span>
              <span className="val">CONVOY-RUDRA-01 (Tatra 8x8)</span>
            </div>
            <div className="ew-stat-row">
              <span className="label">Raw GPS Coordinate:</span>
              <span className="val">{rawGps}</span>
            </div>
            <div className="ew-stat-row">
              <span className="label">1D Kalman Filter Position Estimate:</span>
              <span className="val" style={{ color: '#38bdf8' }}>{kalmanGps}</span>
            </div>
            <div className="ew-stat-row">
              <span className="label">Calculated Velocity Vector:</span>
              <span className="val">{velocity}</span>
            </div>
            <div className="ew-stat-row">
              <span className="label">EW Anti-Spoof Status:</span>
              <span className={`val ${isSpoofed ? 'spoofed' : 'secure'}`}>
                {isSpoofed
                  ? '🚨 SPOOFING DETECTED: ADVERSARIAL MEACONING INTERCEPTED!'
                  : '🟢 SECURE — ZERO GPS SPOOFING DETECTED'}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
            <button className="action-execute-btn" onClick={handleTestNormalGps} style={{ flex: 1, justifyContent: 'center' }}>
              ✓ Validate Normal GPS Beacon
            </button>
            <button className="sim-btn danger-action" onClick={handleSimulateSpoof} style={{ flex: 1, justifyContent: 'center' }}>
              🚨 Simulate Adversarial GPS Spoof Attack
            </button>
          </div>

          <div style={{ marginTop: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '6px' }}>
              ELECTRONIC DEFENSE TERMINAL LOGS:
            </div>
            <div className="ew-terminal-logs">
              {terminalLogs.map((log, idx) => (
                <div key={idx} dangerouslySetInnerHTML={{ __html: log }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
