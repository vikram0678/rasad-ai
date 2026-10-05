import React, { useState } from 'react';
import { IPLMS_INVENTORY_BY_CLASS, IplmsStockBar } from '../../data/iplmsData';

interface IplmsInventoryChartProps {
  onSelectNodeByName?: (name: string) => void;
}

export const IplmsInventoryChart: React.FC<IplmsInventoryChartProps> = ({ onSelectNodeByName }) => {
  type ClassTab = 'rations' | 'fuel' | 'ammunition' | 'medical';
  const [activeClass, setActiveClass] = useState<ClassTab>('rations');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  // Locations breakdown matching Screenshot 1
  const barsData = [
    { name: 'Base Jammu', line1: 'Base', line2: 'Jammu', percent: 82, color: '#10b981', dot: false },
    { name: 'Base Srinagar', line1: 'Base', line2: 'Srinagar', percent: 78, color: '#10b981', dot: false },
    { name: 'Base Leh', line1: 'Base', line2: 'Leh', percent: 65, color: '#f59e0b', dot: false },
    { name: 'Base Manali', line1: 'Base', line2: 'Manali', percent: 70, color: '#10b981', dot: true },
    { name: 'Kargil Depot', line1: 'Kargil', line2: 'Depot', percent: 60, color: '#10b981', dot: false },
    { name: 'Dras Depot', line1: 'Dras', line2: 'Depot', percent: 48, color: '#ef4444', dot: false },
    { name: 'Zoji Depot', line1: 'Zoji', line2: 'Depot', percent: 75, color: '#10b981', dot: true },
    { name: 'Post Charlie', line1: 'Post', line2: 'Charlie', percent: 30, color: '#ef4444', dot: false },
    { name: 'Post Delta', line1: 'Post', line2: 'Delta', percent: 42, color: '#f59e0b', dot: false },
    { name: 'Post Bravo', line1: 'Post', line2: 'Bravo', percent: 55, color: '#10b981', dot: false },
    { name: 'Post Echo', line1: 'Post', line2: 'Echo', percent: 68, color: '#10b981', dot: true },
    { name: 'Post Foxtrot', line1: 'Post', line2: 'Foxtrot', percent: 40, color: '#f59e0b', dot: false }
  ];

  return (
    <div className="iplms-panel-card iplms-inventory-widget-exact">
      {/* Widget Header & Supply Class Pills */}
      <div className="inventory-exact-header">
        <h4 className="inventory-exact-title">Inventory Status (Key Supply Classes)</h4>

        <div className="inventory-exact-filter">
          <select
            className="inventory-exact-select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="all">All Locations</option>
            <option value="bases">Base Hubs</option>
            <option value="depots">Intermediate Depots</option>
            <option value="posts">Forward Posts</option>
          </select>
        </div>
      </div>

      {/* Class Category Filter Tabs */}
      <div className="inventory-exact-tabs">
        <button
          className={`inv-tab-pill ${activeClass === 'rations' ? 'active' : ''}`}
          onClick={() => setActiveClass('rations')}
        >
          Class I - Rations
        </button>
        <button
          className={`inv-tab-pill ${activeClass === 'fuel' ? 'active' : ''}`}
          onClick={() => setActiveClass('fuel')}
        >
          Class III - POL (Fuel)
        </button>
        <button
          className={`inv-tab-pill ${activeClass === 'ammunition' ? 'active' : ''}`}
          onClick={() => setActiveClass('ammunition')}
        >
          Class V - Ammunition
        </button>
        <button
          className={`inv-tab-pill ${activeClass === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveClass('medical')}
        >
          Medical Supplies
        </button>
      </div>

      {/* Bar Chart Container */}
      <div className="inventory-exact-chart-wrap">
        {/* Y-Axis Labels */}
        <div className="inventory-exact-yaxis">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        {/* Chart Drawing Area */}
        <div className="inventory-exact-plot">
          {/* Horizontal Grid lines */}
          <div className="inv-grid-line" style={{ top: '0%' }}></div>
          <div className="inv-grid-line" style={{ top: '25%' }}></div>
          <div className="inv-grid-line" style={{ top: '50%' }}></div>
          <div className="inv-grid-line" style={{ top: '75%' }}></div>
          <div className="inv-grid-line" style={{ top: '100%' }}></div>

          {/* 12 Bars Track */}
          <div className="inv-bars-row">
            {barsData.map((bar, idx) => {
              return (
                <div
                  key={idx}
                  className="inv-bar-col"
                  onClick={() => onSelectNodeByName?.(bar.name)}
                  title={`${bar.name}: ${bar.percent}%`}
                >
                  {/* Floating Indicator Dot */}
                  {bar.dot && <div className="inv-bar-dot"></div>}

                  {/* Percentage Number on Top */}
                  <div className="inv-bar-pct-label">{bar.percent}%</div>

                  {/* Dark Bar Slot */}
                  <div className="inv-bar-track-tube">
                    <div
                      className="inv-bar-fill-bar"
                      style={{
                        height: `${bar.percent}%`,
                        backgroundColor: bar.color
                      }}
                    ></div>
                  </div>

                  {/* 2-Line X-Axis Labels */}
                  <div className="inv-bar-name-block">
                    <span className="inv-bar-name-l1">{bar.line1}</span>
                    <span className="inv-bar-name-l2">{bar.line2}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
