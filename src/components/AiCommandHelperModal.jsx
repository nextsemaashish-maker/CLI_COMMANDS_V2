import React, { useState } from 'react';
import {
  Sparkles, X, Search, Copy, Check, Terminal as TermIcon,
  ShieldCheck, AlertTriangle, Flame, ArrowRight, CornerDownLeft, Filter
} from 'lucide-react';
import { AI_CATEGORIES, queryAiAssistant } from '../utils/aiCliEngine';
import { playKeyClickSound, playSuccessBeep } from '../utils/audioSynth';

export default function AiCommandHelperModal({ isOpen, onClose, onTryInTerminal, soundEnabled }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const results = queryAiAssistant(query, activeCategory);

  const handleCopy = (id, command) => {
    if (soundEnabled) playSuccessBeep();
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExecute = (command) => {
    if (soundEnabled) playKeyClickSound();
    onTryInTerminal(command);
    onClose();
  };

  const quickPrompts = [
    'Undo last git commit',
    'Find files > 100MB',
    'Kill process on port 3000',
    'Docker clean all containers',
    'Kubernetes port forward'
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        background: 'rgba(2, 6, 12, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          border: '1px solid rgba(0, 255, 136, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 255, 136, 0.15)',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #090e1a 0%, #04070e 100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            background: 'rgba(16, 185, 129, 0.08)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(0, 255, 136, 0.4)'
              }}
            >
              <Sparkles size={20} color="#000000" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                  NextSem AI Command Generator
                </h3>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#00ff88',
                    background: 'rgba(0, 255, 136, 0.15)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 255, 136, 0.3)'
                  }}
                >
                  v2.0 PRO
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Describe what you want to achieve in plain English – get production CLI commands
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost"
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '10px',
              padding: '8px 14px',
              gap: '10px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            <Search size={18} color="#00ff88" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., How to find large files, delete remote branch, restart docker..."
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                width: '100%'
              }}
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {AI_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  if (soundEnabled) playKeyClickSound();
                  setActiveCategory(cat.id);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeCategory === cat.id ? '1px solid #00ff88' : '1px solid rgba(255,255,255,0.08)',
                  background: activeCategory === cat.id ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: activeCategory === cat.id ? '#00ff88' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Prompts */}
          {!query && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={12} color="#f59e0b" /> Popular:
              </span>
              {quickPrompts.map((p, idx) => (
                <span
                  key={idx}
                  onClick={() => {
                    if (soundEnabled) playKeyClickSound();
                    setQuery(p);
                  }}
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--accent-cyan)',
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px dashed rgba(6, 182, 212, 0.3)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results List */}
        <div
          style={{
            padding: '16px 20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            flex: 1
          }}
        >
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <p>No matching commands found. Try modifying your query keywords.</p>
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(10, 16, 28, 0.7)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  transition: 'border-color 0.2s'
                }}
              >
                {/* Query Header & Safety */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ffffff' }}>
                    {item.query}
                  </span>
                  {item.safety === 'destructive' ? (
                    <span style={{ fontSize: '0.66rem', color: '#ef4444', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                      <AlertTriangle size={11} /> Destructive
                    </span>
                  ) : item.safety === 'warning' ? (
                    <span style={{ fontSize: '0.66rem', color: '#f59e0b', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                      <AlertTriangle size={11} /> Caution
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.66rem', color: '#10b981', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                      <ShieldCheck size={11} /> Safe
                    </span>
                  )}
                </div>

                {/* Command Bar */}
                <div
                  style={{
                    background: '#04070e',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <code
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: '#00ff88',
                      fontSize: '0.84rem',
                      wordBreak: 'break-all'
                    }}
                  >
                    $ {item.command}
                  </code>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <button
                      onClick={() => handleCopy(item.id, item.command)}
                      style={{
                        padding: '5px 8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '6px',
                        color: copiedId === item.id ? '#00ff88' : '#ffffff',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Copy Command"
                    >
                      {copiedId === item.id ? <Check size={13} color="#00ff88" /> : <Copy size={13} />}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => handleExecute(item.command)}
                      style={{
                        padding: '5px 10px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#000000',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Run in Live Terminal"
                    >
                      <TermIcon size={13} />
                      <span>Run in Terminal</span>
                    </button>
                  </div>
                </div>

                {/* Explanation */}
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.explanation}
                </p>

                {/* Flags Breakdown */}
                {item.flags && item.flags.length > 0 && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Flag Breakdown:
                    </span>
                    {item.flags.map((f, fIdx) => (
                      <div key={fIdx} style={{ fontSize: '0.74rem', display: 'flex', gap: '8px' }}>
                        <code style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{f.flag}</code>
                        <span style={{ color: 'var(--text-secondary)' }}>{f.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
