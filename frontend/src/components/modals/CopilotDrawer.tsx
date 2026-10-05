import React, { useState, useRef, useEffect } from 'react';
import { COPILOT_KNOWLEDGE_BASE } from '../../data/mockData';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  sourceCitation?: string;
  relevanceConfidence?: string;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Tactical Logistics AI Online. Indexed across Army Logistics Doctrine (Glacial Sector), 14 Corps Movement SOP, and DGAFMS Medical Directives. How can I assist tactical forward supply operations?'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || loading) return;

    setMessages(prev => [...prev, { sender: 'user', text: trimmed }]);
    setInputVal('');
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/copilot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: data.response,
            sourceCitation: data.source_citation,
            relevanceConfidence: data.relevance_confidence
          }
        ]);
        setLoading(false);
        return;
      }
    } catch {
      // Fallback to local memory if offline
    }

    const match = COPILOT_KNOWLEDGE_BASE.find(k =>
      trimmed.toLowerCase().includes(k.query.toLowerCase().slice(0, 15)) ||
      k.query.toLowerCase().includes(trimmed.toLowerCase().slice(0, 15))
    ) || COPILOT_KNOWLEDGE_BASE[0];

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: match.response,
          sourceCitation: match.source,
          relevanceConfidence: match.relevance
        }
      ]);
      setLoading(false);
    }, 250);
  };

  const quickPrompts = [
    { label: '❄ Siachen Reserve SOP', q: 'What is the winter SOP reserve requirement for Siachen Kumar Base?' },
    { label: '🚧 Murgo Blockage Protocol', q: 'What are the protocol guidelines when Murgo Choke Point is blocked?' },
    { label: '🩺 HAPE Medical Protocol', q: 'What is the Class VIII medical protocol for high-altitude pulmonary edema (HAPE)?' }
  ];

  return (
    <aside className={`copilot-drawer ${isOpen ? 'open' : ''}`}>
      <div className="copilot-header">
        <div className="copilot-title">
          <span>🤖</span> MILITARY LOGISTICS SOP COPILOT
        </div>
        <button className="drawer-close-btn" onClick={onClose}>×</button>
      </div>

      <div className="copilot-chat-body" ref={chatBodyRef}>
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-bubble ${m.sender}`}>
            <div>{m.text}</div>
            {m.sourceCitation && (
              <span className="source-citation-badge">
                📖 SOURCE: {m.sourceCitation} ({m.relevanceConfidence} match)
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble assistant" style={{ fontStyle: 'italic', opacity: 0.7 }}>
            Querying doctrine database...
          </div>
        )}
      </div>

      <div className="copilot-quick-prompts">
        {quickPrompts.map((p, idx) => (
          <span
            key={idx}
            className="quick-prompt-chip"
            onClick={() => handleQuery(p.q)}
          >
            {p.label}
          </span>
        ))}
      </div>

      <div className="copilot-input-bar">
        <input
          type="text"
          className="copilot-input"
          placeholder="Ask Army logistics doctrine query..."
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleQuery(inputVal)}
        />
        <button
          className="action-execute-btn"
          onClick={() => handleQuery(inputVal)}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </aside>
  );
};
