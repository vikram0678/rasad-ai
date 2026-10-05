import React, { useState } from 'react';
import { tacticalAudio } from '../../utils/audio';

export interface DepotInventory {
  id: string;
  name: string;
  role: string;
  altitudeM: number;
  tempC: number;
  fuelLiters: number;
  fuelMaxLiters: number;
  rationsKg: number;
  rationsMaxKg: number;
  ammoRounds: number;
  ammoMaxRounds: number;
  medKits: number;
  medMaxKits: number;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
}

export interface RebalanceTransfer {
  id: string;
  sourceDepot: string;
  targetDepot: string;
  commodity: string;
  quantity: string;
  convoyAsset: string;
  deadline: string;
  urgency: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  status: 'PENDING' | 'DISPATCHED' | 'DELIVERED';
}

interface MultiDepotBalancingProps {
  onNotify: (msg: string) => void;
}

export const MultiDepotBalancing: React.FC<MultiDepotBalancingProps> = ({ onNotify }) => {
  const [depots, setDepots] = useState<DepotInventory[]>([
    {
      id: 'depot-leh',
      name: 'Central Logistics Depot Leh',
      role: 'Tier-1 Theatre Feeder Depot',
      altitudeM: 3500,
      tempC: -8,
      fuelLiters: 142000,
      fuelMaxLiters: 180000,
      rationsKg: 58000,
      rationsMaxKg: 65000,
      ammoRounds: 120000,
      ammoMaxRounds: 150000,
      medKits: 650,
      medMaxKits: 800,
      status: 'OPTIMAL'
    },
    {
      id: 'depot-khalsar',
      name: 'FSB Khalsar (Nubra Staging)',
      role: 'Tier-2 Transshipment Depot',
      altitudeM: 3050,
      tempC: -14,
      fuelLiters: 24500,
      fuelMaxLiters: 50000,
      rationsKg: 14200,
      rationsMaxKg: 22000,
      ammoRounds: 28000,
      ammoMaxRounds: 45000,
      medKits: 140,
      medMaxKits: 250,
      status: 'WARNING'
    },
    {
      id: 'depot-partapur',
      name: 'Partapur Base (102 Bde / Siachen HQ)',
      role: 'Tier-3 Forward Gateway Depot',
      altitudeM: 3180,
      tempC: -19,
      fuelLiters: 18200,
      fuelMaxLiters: 40000,
      rationsKg: 9800,
      rationsMaxKg: 18000,
      ammoRounds: 18500,
      ammoMaxRounds: 35000,
      medKits: 95,
      medMaxKits: 200,
      status: 'CRITICAL'
    }
  ]);

  const [transfers, setTransfers] = useState<RebalanceTransfer[]>([
    {
      id: 'TR-101',
      sourceDepot: 'Central Depot Leh',
      targetDepot: 'FSB Khalsar',
      commodity: 'Class III Arctic Kerosene',
      quantity: '12,000 Liters',
      convoyAsset: '2 × Tatra 8x8 (Snow Chains)',
      deadline: 'Cross Khardung La before 14:00 IST',
      urgency: 'CRITICAL',
      status: 'PENDING'
    },
    {
      id: 'TR-102',
      sourceDepot: 'FSB Khalsar',
      targetDepot: 'Partapur Base',
      commodity: 'Class I Caloric Rations',
      quantity: '4,500 Kg',
      convoyAsset: '1 × Stallion 4x4',
      deadline: 'Arrive before 16:30 IST',
      urgency: 'HIGH',
      status: 'PENDING'
    },
    {
      id: 'TR-103',
      sourceDepot: 'Central Depot Leh',
      targetDepot: 'Partapur Base',
      commodity: 'Class VIII HAPE / Oxygen Cylinders',
      quantity: '40 Cylinders',
      convoyAsset: 'IAF ALH Dhruv Air Sortie',
      deadline: 'Air corridor closes at 15:00 IST',
      urgency: 'HIGH',
      status: 'PENDING'
    }
  ]);

  // Custom Transfer Builder State
  const [sourceId, setSourceId] = useState('depot-leh');
  const [targetId, setTargetId] = useState('depot-khalsar');
  const [selectedSupply, setSelectedSupply] = useState<'fuel' | 'rations' | 'ammo' | 'med'>('fuel');
  const [transferAmount, setTransferAmount] = useState<number>(5000);

  const handleAuthorizeTransfer = (transferId: string) => {
    tacticalAudio.playSonar();
    setTransfers(prev =>
      prev.map(t => {
        if (t.id === transferId) {
          return { ...t, status: 'DISPATCHED' };
        }
        return t;
      })
    );

    const targetTransfer = transfers.find(t => t.id === transferId);
    if (targetTransfer) {
      // Adjust simulated depot levels
      if (targetTransfer.id === 'TR-101') {
        setDepots(prev =>
          prev.map(d => {
            if (d.id === 'depot-leh') return { ...d, fuelLiters: d.fuelLiters - 12000 };
            if (d.id === 'depot-khalsar') return { ...d, fuelLiters: d.fuelLiters + 12000, status: 'OPTIMAL' };
            return d;
          })
        );
      } else if (targetTransfer.id === 'TR-102') {
        setDepots(prev =>
          prev.map(d => {
            if (d.id === 'depot-khalsar') return { ...d, rationsKg: d.rationsKg - 4500 };
            if (d.id === 'depot-partapur') return { ...d, rationsKg: d.rationsKg + 4500, status: 'WARNING' };
            return d;
          })
        );
      }
      onNotify(`INTER-DEPOT REBALANCE AUTHORIZED: ${targetTransfer.quantity} dispatched from ${targetTransfer.sourceDepot} → ${targetTransfer.targetDepot}`);
    }
  };

  const handleExecuteCustomTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceId === targetId) {
      onNotify('ERROR: Source depot and target depot cannot be identical.');
      tacticalAudio.playAlert();
      return;
    }

    tacticalAudio.playBlip();
    const sourceDepot = depots.find(d => d.id === sourceId)?.name || 'Source';
    const targetDepot = depots.find(d => d.id === targetId)?.name || 'Target';

    const newTransfer: RebalanceTransfer = {
      id: `TR-${Math.floor(100 + Math.random() * 900)}`,
      sourceDepot,
      targetDepot,
      commodity:
        selectedSupply === 'fuel'
          ? `${transferAmount.toLocaleString()} L Fuel`
          : selectedSupply === 'rations'
          ? `${transferAmount.toLocaleString()} kg Rations`
          : selectedSupply === 'ammo'
          ? `${transferAmount.toLocaleString()} rds Ammo`
          : `${transferAmount} HAPE Units`,
      quantity: `${transferAmount.toLocaleString()} units`,
      convoyAsset: 'Tactical Convoy Dedicated',
      deadline: 'Pre-Nightfall Crossing Window',
      urgency: 'HIGH',
      status: 'DISPATCHED'
    };

    setTransfers(prev => [newTransfer, ...prev]);

    // Update quantities in depot state
    setDepots(prev =>
      prev.map(d => {
        if (d.id === sourceId) {
          if (selectedSupply === 'fuel') return { ...d, fuelLiters: Math.max(0, d.fuelLiters - transferAmount) };
          if (selectedSupply === 'rations') return { ...d, rationsKg: Math.max(0, d.rationsKg - transferAmount) };
          if (selectedSupply === 'ammo') return { ...d, ammoRounds: Math.max(0, d.ammoRounds - transferAmount) };
          if (selectedSupply === 'med') return { ...d, medKits: Math.max(0, d.medKits - transferAmount) };
        }
        if (d.id === targetId) {
          if (selectedSupply === 'fuel') return { ...d, fuelLiters: Math.min(d.fuelMaxLiters, d.fuelLiters + transferAmount) };
          if (selectedSupply === 'rations') return { ...d, rationsKg: Math.min(d.rationsMaxKg, d.rationsKg + transferAmount) };
          if (selectedSupply === 'ammo') return { ...d, ammoRounds: Math.min(d.ammoMaxRounds, d.ammoRounds + transferAmount) };
          if (selectedSupply === 'med') return { ...d, medKits: Math.min(d.medMaxKits, d.medKits + transferAmount) };
        }
        return d;
      })
    );

    onNotify(`CUSTOM REBALANCE DISPATCHED: Transferred ${transferAmount.toLocaleString()} units from ${sourceDepot} to ${targetDepot}.`);
  };

  return (
    <div className="multi-depot-balancing-root" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Khardung La Pass Countdown & Critical Window Alert */}
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.4rem' }}>⏳</span>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fca5a5', fontSize: '0.86rem', letterSpacing: '0.05em' }}>
              KHARDUNG LA PASS TRANSIT WINDOW: CLOSES AT 14:00 IST (T-MINUS 03H 45M)
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.78rem', marginTop: '2px' }}>
              Highway 175 (North Pullu → South Pullu). High blizzard risk after 15:30 IST. All staging redistribution must cross pass before checkpoint lockdown.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-dot" style={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#34d399', fontSize: '0.78rem', fontWeight: 700 }}>
            CURRENT STATUS: PASS OPEN / CLEAR
          </span>
        </div>
      </div>

      {/* 3-Depot Inventory Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '14px' }}>
        {depots.map(depot => {
          const fuelPct = Math.round((depot.fuelLiters / depot.fuelMaxLiters) * 100);
          const rationsPct = Math.round((depot.rationsKg / depot.rationsMaxKg) * 100);
          const ammoPct = Math.round((depot.ammoRounds / depot.ammoMaxRounds) * 100);
          const medPct = Math.round((depot.medKits / depot.medMaxKits) * 100);

          const statusBadgeColor =
            depot.status === 'OPTIMAL' ? '#10b981' : depot.status === 'WARNING' ? '#f59e0b' : '#ef4444';

          return (
            <div
              key={depot.id}
              className="exec-kpi-card"
              style={{
                borderLeft: `4px solid ${statusBadgeColor}`,
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '16px',
                borderRadius: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#f8fafc' }}>{depot.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    {depot.role} · {depot.altitudeM}m · {depot.tempC}&deg;C
                  </div>
                </div>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    background: `${statusBadgeColor}20`,
                    color: statusBadgeColor,
                    border: `1px solid ${statusBadgeColor}60`
                  }}
                >
                  {depot.status}
                </span>
              </div>

              {/* Progress Bars for Commodities */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                {/* Class III Fuel */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '3px' }}>
                    <span>⛽ Class III Fuel (Kerosene)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: fuelPct < 50 ? '#ef4444' : '#38bdf8' }}>
                      {depot.fuelLiters.toLocaleString()} / {depot.fuelMaxLiters.toLocaleString()} L ({fuelPct}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${fuelPct}%`,
                        background: fuelPct < 50 ? '#ef4444' : fuelPct < 70 ? '#f59e0b' : '#38bdf8',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Class I Rations */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '3px' }}>
                    <span>🍚 Class I Rations</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: rationsPct < 50 ? '#ef4444' : '#34d399' }}>
                      {depot.rationsKg.toLocaleString()} / {depot.rationsMaxKg.toLocaleString()} kg ({rationsPct}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${rationsPct}%`,
                        background: rationsPct < 50 ? '#ef4444' : '#10b981',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Class V Ammo */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '3px' }}>
                    <span>🎯 Class V Ammo (Rounds)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
                      {depot.ammoRounds.toLocaleString()} / {depot.ammoMaxRounds.toLocaleString()} rds ({ammoPct}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${ammoPct}%`, background: '#fbbf24', transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                {/* Class VIII Med Kits */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '3px' }}>
                    <span>💊 Class VIII HAPE Oxygen Kits</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#a78bfa' }}>
                      {depot.medKits} / {depot.medMaxKits} kits ({medPct}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${medPct}%`, background: '#a78bfa', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Grid: Recommended Redistribution Directives (Left) + Custom Convoy Planner (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
        {/* Left: Recommended High-Priority Transfers */}
        <div className="operating-picture-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                High-Priority Inter-Depot Balancing Directives
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Algorithmic recommendations to balance buffers before Khardung La pass closure
              </p>
            </div>
            <span className="badge-outpost-count">{transfers.length} DIRECTIVES</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transfers.map(tr => {
              const isDispatched = tr.status === 'DISPATCHED';
              return (
                <div
                  key={tr.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(51, 65, 85, 0.6)',
                    borderRadius: '6px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#38bdf8', fontSize: '0.76rem' }}>
                        {tr.id}
                      </span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>
                        {tr.sourceDepot} &rarr; {tr.targetDepot}
                      </span>
                    </div>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '0.64rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        background: tr.urgency === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: tr.urgency === 'CRITICAL' ? '#fca5a5' : '#fcd34d',
                        border: `1px solid ${tr.urgency === 'CRITICAL' ? '#ef4444' : '#f59e0b'}`
                      }}
                    >
                      {tr.urgency}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#cbd5e1' }}>
                    <span>
                      Cargo: <b style={{ color: '#38bdf8' }}>{tr.commodity}</b> ({tr.quantity})
                    </span>
                    <span style={{ color: '#94a3b8' }}>{tr.convoyAsset}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                      ⏱️ {tr.deadline}
                    </span>
                    <button
                      onClick={() => handleAuthorizeTransfer(tr.id)}
                      disabled={isDispatched}
                      style={{
                        background: isDispatched ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.2)',
                        border: `1px solid ${isDispatched ? '#10b981' : '#38bdf8'}`,
                        color: isDispatched ? '#34d399' : '#ffffff',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '4px',
                        cursor: isDispatched ? 'default' : 'pointer'
                      }}
                    >
                      {isDispatched ? 'Dispatched ✓' : 'Authorize Transfer ↗'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Custom Inter-Depot Rebalance Convoy Dispatcher */}
        <div className="operating-picture-panel" style={{ padding: '16px' }}>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Tactical Inter-Depot Transfer Console
            </h3>
            <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Manually route bulk reserves between rear and forward operating bases
            </p>
          </div>

          <form onSubmit={handleExecuteCustomTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Origin Depot */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
                ORIGIN DEPOT:
              </label>
              <select
                className="custom-select"
                value={sourceId}
                onChange={e => setSourceId(e.target.value)}
                style={{ width: '100%' }}
              >
                {depots.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Depot */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
                DESTINATION DEPOT:
              </label>
              <select
                className="custom-select"
                value={targetId}
                onChange={e => setTargetId(e.target.value)}
                style={{ width: '100%' }}
              >
                {depots.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Supply Class */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
                COMMODITY CLASS:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedSupply('fuel')}
                  style={{
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: selectedSupply === 'fuel' ? '#38bdf8' : '#334155',
                    background: selectedSupply === 'fuel' ? 'rgba(56, 189, 248, 0.2)' : '#0f172a',
                    color: selectedSupply === 'fuel' ? '#38bdf8' : '#94a3b8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⛽ Fuel
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSupply('rations')}
                  style={{
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: selectedSupply === 'rations' ? '#10b981' : '#334155',
                    background: selectedSupply === 'rations' ? 'rgba(16, 185, 129, 0.2)' : '#0f172a',
                    color: selectedSupply === 'rations' ? '#34d399' : '#94a3b8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🍚 Rations
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSupply('ammo')}
                  style={{
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: selectedSupply === 'ammo' ? '#f59e0b' : '#334155',
                    background: selectedSupply === 'ammo' ? 'rgba(245, 158, 11, 0.2)' : '#0f172a',
                    color: selectedSupply === 'ammo' ? '#fbbf24' : '#94a3b8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🎯 Ammo
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSupply('med')}
                  style={{
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: selectedSupply === 'med' ? '#a78bfa' : '#334155',
                    background: selectedSupply === 'med' ? 'rgba(167, 139, 250, 0.2)' : '#0f172a',
                    color: selectedSupply === 'med' ? '#c4b5fd' : '#94a3b8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  💊 Med
                </button>
              </div>
            </div>

            {/* Quantity Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '4px' }}>
                <span>QUANTITY TO TRANSFER:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#38bdf8' }}>
                  {transferAmount.toLocaleString()} {selectedSupply === 'fuel' ? 'L' : selectedSupply === 'rations' ? 'kg' : selectedSupply === 'ammo' ? 'rds' : 'kits'}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max={selectedSupply === 'med' ? '150' : '20000'}
                step={selectedSupply === 'med' ? '5' : '500'}
                value={transferAmount}
                onChange={e => setTransferAmount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '8px',
                padding: '10px 14px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                border: '1px solid #38bdf8',
                borderRadius: '6px',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
              }}
            >
              <span>🚚</span>
              <span>DISPATCH REBALANCE CONVOY</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
