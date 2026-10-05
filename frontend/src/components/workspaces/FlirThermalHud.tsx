import React, { useState } from 'react';
import { tacticalAudio } from '../../utils/audio';

export const FlirThermalHud: React.FC = () => {
  type ThermalFilter = 'white-hot' | 'black-hot' | 'nvg-phosphor';
  const [filter, setFilter] = useState<ThermalFilter>('white-hot');
  const [zoomLevel, setZoomLevel] = useState<number>(2);

  const handleFilterChange = (f: ThermalFilter) => {
    tacticalAudio.playBlip();
    setFilter(f);
  };

  const getFilterStyle = () => {
    if (filter === 'white-hot') {
      return {
        background: 'linear-gradient(135deg, #1c1917, #292524)',
        borderColor: '#f59e0b',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
      };
    } else if (filter === 'black-hot') {
      return {
        background: 'linear-gradient(135deg, #09090b, #18181b)',
        borderColor: '#38bdf8',
        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.9)'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #022c22, #064e3b)',
        borderColor: '#4ade80',
        boxShadow: 'inset 0 0 40px rgba(74, 222, 128, 0.2)'
      };
    }
  };

  return (
    <div className="flir-thermal-container" style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
      {/* Top Telemetry Header */}
      <div style={{ padding: '8px 14px', background: 'rgba(10, 16, 30, 0.95)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
          <span className="pulse-dot" style={{ width: '7px', height: '7px', background: '#ef4444' }}></span>
          <span style={{ fontWeight: 800, color: '#f8fafc' }}>FLIR RECON DRONE POD (HERON-MK2)</span>
          <span style={{ color: '#94a3b8' }}>ALT: 16,400 FT &bull; AZ: 028&deg; &bull; RNG: 1.4 KM</span>
        </div>

        {/* Thermal Palette Toggle */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => handleFilterChange('white-hot')}
            style={{
              padding: '2px 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: 700,
              borderRadius: '3px',
              border: '1px solid #78716c',
              background: filter === 'white-hot' ? '#d6d3d1' : 'transparent',
              color: filter === 'white-hot' ? '#0c0a09' : '#d6d3d1',
              cursor: 'pointer'
            }}
          >
            White-Hot
          </button>
          <button
            onClick={() => handleFilterChange('black-hot')}
            style={{
              padding: '2px 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: 700,
              borderRadius: '3px',
              border: '1px solid #38bdf8',
              background: filter === 'black-hot' ? '#38bdf8' : 'transparent',
              color: filter === 'black-hot' ? '#080d19' : '#38bdf8',
              cursor: 'pointer'
            }}
          >
            Black-Hot
          </button>
          <button
            onClick={() => handleFilterChange('nvg-phosphor')}
            style={{
              padding: '2px 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: 700,
              borderRadius: '3px',
              border: '1px solid #4ade80',
              background: filter === 'nvg-phosphor' ? '#4ade80' : 'transparent',
              color: filter === 'nvg-phosphor' ? '#022c22' : '#4ade80',
              cursor: 'pointer'
            }}
          >
            NVG Phosphor
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div
        style={{
          height: '240px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          ...getFilterStyle()
        }}
      >
        {/* HUD Crosshairs */}
        <div style={{ position: 'absolute', width: '80px', height: '80px', border: '1px dashed rgba(255,255,255,0.4)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', width: '120px', height: '1px', background: 'rgba(255,255,255,0.3)' }}></div>
        <div style={{ position: 'absolute', height: '120px', width: '1px', background: 'rgba(255,255,255,0.3)' }}></div>

        {/* Detected Bounding Box 1: Tatra Truck */}
        <div
          style={{
            position: 'absolute',
            left: '28%',
            top: '35%',
            width: '120px',
            height: '70px',
            border: '1.5px solid #22c55e',
            borderRadius: '2px',
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)'
          }}
        >
          <div style={{ position: 'absolute', top: '-18px', left: '0', background: '#22c55e', color: '#000', fontSize: '9px', fontWeight: 800, padding: '1px 5px', fontFamily: 'monospace' }}>
            CONVOY-01: TATRA 8x8 (98.4%)
          </div>
          <div style={{ position: 'absolute', bottom: '-16px', right: '0', color: '#22c55e', fontSize: '8px', fontFamily: 'monospace' }}>
            SPD: 34 KM/H &bull; TEMP: 48&deg;C
          </div>
        </div>

        {/* Detected Bounding Box 2: Snow Obstruction Warning */}
        <div
          style={{
            position: 'absolute',
            right: '25%',
            top: '25%',
            width: '95px',
            height: '55px',
            border: '1.5px dashed #f59e0b',
            borderRadius: '2px'
          }}
        >
          <div style={{ position: 'absolute', top: '-18px', left: '0', background: '#f59e0b', color: '#000', fontSize: '9px', fontWeight: 800, padding: '1px 4px', fontFamily: 'monospace' }}>
            SNOWPACK CHOKE (94.1%)
          </div>
        </div>

        {/* Bottom Corner Telemetry */}
        <div style={{ position: 'absolute', bottom: '8px', left: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#94a3b8' }}>
          GPS: 34.6200&deg; N, 77.7500&deg; E &bull; OPTICAL ZOOM: {zoomLevel}X
        </div>
        <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#10b981' }}>
          YOLOv8-TINY DEFENSE INFERENCE: 18ms
        </div>
      </div>
    </div>
  );
};
