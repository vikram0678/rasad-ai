import React, { useState } from 'react';

interface OutpostNode {
  id: string;
  name: string;
  code: string;
  elevation: string;
  x: number;
  y: number;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL' | 'QUARANTINED';
  dos: number;
  troops: number;
  tag?: string;
}

const OUTPOST_NODES: OutpostNode[] = [
  { id: 'op-leh', name: 'Leh Command', code: 'HQ-LEH', elevation: '3,500 m - Base Hub', x: 210, y: 380, status: 'OPTIMAL', dos: 14.5, troops: 1200 },
  { id: 'op-khardung', name: 'Khardung La', code: 'PASS-KHL', elevation: '5,359 m', x: 200, y: 295, status: 'WARNING', dos: 6.2, troops: 85, tag: 'CROSS BEFORE 14:00' },
  { id: 'depot-thoise', name: 'Thoise Air Base', code: 'FSB-THS', elevation: '3,180 m - Airhead', x: 250, y: 190, status: 'OPTIMAL', dos: 12.0, troops: 680, tag: 'C-17 / IL-76' },
  { id: 'op-diskit', name: 'Diskit', code: 'FOB-DSK', elevation: '3,144 m', x: 335, y: 245, status: 'OPTIMAL', dos: 8.4, troops: 240 },
  { id: 'op-khalsar', name: 'Khalsar Junction', code: 'FSB-KHL', elevation: '3,050 m', x: 410, y: 295, status: 'OPTIMAL', dos: 9.1, troops: 450 },
  { id: 'depot-darbuk', name: 'Darbuk Post', code: 'FSD-DRB', elevation: '3,850 m - Transit', x: 515, y: 315, status: 'OPTIMAL', dos: 10.5, troops: 310 },
  { id: 'depot-sasoma', name: 'Sasoma Camp', code: 'TR-SAS', elevation: '3,650 m - Siachen Staging', x: 415, y: 185, status: 'OPTIMAL', dos: 7.8, troops: 190 },
  { id: 'op-siachen', name: 'Siachen Base', code: 'OP-SIA', elevation: '5,400 m', x: 485, y: 105, status: 'OPTIMAL', dos: 18.0, troops: 520 },
  { id: 'op-murgo', name: 'Murgo', code: 'OP-MRG', elevation: '4,400 m', x: 635, y: 240, status: 'QUARANTINED', dos: 3.5, troops: 160 },
  { id: 'op-dbo', name: 'DBO Post', code: 'OP-DBO', elevation: '5,065 m - Priority', x: 775, y: 155, status: 'CRITICAL', dos: 2.1, troops: 340, tag: 'PRIORITY 01' }
];

interface SchematicMapProps {
  selectedOutpostId?: string;
  onSelectOutpost?: (id: string) => void;
}

