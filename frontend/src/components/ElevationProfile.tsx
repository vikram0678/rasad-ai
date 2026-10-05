import React from 'react';
import { MilitarySectorId, MILITARY_SECTORS } from '../data/militarySectors';

interface ElevationProfileProps {
  sectorId?: MilitarySectorId;
}

export const ElevationProfile: React.FC<ElevationProfileProps> = ({ sectorId = 'SECTOR_DSDBO' }) => {
  const sector = MILITARY_SECTORS[sectorId] || MILITARY_SECTORS.SECTOR_DSDBO;
  const waypoints = sector.routeWaypoints;

  // Compute SVG coordinates dynamically based on waypoints
  const maxAltitude = Math.max(...waypoints.map(w => w.altitudeM), 6000);
  const minAltitude = Math.min(...waypoints.map(w => w.altitudeM), 2000);

  const totalDistance = waypoints[waypoints.length - 1].distanceKm || 250;

  const points = waypoints.map((wp, idx) => {
    const x = Math.round(50 + (idx / (waypoints.length - 1)) * 600);
    // Inverted Y: higher altitude = smaller Y (closer to top: 12 to 68)
    const normalizedAlt = (wp.altitudeM - minAltitude) / (maxAltitude - minAltitude);
    const y = Math.round(70 - normalizedAlt * 54);
    return { x, y, wp };
  });

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');
  const polygonStr = `${polylineStr} ${points[points.length - 1].x},80 ${points[0].x},80`;

  return (
    <div className="elevation-profile-container" style={{ padding: '12px 18px', background: 'rgba(7, 12, 22, 0.95)', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem' }}>🏔️</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
            {sector.name.toUpperCase()} — ELEVATION CROSS-SECTION
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#94a3b8' }}>
            {totalDistance} km Axis · {sector.formation}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
          <span style={{ color: '#ef4444' }}>
            &bull; Hypoxia Threshold (&gt;14,000 ft)
          </span>
          <span style={{ color: '#f59e0b' }}>
            &bull; Diesel Waxing (&lt;-20&deg;C)
          </span>
          <span style={{ color: '#38bdf8' }}>
            &bull; High-Altitude De-rating
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: '85px', position: 'relative' }}>
        <svg viewBox="0 0 700 85" style={{ width: '100%', height: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="elevationGradDynamic" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="profileLineDynamic" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="30%" stopColor="#ef4444" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* 14,000 ft Hypoxia Warning Line */}
          <line x1="30" y1="36" x2="680" y2="36" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
          <text x="35" y="32" fill="#ef4444" fontFamily="'JetBrains Mono', monospace" fontSize="7" opacity="0.8">
            14,000 FT HYPOXIA / HAPE CRITICAL THRESHOLD (4,267 m)
          </text>

          {/* Elevation Area */}
          <polygon points={polygonStr} fill="url(#elevationGradDynamic)" />

          {/* Elevation Stroke Path */}
          <polyline
            points={polylineStr}
            fill="none"
            stroke="url(#profileLineDynamic)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Render Waypoint Pins */}
          {points.map((pt, i) => {
            const isPeak = pt.wp.altitudeM >= 5000;
            const pinColor = isPeak ? '#ef4444' : pt.wp.altitudeM > 4000 ? '#f59e0b' : '#38bdf8';
            return (
              <g key={pt.wp.name}>
                <circle cx={pt.x} cy={pt.y} r={isPeak ? 4.5 : 3.5} fill={pinColor} stroke="#0f172a" strokeWidth="1.5" />
                <text
                  x={pt.x}
                  y={pt.y > 45 ? pt.y - 8 : pt.y + 14}
                  fill={isPeak ? '#fca5a5' : '#cbd5e1'}
                  fontFamily="'Inter', sans-serif"
                  fontSize="7"
                  fontWeight={isPeak ? '800' : '600'}
                  textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}
                >
                  {pt.wp.name.split(' ')[0]} ({pt.wp.altitudeM}m)
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
