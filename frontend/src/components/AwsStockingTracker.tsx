import React, { useState } from 'react';
import { tacticalAudio } from '../utils/audio';

export interface SectorStockingStatus {
  sectorId: string;
  name: string;
  commandBde: string;
  targetMt: number;
  stockedMt: number;
  velocityMtDay: number;
  criticalItem: string;
  closurePass: string;
  closureWindowDays: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'CRITICAL';
}

interface AwsStockingTrackerProps {
  onNotify: (msg: string) => void;
}

export const AwsStockingTracker: React.FC<AwsStockingTrackerProps> = ({ onNotify }) => {
  const [selectedSupplyFilter, setSelectedSupplyFilter] = useState<'ALL' | 'POL' | 'RATIONS' | 'AMMO'>('ALL');

  const sectorQuotas: SectorStockingStatus[] = [
    {
      sectorId: 'SSN',
      name: 'Sub-Sector North & Siachen Glacier',
      commandBde: '102 (I) Infantry Brigade ("Siachen Brigade")',
      targetMt: 32000,
      stockedMt: 27800,
      velocityMtDay: 195,
      criticalItem: 'Arctic High-Speed Kerosene (Bukhari heating)',
      closurePass: 'Khardung La Pass (5,359m)',
      closureWindowDays: 18,
      status: 'ON_TRACK'
    },
    {
      sectorId: 'DSDBO',
      name: 'Darbuk-Shyok-DBO & Depsang Axis',
      commandBde: '81 Infantry Brigade (SSN)',
      targetMt: 28000,
      stockedMt: 22400,
      velocityMtDay: 160,
      criticalItem: 'Class-III Kerosene & Aviation Turbine Fuel (ATF)',
      closurePass: 'Murgo Km 134 Snow Choke Point',
      closureWindowDays: 14,
      status: 'AT_RISK'
    },
    {
      sectorId: 'CHUSHUL',
      name: 'Pangong Tso – Chushul – Nyoma Corridor',
      commandBde: '3 Infantry Division ("Trishul Division")',
      targetMt: 52000,
      stockedMt: 47800,
      velocityMtDay: 280,
      criticalItem: 'T-90 Tank High-Density Diesel & 125mm APFSDS Ammo',
      closurePass: 'Chang La Pass (5,360m)',
      closureWindowDays: 24,
      status: 'ON_TRACK'
    },
    {
      sectorId: 'WESTERN',
      name: 'Kargil – Dras – Zojila Western Lifeline',
      commandBde: '8 Mountain Division ("Forever in Operation")',
      targetMt: 38000,
      stockedMt: 34400,
      velocityMtDay: 220,
      criticalItem: 'Class-I High-Calorie Rations & Snow Shoes',
      closurePass: 'Zojila Pass (3,528m)',
      closureWindowDays: 28,
      status: 'ON_TRACK'
    }
  ];

  const totalTargetMt = sectorQuotas.reduce((acc, s) => acc + s.targetMt, 0);
  const totalStockedMt = sectorQuotas.reduce((acc, s) => acc + s.stockedMt, 0);
  const overallPct = Math.round((totalStockedMt / totalTargetMt) * 100);

  const handleAccelerateStocking = (sectorName: string) => {
    tacticalAudio.playSonar();
    onNotify(`AWS PRIORITY SURGE: Issued ASC Emergency Convoy Directive for ${sectorName}. Allocation increased +45 MT/day.`);
  };

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>📦</span>
            <span style={{ fontWeight: 800, fontSize: '0.98rem', color: '#f8fafc', letterSpacing: '0.04em' }}>
              ADVANCED WINTER STOCKING (AWS-2026) THEATER MACRO GAUGE
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
            180-day extreme-winter stockpile pre-positioning across 14 Corps before complete mountain pass freeze
          </div>
        </div>

        {/* Global Stocking Countdown Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
              border: '1px solid #ef4444',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: '#fca5a5', fontWeight: 700 }}>
              WINTER PASS CLOSURE WINDOW
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.94rem', fontWeight: 800, color: '#fef08a' }}>
              T-MINUS 24 DAYS REMAINING
            </div>
          </div>
        </div>
      </div>

      {/* Theater Macro Progress Meter */}
      <div style={{ background: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '6px', padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>
            THEATER PRE-STOCKING COMPLETION: <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{totalStockedMt.toLocaleString()} MT</span> / {totalTargetMt.toLocaleString()} MT
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.05rem', color: overallPct > 85 ? '#34d399' : '#f59e0b' }}>
            {overallPct}% STOCKED
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '10px', background: '#1e293b', borderRadius: '5px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${overallPct}%`,
              background: 'linear-gradient(90deg, #0284c7 0%, #10b981 100%)',
              transition: 'width 0.5s ease'
            }}
          />
        </div>

        {/* Quick Commodity Sub-meters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', marginTop: '12px' }}>
          <div style={{ background: '#0f172a', padding: '8px 10px', borderRadius: '4px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>CLASS-I RATIONS</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#34d399' }}>92.4% (38,000 MT)</div>
          </div>
          <div style={{ background: '#0f172a', padding: '8px 10px', borderRadius: '4px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>CLASS-III POL / KEROSENE</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38bdf8' }}>85.1% (65,000 MT)</div>
          </div>
          <div style={{ background: '#0f172a', padding: '8px 10px', borderRadius: '4px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>CLASS-V AMMUNITION</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fbbf24' }}>94.0% (22,000 MT)</div>
          </div>
          <div style={{ background: '#0f172a', padding: '8px 10px', borderRadius: '4px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>ECC WINTER GEAR &amp; MEDS</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#c084fc' }}>90.2% (7,400 MT)</div>
          </div>
        </div>
      </div>

      {/* 4 Sector Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {sectorQuotas.map(sq => {
          const pct = Math.round((sq.stockedMt / sq.targetMt) * 100);
          const isAtRisk = sq.status === 'AT_RISK';
          const badgeColor = isAtRisk ? '#f59e0b' : '#10b981';

          return (
            <div
              key={sq.sectorId}
              style={{
                background: '#090e1a',
                border: '1px solid #1e293b',
                borderLeft: `4px solid ${badgeColor}`,
                borderRadius: '6px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#f8fafc' }}>{sq.name}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{sq.commandBde}</div>
                </div>
                <span
                  style={{
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '0.62rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    background: `${badgeColor}20`,
                    color: badgeColor,
                    border: `1px solid ${badgeColor}`
                  }}
                >
                  {sq.status}
                </span>
              </div>

              {/* Progress and Numbers */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  <span>Stocked: <b style={{ color: '#38bdf8' }}>{sq.stockedMt.toLocaleString()} MT</b> ({pct}%)</span>
                  <span>Target: {sq.targetMt.toLocaleString()} MT</span>
                </div>
                <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: isAtRisk ? '#f59e0b' : '#10b981', transition: 'width 0.4s ease' }} />
                </div>
              </div>

              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Critical: <span style={{ color: '#fca5a5' }}>{sq.criticalItem}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                  ⏳ Pass Window: {sq.closureWindowDays} days
                </span>
                <button
                  onClick={() => handleAccelerateStocking(sq.name)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid #38bdf8',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Surge Convoy ↗
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