export const SchematicMap: React.FC<SchematicMapProps> = ({
  selectedOutpostId = 'op-dbo',
  onSelectOutpost
}) => {
  const [hoveredNode, setHoveredNode] = useState<OutpostNode | null>(null);

  return (
    <div className="schematic-map-container" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '480px', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 880 460"
        style={{ width: '100%', height: '100%', display: 'block', background: '#0b111e' }}
      >
        <defs>
          <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Topography Contour Lines (Illustrative Mountain Relief) */}
        <g stroke="#182338" strokeWidth="1" fill="none" opacity="0.45">
          <path d="M 40,410 Q 160,370 260,420 T 500,430 T 780,400" />
          <path d="M 60,330 Q 200,280 340,300 T 600,320 T 840,270" />
          <path d="M 90,240 Q 250,200 390,220 T 640,230 T 860,190" />
          <path d="M 120,150 Q 300,110 460,130 T 680,130 T 870,120" />
          <path d="M 160,75 Q 360,50 540,65 T 760,75 T 870,60" />
        </g>

        {/* Topographic Sector Watermark Labels */}
        <text x="35" y="55" fill="#334155" fontFamily="'JetBrains Mono', monospace" fontSize="10" letterSpacing="1">
          34.15° N / 77.58° E · TACTICAL ARTERY CORRIDORS
        </text>
        <text x="35" y="72" fill="#334155" fontFamily="'JetBrains Mono', monospace" fontSize="8.5" letterSpacing="0.8">
          HIGH-ALTITUDE THEATRE LOGISTICS OVERLAY
        </text>
        <text x="65" y="165" fill="#1e293b" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="700" letterSpacing="1.5">
          NUBRA VALLEY
        </text>
        <text x="510" y="380" fill="#1e293b" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="700" letterSpacing="2">
          SHYOK - KARAKORAM CORRIDOR
        </text>

        {/* Compass Rose */}
        <g transform="translate(825, 60)" opacity="0.7">
          <circle cx="0" cy="0" r="16" stroke="#334155" strokeWidth="1.2" fill="none" />
          <line x1="0" y1="-16" x2="0" y2="16" stroke="#334155" strokeWidth="1.2" />
          <line x1="-16" y1="0" x2="16" y2="0" stroke="#334155" strokeWidth="1.2" />
          <polygon points="0,-15 5,-3 0,0 -5,-3" fill="#38bdf8" />
          <text x="-5" y="-20" fill="#94a3b8" fontFamily="'Inter', sans-serif" fontSize="10" fontWeight="700">N</text>
        </g>

        {/* Air Corridor (Cyan Dashed Line): Leh -> Thoise -> Siachen Base & DBO */}
        <path
          d="M 210,380 Q 220,270 250,190"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          opacity="0.85"
        />
        <path
          d="M 250,190 Q 350,135 485,105"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          opacity="0.8"
        />
        <path
          d="M 250,190 Q 520,130 775,155"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          opacity="0.65"
        />

        {/* Glacial Supply Corridor (Green Dotted Line): Sasoma -> Siachen */}
        <path
          d="M 415,185 L 485,105"
          fill="none"
          stroke="#4ade80"
          strokeWidth="2.2"
          strokeDasharray="4 4"
          opacity="0.85"
        />

        {/* Main DS-DBO Road Corridor (Solid Gold Arterial Highway): Leh -> Khalsar -> Darbuk -> Murgo -> DBO */}
        <path
          d="M 210,380 L 410,295 L 515,315 L 635,240 L 775,155"
          fill="none"
          stroke="url(#roadGlow)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowEffect)"
        />

        {/* Branch Road: Khalsar -> Diskit -> Thoise Air Base */}
        <path
          d="M 410,295 L 335,245 L 250,190"
          fill="none"
          stroke="url(#roadGlow)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Branch Road: Khalsar -> Sasoma Staging Camp */}
        <path
          d="M 410,295 L 415,185"
          fill="none"
          stroke="url(#roadGlow)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Khardung La Pass Banner Box */}
        <g transform="translate(145, 275)">
          <rect
            x="0"
            y="0"
            width="105"
            height="38"
            rx="5"
            fill="rgba(30, 20, 10, 0.9)"
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />
          <text x="9" y="16" fill="#fbbf24" fontFamily="'Inter', sans-serif" fontSize="9.5" fontWeight="700">
            Khardung La
          </text>
          <text x="9" y="29" fill="#fde68a" fontFamily="'JetBrains Mono', monospace" fontSize="8.5" fontWeight="600">
            CROSS BEFORE 14:00
          </text>
        </g>

        {/* Murgo Warning Box */}
        <g transform="translate(560, 270)">
          <rect
            x="0"
            y="0"
            width="95"
            height="20"
            rx="4"
            fill="rgba(239, 68, 68, 0.2)"
            stroke="rgba(239, 68, 68, 0.7)"
            strokeWidth="1"
          />
          <text x="7" y="14" fill="#fca5a5" fontFamily="'JetBrains Mono', monospace" fontSize="8" fontWeight="700">
            AMMO TELEM REVIEW
          </text>
        </g>

        {/* Outpost Node Dots and Labels */}
        {OUTPOST_NODES.map((node) => {
          const isSelected = selectedOutpostId === node.id;
          const isCritical = node.status === 'CRITICAL';
          const isWarning = node.status === 'WARNING';
          const isQuarantined = node.status === 'QUARANTINED';

          const markerFill = isCritical
            ? '#ef4444'
            : isQuarantined
            ? '#f87171'
            : isWarning
            ? '#f59e0b'
            : '#38bdf8';

          return (
            <g
              key={node.id}
              onClick={() => onSelectOutpost && onSelectOutpost(node.id)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer Pulsing Ring for Selected or Critical Nodes */}
              {(isSelected || isCritical) && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="16"
                  fill="none"
                  stroke={markerFill}
                  strokeWidth="2"
                  opacity="0.6"
                >
                  <animate attributeName="r" values="9;18;9" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Base Marker Circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isSelected ? 7.5 : 5.5}
                fill={markerFill}
                stroke="#0b111e"
                strokeWidth="2.5"
              />

              {/* Name Label */}
              <text
                x={node.x + 10}
                y={node.y - 4}
                fill="#f8fafc"
                fontFamily="'Inter', sans-serif"
                fontSize="12.5"
                fontWeight="700"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
              >
                {node.name}
              </text>

              {/* Elevation / Metadata Label */}
              <text
                x={node.x + 10}
                y={node.y + 11}
                fill="#94a3b8"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
              >
                {node.elevation}
              </text>
            </g>
          );
        })}

        {/* Schematic Scale & Disclaimer */}
        <g transform="translate(35, 430)">
          <line x1="0" y1="0" x2="60" y2="0" stroke="#475569" strokeWidth="2" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#475569" strokeWidth="2" />
          <line x1="60" y1="-5" x2="60" y2="5" stroke="#475569" strokeWidth="2" />
          <text x="72" y="3" fill="#64748b" fontFamily="'JetBrains Mono', monospace" fontSize="9">
            40 km · schematic topological network
          </text>
        </g>
      </svg>

      {/* Hover Telemetry Overlay Card */}
      {hoveredNode && (
        <div
          style={{
            position: 'absolute',
            left: `${Math.min(hoveredNode.x + 10, 520)}px`,
            top: `${Math.max(hoveredNode.y - 70, 10)}px`,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '6px',
            padding: '8px 12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.7)',
            pointerEvents: 'none',
            zIndex: 30,
            fontSize: '11px',
            minWidth: '160px'
          }}
        >
          <div style={{ fontWeight: 'bold', color: '#f8fafc', display: 'flex', justifyContent: 'space-between' }}>
            <span>{hoveredNode.name}</span>
            <span style={{ color: hoveredNode.status === 'CRITICAL' ? '#ef4444' : '#10b981' }}>
              {hoveredNode.status}
            </span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px' }}>
            DOS: <b style={{ color: hoveredNode.dos < 4 ? '#ef4444' : '#38bdf8' }}>{hoveredNode.dos} Days</b> · Garrison: {hoveredNode.troops}
          </div>
          <div style={{ color: '#64748b', fontSize: '9px', marginTop: '2px', fontFamily: 'monospace' }}>
            Code: {hoveredNode.code}
          </div>
        </div>
      )}
    </div>
  );
};
