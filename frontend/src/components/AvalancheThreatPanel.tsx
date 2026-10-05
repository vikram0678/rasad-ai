import React, { useState } from 'react';
import { tacticalAudio } from '../utils/audio';

export interface PassThreat {
  passName: string;
  axis: string;
  altitudeM: number;
  stageLevel: 1 | 2 | 3 | 4 | 5;
  stageName: string;
  hazardType: string;
  snowDepthCm: number;
  windSpeedKmh: number;
  transitDirective: string;
}

interface AvalancheThreatPanelProps {
  onNotify: (msg: string) => void;
  showDoppler: boolean;
  onToggleDoppler: () => void;
}

export const AvalancheThreatPanel: React.FC<AvalancheThreatPanelProps> = ({
  onNotify,
  showDoppler,
  onToggleDoppler
}) => {
  const passes: PassThreat[] = [
    {
      passName: 'Khardung La Pass Checkpoint',
      axis: 'Leh → Nubra / DBO Highway',
      altitudeM: 5359,
      stageLevel: 3,
      stageName: 'STAGE-3 ORANGE (HIGH RISK)',
      hazardType: 'Wind Slab & Wet Snow Slides',
      snowDepthCm: 65,
      windSpeedKmh: 42,
      transitDirective: 'Pass window strictly closes at 14:00 IST. Snow chains mandatory on all 4x4 & 8x8 assets.'
    },
    {
      passName: 'Murgo Choke Point Km 134',
      axis: 'Shyok River Valley Axis',
      altitudeM: 4400,
      stageLevel: 4,
      stageName: 'STAGE-4 RED (SEVERE)',
      hazardType: 'Active Rockfall & Scree Avalanche',
      snowDepthCm: 92,
      windSpeedKmh: 58,
      transitDirective: 'High hazard. Single-file movement only under BRO clearance. Secondary bypass armed.'
    },
    {
      passName: 'Chang La Axis',
      axis: 'Leh → Pangong Tso / Spanggur',
      altitudeM: 5360,
      stageLevel: 2,
      stageName: 'STAGE-2 YELLOW (MODERATE)',
      hazardType: 'Drifting Powder Snow',
      snowDepthCm: 38,
      windSpeedKmh: 28,
      transitDirective: 'Open with escort. Low-speed convoy spacing of 50m enforced.'
    },
    {
      passName: 'Daulat Beg Oldie (DBO Plateau)',
      axis: 'Sub-Sector North (SSN)',
      altitudeM: 5065,
      stageLevel: 1,
      stageName: 'STAGE-1 GREEN (STABLE)',
      hazardType: 'Extreme Wind-Chill (-32°C Freeze)',
      snowDepthCm: 18,
      windSpeedKmh: 52,
      transitDirective: 'Ground stable. Anti-wax diesel additives mandatory for all parked vehicles.'
    }
  ];

  const getStageColor = (lvl: number) => {
    switch (lvl) {
      case 1:
        return '#10b981';
      case 2:
        return '#facc15';
      case 3:
        return '#f97316';
      case 4:
        return '#ef4444';
      default:
        return '#dc2626';
    }
  };

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>❄️</span>
            <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#f8fafc' }}>
              SASE / DRDO DGRE AVALANCHE THREAT MATRIX
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
            Official Defence Geoinformatics Research Establishment snow stability index along Northern Command corridors
          </div>
        </div>

        <button
          onClick={() => {
            tacticalAudio.playBlip();
            onToggleDoppler();
            onNotify(showDoppler ? 'DOPPLER RADAR OVERLAY: De-activated' : 'DOPPLER RADAR OVERLAY: Active (Composite Reflectivity dBZ)');
          }}
          style={{
            padding: '6px 12px',
            borderRadius: '5px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: '1px solid',
            borderColor: showDoppler ? '#38bdf8' : '#334155',
            background: showDoppler ? 'rgba(56, 189, 248, 0.2)' : '#0f172a',
            color: showDoppler ? '#38bdf8' : '#cbd5e1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>📡</span>
          <span>{showDoppler ? 'HIDE DOPPLER RADAR' : 'SHOW DOPPLER RADAR'}</span>
        </button>
      </div>

      {/* Pass Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {passes.map(p => {
          const color = getStageColor(p.stageLevel);
          return (
            <div
              key={p.passName}
              style={{
                background: '#090e1a',
                borderLeft: `4px solid ${color}`,
                border: '1px solid #1e293b',
                borderRadius: '6px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#f8fafc' }}>{p.passName}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {p.axis} · {p.altitudeM}m
                  </div>
                </div>
                <span
                  style={{
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '0.62rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    background: `${color}20`,
                    color: color,
                    border: `1px solid ${color}`
                  }}
                >
                  {p.stageName.split(' ')[0]}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>
                <span>Hazard: <b style={{ color }}>{p.hazardType}</b></span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{p.snowDepthCm}cm Snow · {p.windSpeedKmh}km/h</span>
              </div>

              <div style={{ fontSize: '0.7rem', color: '#94a3b8', background: '#030712', padding: '6px 8px', borderRadius: '4px', marginTop: '4px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>DIRECTIVE:</span> {p.transitDirective}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
