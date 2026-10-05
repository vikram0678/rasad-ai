import React, { useState, useRef, useEffect } from 'react';
import { tacticalAudio } from '../../utils/audio';
import './RasadSahayakBot.css';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  engine?: string;
  isCritical?: boolean;
}

type LanguageMode = 'en' | 'hi' | 'bilingual';

export const RasadSahayakBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageMode>('en');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active Tactical Snapshot (Grounded in current 14 Corps state)
  const activePost = 'Post Charlie';
  const activeSector = 'Sector B (Drass-Kargil Axis)';
  const activeSupplyClass = 'Class V - Ammunition';
  const activeStockPct = 30;
  const activeUnits = 450;
  const activeDepletion = '18 hours';
  const activeTemp = '-18°C';

  const getInitialGreeting = (lang: LanguageMode) => {
    if (lang === 'hi') {
      return `नमस्ते, कमांडर! 🛡️\n\nमैं **रसद सहायक AI** हूँ, **14 कोर (लद्दाख एवं सियाचिन सेक्टर)** के लिए आपका सामरिक रसद निर्णय सहायक।\n\nमुझसे अग्रिम चौकियों की स्थिति (SITREP), कॉन्वॉय मार्ग, जोजी ला दर्रा हिमस्खलन बाईपास या सेना SOP के बारे में पूछें।`;
    } else if (lang === 'bilingual') {
      return `Greetings & नमस्ते, Commander! 🛡️\n\nI am **RASAD Sahayak AI**, your tactical logistics assistant for **HQ 14 Corps (Ladakh Sector)**.\n\nAsk me for real-time post SITREPs, convoy ETAs, avalanche pass bypasses, or logistics doctrines.`;
    } else {
      return `Greetings, Commander! 🛡️\n\nI am **RASAD Sahayak AI**, your tactical logistics decision assistant for **HQ 14 Corps (Ladakh / Siachen Sector)**.\n\nAsk me for real-time outpost SITREPs, convoy routing & ETAs, avalanche pass bypasses, or Indian Army logistics doctrines.`;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: getInitialGreeting('en'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      engine: '14 Corps Air-Gapped Engine'
    }
  ]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // External event listener for quick trigger
  useEffect(() => {
    const handleQuery = (e: any) => {
      const q = e?.detail?.query;
      setIsOpen(true);
      if (q) {
        setTimeout(() => handleSendMessage(q), 300);
      }
    };
    window.addEventListener('rasad-open-query', handleQuery);
    return () => window.removeEventListener('rasad-open-query', handleQuery);
  }, []);

  const buildDashboardSnapshot = () => ({
    node_name: activePost,
    sector: activeSector,
    supply_class: activeSupplyClass,
    stock_percent: activeStockPct,
    current_units: activeUnits,
    predicted_depletion: activeDepletion,
    priority: 'CRITICAL',
    personnel_strength: 600,
    ambient_temp: activeTemp,
    recommended_plan: {
      source: 'Base Manali (Nearest with stock)',
      route: 'Manali → Zoji → Dras → Charlie',
      transport: '6x6 Trucks (x4)',
      eta: '14 hours',
      confidence: 92
    }
  });

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    tacticalAudio.playBlip();

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8005/api/v1/rasad-sahayak/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          dashboard_context: buildDashboardSnapshot(),
          history: messages.slice(-4).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          language: selectedLanguage
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || 'C4ISR logistics telemetry processed.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          engine: data.engine_used === '14_corps_airgap_engine' ? '14 Corps Air-Gapped SOP Engine' : 'C4ISR Tactical Cloud',
          isCritical: data.is_critical
        };
        setMessages(prev => [...prev, botMsg]);
        tacticalAudio.playAlertTone();
      } else {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
    } catch {
      // Local air-gapped fallback
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: selectedLanguage === 'hi'
          ? `🛡️ **[ऑफ़लाइन 14 कोर सामरिक निर्देश — ${activePost}]**\n\n• **सप्लाई कमी**: ${activeSupplyClass} (${activeStockPct}% शेष)\n• **रिक्तीकरण समय**: ${activeDepletion}\n• **अनुशंसित आपूर्ति**: बेस मनाली से 4x ALS 6x6 ट्रक (ETA 14 घंटे)\n• *निर्देश*: जोजी ला दर्रे में बर्फबारी के दौरान सभी कॉन्वॉय में स्नो-चेन फिट करें।`
          : `🛡️ **[AIR-GAPPED 14 CORPS TACTICAL ADVISORY — ${activePost}]**\n\n• **Critical Deficit**: ${activeSupplyClass} (${activeStockPct}% Remaining)\n• **Stockout Horizon**: ${activeDepletion}\n• **Recommended Resupply**: 4x ALS 6x6 Tatra from Base Manali (ETA: 14 hrs)\n• *Directives*: Speed limited to 30 km/h; snow chains and Arctic fuel additives mandated across Zoji La.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engine: 'Air-Gapped Standalone Mode',
        isCritical: true
      };
      setMessages(prev => [...prev, fallbackMsg]);
      tacticalAudio.playAlertTone();
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    tacticalAudio.playBlip();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: getInitialGreeting(selectedLanguage),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engine: '14 Corps Air-Gapped Engine'
      }
    ]);
  };

  const changeLanguage = (newLang: LanguageMode) => {
    tacticalAudio.playBlip();
    setSelectedLanguage(newLang);
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id.startsWith('welcome')) {
        return [{ ...prev[0], text: getInitialGreeting(newLang) }];
      }
      return prev;
    });
  };

  const formatText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={pIdx} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: 4 }}>
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });

      return (
        <p key={idx} style={{ margin: line === '' ? '6px 0' : '2px 0' }}>
          {formattedParts}
        </p>
      );
    });
  };

  const getQuickSuggestions = () => {
    if (selectedLanguage === 'hi') {
      return [
        { id: 'sitrep', label: '🚨 पोस्ट चार्ली हेतु सामरिक स्थिति रिपोर्ट (SITREP)', query: 'पोस्ट चार्ली की वर्तमान रसद स्थिति (SITREP) क्या है?' },
        { id: 'route', label: '🚚 गोला-बारूद आपूर्ति मार्ग और ETA क्या है?', query: 'मनाली से आपूर्ति कॉन्वॉय का सुरक्षित मार्ग और ETA क्या है?' },
        { id: 'stock', label: '📦 वर्तमान भंडार और 18 घंटे में कमी की स्थिति?', query: 'वर्तमान भंडार और रिक्तीकरण समय के बारे में विस्तार से बताएं।' },
        { id: 'avalanche', label: '⚡ जोजी ला दर्रा हिमस्खलन ड्रिल चलाएं?', query: 'जोजी ला दर्रा हिमस्खलन के कारण बंद होने पर क्या योजना है?' }
      ];
    } else if (selectedLanguage === 'bilingual') {
      return [
        { id: 'sitrep', label: '🚨 Live SITREP & Ammo status for Post Charlie?', query: 'Generate an immediate tactical SITREP for Post Charlie in Hinglish.' },
        { id: 'route', label: '🚚 Best resupply route from Manali & convoy ETA?', query: 'What is recommended resupply route and convoy ETA for Post Charlie?' },
        { id: 'stock', label: '📦 Class V Ammunition critical depletion forecast?', query: 'Explain Class V Ammunition inventory holding and stockout time.' },
        { id: 'avalanche', label: '⚡ Simulate Zoji La avalanche blockage drill?', query: 'Simulate emergency pass blockage at Zoji La and route bypass.' }
      ];
    } else {
      return [
        { id: 'sitrep', label: '🚨 Generate Tactical SITREP for Post Charlie', query: 'Generate an immediate tactical SITREP for Post Charlie.' },
        { id: 'route', label: '🚚 Recommended Resupply Route & Convoy ETA', query: 'What is the recommended resupply route and convoy ETA for the active post?' },
        { id: 'stock', label: '📦 Class I-V Stock & Depletion Forecast', query: 'What is the current stock breakdown and depletion velocity?' },
        { id: 'avalanche', label: '⚡ Run What-If Pass Closure Drill', query: 'Simulate emergency avalanche pass blockage at Zoji La.' }
      ];
    }
  };

  const getInputPlaceholder = () => {
    if (selectedLanguage === 'hi') {
      return `${activePost} हेतु सैन्य प्रश्न पूछें (हिंदी)...`;
    } else if (selectedLanguage === 'bilingual') {
      return `Ask RASAD Sahayak about ${activePost} (English / हिंदी)...`;
    } else {
      return `Ask RASAD Sahayak in English about ${activePost}...`;
    }
  };

  return (
    <>
      {/* Animated Floating Circular Tactical Launcher */}
      {!isOpen && (
        <div className="rasad-launcher-wrapper" id="tour-sahayak-launcher">
          <div className="rasad-launcher-tooltip">
            <span className="rasad-tooltip-title">Ask RASAD Sahayak AI 🛡️</span>
            <span className="rasad-tooltip-sub">रसद सहायक • 24/7 C4ISR Sync</span>
          </div>
          <button
            className="rasad-circle-launcher"
            onClick={() => {
              tacticalAudio.playSonarPing();
              setIsOpen(true);
            }}
            title="Open RASAD Sahayak AI Tactical Logistics Assistant"
            aria-label="Open RASAD Sahayak AI"
          >
            <div className="rasad-radar-wave" />
            <div className="rasad-radar-wave wave-2" />
            <div className="rasad-launcher-dot" />
            <div className="rasad-circle-icon">🛡️</div>
          </button>
        </div>
      )}

      {/* Main Glassmorphic C4ISR Chat Window */}
      {isOpen && (
        <aside className="rasad-chat-window" aria-label="RASAD Sahayak AI Assistant">
          {/* Header */}
          <div className="rasad-chat-header">
            <div className="rasad-header-left">
              <div className="rasad-avatar-icon">🛡️</div>
              <div>
                <div className="rasad-header-title">RASAD Sahayak AI (रसद सहायक)</div>
                <div className="rasad-header-sub">14 Corps Tactical Logistics Assistant • Northern Command</div>
              </div>
            </div>
            <div className="rasad-header-actions">
              <button className="rasad-btn-icon" onClick={resetChat} title="Reset conversation">
                🔄
              </button>
              <button
                className="rasad-btn-icon"
                onClick={() => {
                  tacticalAudio.playBlip();
                  setIsOpen(false);
                }}
                title="Minimize assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tri-Mode Language Selector */}
          <div className="rasad-language-filter-bar">
            <span className="rasad-lang-label">🌐 Output Language:</span>
            <div className="rasad-lang-pills">
              <button
                type="button"
                className={`rasad-lang-pill ${selectedLanguage === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
                title="Pure English tactical responses"
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                className={`rasad-lang-pill ${selectedLanguage === 'hi' ? 'active' : ''}`}
                onClick={() => changeLanguage('hi')}
                title="शुद्ध हिन्दी में सैन्य निर्देश"
              >
                🇮🇳 हिंदी
              </button>
              <button
                type="button"
                className={`rasad-lang-pill ${selectedLanguage === 'bilingual' ? 'active' : ''}`}
                onClick={() => changeLanguage('bilingual')}
                title="Hindi + English combined"
              >
                🌐 Hinglish
              </button>
            </div>
          </div>

          {/* Live Synchronized Military State Banner */}
          <div className="rasad-synced-banner">
            <div className="rasad-synced-left">
              <span>📍 {activePost}</span>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>
                • 🔴 {activeStockPct}% Ammunition
              </span>
            </div>
            <div className="rasad-synced-right">
              ⏱️ Depletion: {activeDepletion} | {activeTemp}
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="rasad-messages-area">
            {messages.map(m => (
              <div key={m.id} className={`rasad-msg ${m.sender}`}>
                <div className={`rasad-msg-bubble ${m.isCritical ? 'critical-border' : ''}`}>
                  {formatText(m.text)}
                </div>
                <div className="rasad-msg-time">
                  {m.time} {m.engine && `• ${m.engine}`}
                </div>
              </div>
            ))}

            {/* Quick Suggestion Chips */}
            {messages.length <= 1 && (
              <div className="rasad-suggestions-stack">
                {getQuickSuggestions().map(s => (
                  <button
                    key={s.id}
                    className="rasad-suggestion-pill"
                    onClick={() => handleSendMessage(s.query)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="rasad-msg assistant">
                <div className="rasad-typing">
                  <div className="rasad-typing-dot" />
                  <div className="rasad-typing-dot" />
                  <div className="rasad-typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            className="rasad-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              className="rasad-input-field"
              placeholder={getInputPlaceholder()}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="rasad-btn-send"
              disabled={isLoading || !inputMessage.trim()}
              title="Transmit query to C4ISR Logistics Core"
            >
              ➤
            </button>
          </form>
        </aside>
      )}
    </>
  );
};

export default RasadSahayakBot;
