import React, { useState } from 'react';

interface IplmsDemandForecastProps {
  selectedLocationId?: string;
}

export const IplmsDemandForecast: React.FC<IplmsDemandForecastProps> = ({
  selectedLocationId = 'post-charlie'
}) => {
  const [selectedLoc, setSelectedLoc] = useState<string>('Post Charlie');
  const [selectedClass, setSelectedClass] = useState<string>('Class V - Ammunition');

  // Days and coordinates matching Screenshot 1 exactly
  const dates = ['04 Oct', '05 Oct', '06 Oct', '07 Oct', '08 Oct', '09 Oct', '10 Oct'];

  // Points mapped in 600x200 SVG space
  const stockPts = [
    { x: 35, y: 44, val: 680 },
    { x: 125, y: 72, val: 540 },
    { x: 215, y: 98, val: 410 },
    { x: 305, y: 124, val: 280 }, // Crossover intersection
    { x: 395, y: 146, val: 170 },
    { x: 485, y: 162, val: 90 },
    { x: 575, y: 174, val: 30 }
  ];

  const demandPts = [
    { x: 35, y: 164, val: 80 },
    { x: 125, y: 156, val: 120 },
    { x: 215, y: 142, val: 190 },
    { x: 305, y: 124, val: 280 }, // Crossover intersection
    { x: 395, y: 98, val: 410 },
    { x: 485, y: 76, val: 520 },
    { x: 575, y: 50, val: 650 }
  ];

  // Smooth bezier curve generator
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 >= pts.length ? pts.length - 1 : i + 2];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const stockPath = createSmoothPath(stockPts);
  const demandPath = createSmoothPath(demandPts);

  return (
    <div className="iplms-panel-card iplms-demand-widget-exact">
      {/* Header with Filters */}
      <div className="demand-exact-header">
        <h4 className="demand-exact-title">Demand Forecast (Next 7 Days)</h4>
        <div className="demand-exact-selects">
          <select
            className="demand-exact-select"
            value={selectedLoc}
            onChange={(e) => setSelectedLoc(e.target.value)}
          >
            <option value="Post Charlie">Post Charlie</option>
            <option value="Post Delta">Post Delta</option>
            <option value="Post Bravo">Post Bravo</option>
          </select>

          <select
            className="demand-exact-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="Class V - Ammunition">Class V - Ammunition</option>
            <option value="Class III - POL (Fuel)">Class III - POL (Fuel)</option>
            <option value="Class I - Rations">Class I - Rations</option>
          </select>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="demand-exact-legend">
        <div className="demand-legend-item">
          <span className="demand-legend-line red"></span>
          <span>Forecast Demand</span>
        </div>
        <div className="demand-legend-item">
          <span className="demand-legend-line blue"></span>
          <span>Current Stock</span>
        </div>
        <div className="demand-legend-item">
          <span className="demand-legend-line dashed"></span>
          <span>Reorder Level</span>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="demand-exact-plot-area">
        {/* Y Axis Unit Label */}
        <div className="demand-exact-yaxis-col">
          <span className="demand-axis-unit-label">Units</span>
          <div className="demand-exact-yaxis-values">
            <span>800</span>
            <span>600</span>
            <span>400</span>
            <span>200</span>
            <span>0</span>
          </div>
        </div>

        {/* SVG Drawing Canvas Container */}
        <div className="demand-exact-canvas-wrap">
          <svg
            className="demand-exact-svg"
            viewBox="0 0 600 200"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Horizontal Grid lines */}
            <line x1="30" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="30" y1="60" x2="580" y2="60" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="30" y1="100" x2="580" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="30" y1="140" x2="580" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="30" y1="180" x2="580" y2="180" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

            {/* Danger Shaded Zone (from Crossover 07 Oct to 10 Oct) */}
            <rect
              x="305"
              y="20"
              width="275"
              height="160"
              fill="rgba(220, 38, 38, 0.12)"
            />

            {/* Reorder Level dashed horizontal line */}
            <line
              x1="30"
              y1="132"
              x2="580"
              y2="132"
              stroke="#38bdf8"
              strokeDasharray="4,4"
              strokeWidth="1.2"
            />

            {/* Vertical Threshold Danger Marker at 07 Oct */}
            <line
              x1="305"
              y1="10"
              x2="305"
              y2="180"
              stroke="#ef4444"
              strokeDasharray="4,3"
              strokeWidth="1.6"
            />

            {/* Current Stock Blue Line */}
            <path
              d={stockPath}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.4"
            />
            {stockPts.map((p, i) => (
              <circle
                key={`s-${i}`}
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#38bdf8"
                stroke="#0b1329"
                strokeWidth="1.5"
              />
            ))}

            {/* Forecast Demand Red Line */}
            <path
              d={demandPath}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.4"
            />
            {demandPts.map((p, i) => (
              <circle
                key={`d-${i}`}
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#ef4444"
                stroke="#0b1329"
                strokeWidth="1.5"
              />
            ))}

            {/* Crossover Intersection Circle */}
            <circle
              cx="305"
              cy="124"
              r="5"
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </svg>

          {/* Floating Stockout Risk Callout Box */}
          <div className="demand-stockout-callout-box">
            <div className="callout-title">Stockout Risk</div>
            <div className="callout-sub">&lt; 24 hours</div>
          </div>
        </div>
      </div>

      {/* X Axis Date Labels */}
      <div className="demand-exact-dates-row">
        {dates.map((d, i) => (
          <span key={i} className={`demand-date-label ${d === '07 Oct' ? 'highlight-date' : ''}`}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
};
