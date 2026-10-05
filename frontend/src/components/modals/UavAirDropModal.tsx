import React, { useState, useEffect } from 'react';
import { tacticalAudio } from '../../utils/audio';

interface UavAirDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const UavAirDropModal: React.FC<UavAirDropModalProps> = ({ isOpen, onClose, onNotify }) => {
  const [flightPhase, setFlightPhase] = useState<'PREFLIGHT' | 'AIRBORNE' | 'APPROACH' | 'DROPPED'>('PREFLIGHT');
  const [altitudeM, setAltitudeM] = useState<number>(3050);
  const [batteryPct, setBatteryPct] = useState<number>(98);
  const [cepMeters, setCepMeters] = useState<number>(1.6);
  const [progressPct, setProgressPct] = useState<number>(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (flightPhase === 'AIRBORNE') {
      timer = setInterval(() => {
        setProgressPct(prev => {
          if (prev >= 80) {
            setFlightPhase('APPROACH');
            return 85;
          }
          return prev + 5;
        });
        setAltitudeM(prev => Math.min(6700, prev + 250));
        setBatteryPct(prev => Math.max(72, prev - 1));
      }, 500);
    }
    return () => clearInterval(timer);
  }, [flightPhase]);

  if (!isOpen) return null;

  const handleLaunchUav = () => {
    tacticalAudio.playSonar();
    setFlightPhase('AIRBORNE');
    setProgressPct(5);
    onNotify('UAV SORTIE LAUNCHED: Heavy-Lift Hybrid-VTOL airborne from FSB Khalsar. En route to Bana Top (6,700m).');
  };

  const handleExecuteDrop = () => {
    tacticalAudio.playAlert();
    setFlightPhase('DROPPED');
    setProgressPct(100);
    const measuredCep = Number((1.2 + Math.random() * 0.9).toFixed(1));
    setCepMeters(measuredCep);
    onNotify(`AIR-DROP DELIVERED: Parachute payload landed at Bana Top Drop Zone. CEP: ${measuredCep}m! Mission accomplished.`);
  };

  const handleResetMission = () => {
    setFlightPhase('PREFLIGHT');
    setAltitudeM(3050);
    setBatteryPct(98);
    setProgressPct(0);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1250 }}>
      <div
        className="tactical-modal"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '850px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#070c18',
          border: '1.5px solid #a855f7',
          boxShadow: '0 0 35px rgba(168, 85, 247, 0.25)'
        }}
      >
        {/* Header */}
        <div
          className="tactical-modal-header"
          style={{
            background: 'linear-gradient(90deg, #1e1136 0%, #0d1527 100%)',
            borderBottom: '2px solid #a855f7',
            padding: '14px 22px'
          }}
        >
          <div className="tactical-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>🛸</span>
            <span style={{ color: '#c084fc' }}>AUTONOMOUS HIGH-ALTITUDE UAV AIR-DROP SIMULATOR</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleResetMission}
              style={{
                background: 'rgba(168, 85, 247, 0.2)',
                border: '1px solid #a855f7',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔄 Reset Mission
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Mission Overview Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '12px 16px',
              borderRadius: '6px',
              border: '1px solid #334155'
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>AIRFRAME ASSET</div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#f8fafc' }}>Garuda Titan Hybrid-VTOL</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>MISSION TARGET</div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#c084fc' }}>Bana Top DZ (Siachen 6,700m)</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>PAYLOAD MANIFEST</div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#38bdf8' }}>40kg Blood Plasma + 60kg Rations</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>STATUS</div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  color: flightPhase === 'DROPPED' ? '#34d399' : flightPhase === 'AIRBORNE' || flightPhase === 'APPROACH' ? '#fbbf24' : '#94a3b8'
                }}
              >
                {flightPhase === 'PREFLIGHT' ? 'ARMED & READY' : flightPhase === 'AIRBORNE' ? 'CRUISING EN ROUTE' : flightPhase === 'APPROACH' ? 'OVER TARGET DZ' : 'PAYLOAD DELIVERED ✓'}
              </div>
            </div>
          </div>

          {/* Flight Elevation & Mission Progress Gauge */}
          <div style={{ background: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1' }}>
                MISSION PROGRESSION: FSB KHALSAR (3,050m) &rarr; BANA POST DROP ZONE (6,700m)
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#c084fc' }}>
                {progressPct}% COMPLETED
              </span>
            </div>

            {/* Flight Bar */}
            <div style={{ height: '10px', background: '#1e293b', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>

            {/* Altitude & Real-Time Telemetry Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '14px' }}>
              <div style={{ background: '#0f172a', padding: '10px', borderRadius: '4px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>CURRENT ALTITUDE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>{altitudeM.toLocaleString()} m</div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Terrain contour lock</div>
              </div>

              <div style={{ background: '#0f172a', padding: '10px', borderRadius: '4px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>AIRSPEED</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                  {flightPhase === 'PREFLIGHT' ? '0 km/h' : '68 km/h'}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Ground speed 54 kt</div>
              </div>

              <div style={{ background: '#0f172a', padding: '10px', borderRadius: '4px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>SOLID-STATE BATTERY</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: batteryPct < 80 ? '#fbbf24' : '#34d399' }}>
                  {batteryPct}%
                </div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Thermal wrap at 24°C</div>
              </div>

              <div style={{ background: '#0f172a', padding: '10px', borderRadius: '4px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>DROP ACCURACY (CEP)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                  {cepMeters} m
                </div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Sub-2m combat threshold</div>
              </div>
            </div>
          </div>

          {/* Mission Execution Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.9)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f8fafc' }}>
                Flight Director Action Panel
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {flightPhase === 'PREFLIGHT' && 'All pre-flight gyro and heating checks passed. Ready for autonomous launch.'}
                {flightPhase === 'AIRBORNE' && 'UAV is navigating the Nubra-Siachen mountain corridor under NavIC guidance.'}
                {flightPhase === 'APPROACH' && 'Approaching Drop Zone Bana Top at 50m AGL. Air-drop release sequence armed.'}
                {flightPhase === 'DROPPED' && 'Payload released via ram-air parachute. Garrison confirmed safe touchdown.'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {flightPhase === 'PREFLIGHT' && (
                <button
                  onClick={handleLaunchUav}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                    border: '1px solid #c084fc',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
                  }}
                >
                  🚀 LAUNCH AUTONOMOUS UAV SORTIE
                </button>
              )}

              {(flightPhase === 'AIRBORNE' || flightPhase === 'APPROACH') && (
                <button
                  onClick={handleExecuteDrop}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    border: '1px solid #34d399',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  🪂 RELEASE PARACHUTE DROP (NOW)
                </button>
              )}

              {flightPhase === 'DROPPED' && (
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    border: '1px solid #10b981',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '0.8rem'
                  }}
                >
                  Touchdown Confirmed ✓
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
