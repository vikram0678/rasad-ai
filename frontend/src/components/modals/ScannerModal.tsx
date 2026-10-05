import React from 'react';
import { CARGO_CV_SCAN_DATA } from '../../data/mockData';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="tactical-modal-backdrop open" onClick={onClose}>
      <div className="tactical-modal-box" onClick={e => e.stopPropagation()}>
        <div className="tactical-modal-header">
          <div className="tactical-modal-title">
            <span>📷</span> OPTICAL CARGO SCANNER (YOLOv8 CHECKPOINT VERIFICATION)
          </div>
          <button className="drawer-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="tactical-modal-body">
          <div className="scanner-viewport">
            <div className="scanner-laser"></div>
            <div className="scanner-hud-grid">
              CAM-04: SOUTH PULLU GATE #2<br />
              SCAN STATUS: 100% COMPLETE<br />
              CONFIDENCE: {CARGO_CV_SCAN_DATA.opticalConfidenceOverall}<br />
              WEIGHT SENSOR MISMATCH: {CARGO_CV_SCAN_DATA.weightSensorMismatch}
            </div>

            <div className="cv-detection-crate" style={{ top: '40px', left: '60px', width: '150px', height: '90px' }}>
              Class III Kerosene [98.7%]
            </div>
            <div className="cv-detection-crate" style={{ top: '40px', left: '240px', width: '160px', height: '90px' }}>
              Class I Rations [97.2%]
            </div>
            <div className="cv-detection-crate" style={{ top: '150px', left: '60px', width: '150px', height: '85px' }}>
              Class VIII Med-Kits [99.1%]
            </div>
            <div className="cv-detection-crate" style={{ top: '150px', left: '240px', width: '160px', height: '85px' }}>
              5.56mm Ammo Sealed [98.4%]
            </div>
          </div>

          <div style={{ marginTop: '16px', background: 'rgba(30, 41, 59, 0.5)', padding: '14px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span><b>Target Convoy:</b> {CARGO_CV_SCAN_DATA.convoyId}</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}><b>Manifest Integrity:</b> 100% Verified</span>
            </div>
            <div><b>Vehicle Reg:</b> {CARGO_CV_SCAN_DATA.vehicleReg}</div>
            <div><b>Tamper Status:</b> <span style={{ color: '#38bdf8', fontWeight: 700 }}>{CARGO_CV_SCAN_DATA.inspectionStatus}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
