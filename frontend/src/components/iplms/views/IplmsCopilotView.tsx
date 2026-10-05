import React, { useState } from 'react';
import { tacticalAudio } from '../../../utils/audio';

export const IplmsCopilotView: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; bullets?: string[] }>>([
    {
      role: 'assistant',
      text: '3 locations currently have high critical shortage risk in the Ladakh Sector:',
      bullets: [
        '1. Post Charlie — 18 hours remaining cover (Class V - Ammunition)',
        '2. Post Delta — 24 hours remaining cover (Class III - POL Fuel)',
        '3. Kargil Depot — Primary supply corridor blocked by Km 114 Landslide'
      ]
    },
    {
      role: 'user',
      text: 'Why is Post Charlie critical?'
    },
    {
      role: 'assistant',
      text: 'Post Charlie is flagged as CRITICAL due to 4 converging factors evaluated by the Neural Prophet engine:',
      bullets: [
        '• Current ammunition stock has dropped to 30% (safety threshold is 35%)',
        '• Forward defensive patrols have increased consumption rate by +40% over baseline',
        '• Highway 1D access is blocked by rockfall; resupply requires Route B mountain pass bypass',
        '• Without convoy dispatch approval, complete stockout will occur in 18 hours (91% AI confidence)'
      ]
    }
  ]);

  const [input, setInput] = useState('');

  const quickPrompts = [
    'Which locations have the highest shortage risk?',
    'Why is Post Charlie critical?',
    'Show alternative plans',
    'Simulate impact',
    'Check vehicle availability'
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    tacticalAudio.playBlip();
    const newMsgs = [...messages, { role: 'user' as const, text: q }];
    setInput('');

    setTimeout(() => {
      tacticalAudio.playSonar();
      let resp = 'Understood, Commander. Analyzing real-time telemetry across 14 Corps sector...';
      let bullets: string[] | undefined;

      if (q.includes('vehicle') || q.includes('availability')) {
        resp = 'Vehicle readiness analysis across Base Manali and Leh hubs:';
        bullets = [
          '• 89 vehicles (62%) are immediately mission-available',
          '• 38 vehicles currently deployed in active resupply convoys',
          '• 2 heavy-lift UAVs ready at Post Alpha for precision snowbound drops'
        ];
      } else if (q.includes('alternative') || q.includes('plans')) {
        resp = 'Generated 2 tactical contingency bypass routes around Km 114:';
        bullets = [
          '• Plan Alpha: Route B Southern Ridge (280 km, ETA 14h, Low Risk)',
          '• Plan Bravo: Aerial UAV drop for critical ammo (200 kg payload, ETA 1.8h)'
        ];
      } else {
        resp = `Telemetry for "${q}": All forward sectors reporting secure SATCOM link. Demand models indicate stable cover for 22 out of 28 garrisons.`;
      }

      setMessages([...newMsgs, { role: 'assistant', text: resp, bullets }]);
    }, 400);
  };

  return (
    <div className="iplms-view-container">
      <div className="iplms-panel-card iplms-p-4 copilot-chat-panel">
        <div className="iplms-panel-title-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
          <div>
            <h4 className="iplms-panel-title">Logistics AI Assistant</h4>
            <span className="iplms-meta-sub">Ask questions about inventory, routes, incidents or contingency simulations</span>
          </div>
          <span className="airgap-pill-badge">AIR-GAPPED // TOP SECRET</span>
        </div>

        {/* Quick Prompt Chips */}
        <div className="copilot-chips-row">
          {quickPrompts.map((p, i) => (
            <button key={i} className="copilot-chip-btn" onClick={() => handleSend(p)}>
              {p}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div className="copilot-messages-container">
          {messages.map((m, idx) => (
            <div key={idx} className={`copilot-msg-bubble ${m.role === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
              <div className="msg-sender-tag">
                {m.role === 'user' ? 'OPS COMMANDER' : 'RASAD-AI CORE'}
              </div>
              <p className="msg-text">{m.text}</p>
              {m.bullets && (
                <ul className="msg-bullets-list">
                  {m.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="copilot-input-bar">
          <input
            type="text"
            className="copilot-text-input"
            placeholder="Type your question (e.g. Which route has the lowest avalanche risk?)..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button className="copilot-send-btn" onClick={() => handleSend()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
