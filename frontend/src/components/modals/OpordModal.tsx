import React from 'react';

interface OpordModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispatches: Array<{ id: string; route: string; mode: string; cargo: string; departure: string; status: string }>;
  zuluTime: string;
}

export const OpordModal: React.FC<OpordModalProps> = ({
  isOpen,
  onClose,
  dispatches,
  zuluTime
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="tactical-modal opord-document-modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', background: '#0a0f1d', border: '1.5px solid #38bdf8' }}
      >
        <div className="tactical-modal-header" style={{ borderBottom: '2px solid #38bdf8', padding: '16px 24px', background: '#080d19' }}>
          <div className="tactical-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>📜</span>
            <span>OPERATIONAL LOGISTICS ORDER (OPORD 14-CORPS / 2026)</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🖨️ Print / Save PDF
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        <div className="tactical-modal-body" style={{ padding: '24px 32px', fontFamily: 'var(--font-body)', color: '#f8fafc', fontSize: '13px', lineHeight: 1.6 }}>
          {/* Classification Banner */}
          <div style={{ textAlign: 'center', marginBottom: '20px', padding: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '4px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fca5a5', letterSpacing: '2px', fontSize: '12px' }}>
              RESTRICTED — EXCLUSIVE TO HEADQUARTERS 14 CORPS LOGISTICS COMMAND
            </span>
          </div>

          {/* Letterhead */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '14px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#ffffff' }}>HQ 14 CORPS (FIRE &amp; FURY)</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>BRANCH: GENERAL STAFF (OPERATIONAL LOGISTICS)</div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>THEATRE: SUB-SECTOR NORTH (SSN) &amp; SIACHEN GLACIAL AXIS</div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#cbd5e1' }}>
              <div>REF: OPORD/14C/LOG/2026-OCT-04</div>
              <div>DTG: {zuluTime || '040410Z OCT 2026'}</div>
              <div>COPY NO: 01 OF 04 (AIR-GAPPED)</div>
            </div>
          </div>

          {/* Section 1: Situation */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#38bdf8', fontSize: '13px', textTransform: 'uppercase', marginBottom: '4px' }}>
              1. SITUATION &amp; CLIMATIC THREAT ASSESSMENT
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '12px' }}>
              Severe early-winter conditions prevailing across Shyok and Depsang axes. Ambient temperatures at DBO and Siachen Base ranging between -18&deg;C and -32&deg;C. Khardung La pass window open until 14:00 IST. High avalanche susceptibility at Murgo Km 134 requires active alternate bypass readiness.
            </p>
          </div>

          {/* Section 2: Mission */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#38bdf8', fontSize: '13px', textTransform: 'uppercase', marginBottom: '4px' }}>
              2. MISSION STATEMENT
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '12px' }}>
              HQ 14 Corps logistics assets will execute multi-modal resupply to ensure all forward high-altitude posts maintain minimum 14-day Class III (Arctic Kerosene) and 21-day Class I (Caloric Rations) buffers, mitigating zero-stockout probability to &lt;0.05%.
            </p>
          </div>

          {/* Section 3: Execution Dispatches Table */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#38bdf8', fontSize: '13px', textTransform: 'uppercase', marginBottom: '6px' }}>
              3. EXECUTION — AUTHORIZED DISPATCH MANIFEST
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr style={{ background: '#1e293b', color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '6px 10px', border: '1px solid #334155' }}>ORDER ID</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #334155' }}>ROUTE AXIS</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #334155' }}>ASSET TYPE</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #334155' }}>PAYLOAD</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #334155' }}>ETD</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #334155' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {dispatches.map(dp => (
                  <tr key={dp.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '6px 10px', fontWeight: 'bold', color: '#38bdf8' }}>{dp.id}</td>
                    <td style={{ padding: '6px 10px' }}>{dp.route}</td>
                    <td style={{ padding: '6px 10px' }}>{dp.mode}</td>
                    <td style={{ padding: '6px 10px' }}>{dp.cargo}</td>
                    <td style={{ padding: '6px 10px' }}>{dp.departure}</td>
                    <td style={{ padding: '6px 10px', color: dp.status === 'Approved' ? '#10b981' : '#f59e0b' }}>
                      {dp.status.toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 4: Commander Authentication Seal */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#64748b' }}>
              <div>CRYPTOGRAPHIC TAMPER SEAL: <span style={{ color: '#10b981' }}>#HQ-14C-RSA2048-VERIFIED</span></div>
              <div>AIRGAP AUDIT HASH: <span style={{ color: '#38bdf8' }}>0x8F32C79E0B2251</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ borderBottom: '1px solid #cbd5e1', width: '180px', marginBottom: '4px' }}></div>
              <div style={{ fontWeight: 800, fontSize: '12px' }}>BRIG. LOGISTICS COMMAND</div>
              <div style={{ color: '#94a3b8', fontSize: '10px' }}>FOR GOC 14 CORPS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
