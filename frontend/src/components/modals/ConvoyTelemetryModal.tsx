import React, { useState } from 'react';
import { tacticalAudio } from '../../utils/audio';

interface ConvoyTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  convoyId?: string;
  onNotify: (msg: string) => void;
}

export const ConvoyTelemetryModal: React.FC<ConvoyTelemetryModalProps> = ({
  isOpen,
  onClose,
  convoyId = 'TRK-204',
  onNotify
}) => {
  const [ctisMode, setCtisMode] = useState<'SNOW' | 'HIGHWAY' | 'EMERGENCY'>('SNOW');
  const [heaterActive, setHeaterActive] = useState<boolean>(true);
  const [o2Flow, setO2Flow] = useState<number>(2.0);

  if (!isOpen) return null;

  const handleToggleHeater = () => {
    tacticalAudio.playBlip();
    setHeaterActive(p => !p);
    onNotify(heaterActive ? 'BUKHARI BLOCK HEATER: De-activated' : 'BUKHARI BLOCK HEATER: Engaged at 68°C target');
  };

  const handleChangeCtis = (mode: 'SNOW' | 'HIGHWAY' | 'EMERGENCY') => {
    tacticalAudio.playBlip();
    setCtisMode(mode);
    onNotify(`CTIS PNEUMATICS: Pressure set to ${mode === 'SNOW' ? '18 PSI (Snow/Ice)' : mode === 'HIGHWAY' ? '38 PSI (Highway)' : '12 PSI (Emergency Bog)'}`);
  };

  const handleTransmitBeacon = () => {
    tacticalAudio.playSonar();
    onNotify('VHF MIL-STD-188 BEACON TRANSMITTED: Vehicle vitals relayed to Northern Command HQ.');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1250 }}>
      <div
        className="tactical-modal"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#090e1a',
          border: '1.5px solid #38bdf8',
          boxShadow: '0 0 35px rgba(56, 189, 248, 0.25)'
        }}
      >
        {/* Header */}
        <div
          className="tactical-modal-header"
          style={{
            background: 'linear-gradient(90deg, #0f172a 0%, #032b45 100%)',
            borderBottom: '2px solid #38bdf8',
            padding: '14px 22px'
          }}
        >
          <div className="tactical-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>📟</span>
            <span>TACTICAL CONVOY BLACK-BOX TELEMETRY [{convoyId}]</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleTransmitBeacon}
              style={{
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📡 Transmit VHF Ping
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top Chassis Specs Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '10px',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '12px 16px',
              borderRadius: '6px',
              border: '1px solid #1e293b'
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>CHASSIS TYPE</div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#f8fafc' }}>Tatra 8x8 T815-7</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>MILITARY REGISTRATION</div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#38bdf8' }}>↑ 24D 108422A</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>OPERATING UNIT</div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#cbd5e1' }}>504 ASC Bn (Ladakh)</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>CURRENT LOCATION</div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#f59e0b' }}>Khardung La Km 38 (4,920m)</div>
            </div>
          </div>

          {/* Section 1: Extreme-Cold Powertrain & Mechanical Health */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#38bdf8', fontSize: '0.82rem', letterSpacing: '0.05em', marginBottom: '8px' }}>
              1. EXTREME-COLD POWERTRAIN &amp; MECHANICAL VITALS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {/* Bukhari Block Pre-Heater */}
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>🔥 Bukhari Block Heater</span>
                  <button
                    onClick={handleToggleHeater}
                    style={{
                      fontSize: '0.66rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '3px',
                      background: heaterActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: heaterActive ? '#34d399' : '#fca5a5',
                      border: `1px solid ${heaterActive ? '#10b981' : '#ef4444'}`,
                      cursor: 'pointer'
                    }}
                  >
                    {heaterActive ? 'ENGAGED' : 'OFF'}
                  </button>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: heaterActive ? '#34d399' : '#94a3b8' }}>
                  {heaterActive ? '68°C' : '14°C'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  Prevents coolant crystallizing at -32°C ambient
                </div>
              </div>

              {/* Diesel Fuel Anti-Waxing Additive */}
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>⛽ Anti-Waxing Additive</span>
                  <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>OPTIMAL</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>94% SATURATION</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  Pour point depressed to -38°C (Euro-VI Arctic High-Speed Diesel)
                </div>
              </div>

              {/* Central Tyre Inflation System (CTIS) */}
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>🛞 CTIS Tyre Pressure</span>
                  <span style={{ color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {ctisMode === 'SNOW' ? '18 PSI' : ctisMode === 'HIGHWAY' ? '38 PSI' : '12 PSI'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                  {(['SNOW', 'HIGHWAY', 'EMERGENCY'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => handleChangeCtis(m)}
                      style={{
                        flex: 1,
                        padding: '4px 2px',
                        fontSize: '0.64rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        borderRadius: '3px',
                        border: '1px solid',
                        borderColor: ctisMode === m ? '#38bdf8' : '#334155',
                        background: ctisMode === m ? 'rgba(56, 189, 248, 0.2)' : '#090e1a',
                        color: ctisMode === m ? '#38bdf8' : '#94a3b8',
                        cursor: 'pointer'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                  Max footprint contact on hard-packed black ice
                </div>
              </div>

              {/* Dual 24V Gel Arctic Battery Vitals */}
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>🔋 24V Arctic Batteries</span>
                  <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>28.4V FLOAT</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>920 CCA RESERVE</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  Internal thermal heating blanket active
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Crew Physiological Telemetry (Hypoxia & O2) */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#38bdf8', fontSize: '0.82rem', letterSpacing: '0.05em', marginBottom: '8px' }}>
              2. CABIN CREW PHYSIOLOGICAL TELEMETRY (14,000+ FT HYPOXIA MONITOR)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {/* Driver Vitals */}
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#f8fafc' }}>Havildar R. Singh</span>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Lead Convoy Driver · 14 Corps ASC</div>
                  </div>
                  <span style={{ padding: '2px 6px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    COMPENSATED
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>SpO2 SATURATION</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>89%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>HEART RATE</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>82 BPM</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>CABIN O2 FLOW</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>{o2Flow} L/min</div>
                  </div>
                </div>
              </div>

              {/* Co-Driver Vitals */}
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#f8fafc' }}>Naik S. Rawat</span>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Co-Driver / Radio Operator</div>
                  </div>
                  <span style={{ padding: '2px 6px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    NORMAL
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>SpO2 SATURATION</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>91%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>HEART RATE</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>78 BPM</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>ALERTNESS</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>98%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Navigation Cross-Lock & Inertial Sensor Health */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid #1e293b',
              borderRadius: '6px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
                NavIC + Tactical Ring-Laser Gyro (RLG) Inertial Navigation
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Anti-Spoofing Kalman Filter verified: 0.14m position drift over 42 km mountain ascent.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, border: '1px solid #10b981' }}>
                NavIC 6-SV LOCKED
              </span>
              <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, border: '1px solid #38bdf8' }}>
                RLG INS NOMINAL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
