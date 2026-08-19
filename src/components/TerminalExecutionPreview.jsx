import React, { useState } from 'react';
import {
  Terminal as TermIcon, Copy, Check, Play, Sparkles, CheckCircle2,
  Minus, Square, X, Lightbulb, ShieldCheck, ChevronRight
} from 'lucide-react';
import { getCommandTerminalOutput } from '../utils/commandOutputs';
import { playKeyClickSound, playSuccessBeep } from '../utils/audioSynth';

export default function TerminalExecutionPreview({
  command,
  baseCmd,
  moduleTitle,
  themeColor = '#04AA6D',
  onTryInTerminal
}) {
  const [copied, setCopied] = useState(false);

  const displayCommand = command || baseCmd || 'dir';
  const isWindowsCmd = moduleTitle?.toLowerCase().includes('windows') ||
                       moduleTitle?.toLowerCase().includes('powershell') ||
                       displayCommand.startsWith('dir') ||
                       displayCommand.startsWith('cd') ||
                       displayCommand.startsWith('cls') ||
                       displayCommand.startsWith('copy') ||
                       displayCommand.startsWith('type');

  const simulatedOutput = getCommandTerminalOutput(baseCmd, displayCommand, moduleTitle);
  const promptPrefix = isWindowsCmd ? 'C:\\Users\\Developer>' : 'root@nextsem:~#';

  const handleCopy = () => {
    playKeyClickSound();
    const fullSnippet = `${promptPrefix} ${displayCommand}\n${simulatedOutput}`;
    navigator.clipboard.writeText(fullSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTry = () => {
    if (onTryInTerminal) {
      playKeyClickSound();
      onTryInTerminal(displayCommand);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
      {/* 1. Step Method Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#04AA6D',
              background: 'rgba(4, 170, 109, 0.15)',
              border: '1px solid rgba(4, 170, 109, 0.4)',
              padding: '2px 8px',
              borderRadius: '20px'
            }}
          >
            Step 1 • Visual Terminal Simulation
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
            Execute in Command Line
          </span>
        </div>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Realistic Windows / Linux Output Preview
        </span>
      </div>

      {/* 2. Direct Command Prompt Input Box with Emerald Underline */}
      <div
        style={{
          background: 'rgba(9, 16, 31, 0.7)',
          border: '1px solid rgba(51, 65, 85, 0.6)',
          borderRadius: '10px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ color: '#64748b', fontFamily: 'var(--font-mono)', fontSize: '0.86rem', fontWeight: 600 }}>
            {promptPrefix}
          </span>
          <span
            style={{
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              fontWeight: 800,
              textDecoration: 'underline',
              textDecorationColor: '#04AA6D',
              textDecorationThickness: '2px',
              textUnderlineOffset: '4px'
            }}
          >
            {displayCommand}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          <button
            onClick={handleCopy}
            style={{
              padding: '4px 10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              color: copied ? '#04AA6D' : '#cbd5e1',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Copy command"
          >
            {copied ? <Check size={12} color="#04AA6D" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onTryInTerminal && (
            <button
              onClick={handleTry}
              style={{
                padding: '4px 12px',
                background: 'linear-gradient(135deg, #04AA6D 0%, #038a58 100%)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 10px rgba(4, 170, 109, 0.3)'
              }}
              title="Run in Live Terminal"
            >
              <Play size={11} fill="#ffffff" />
              <span>Live Run</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Simulated Native Windows / Linux Terminal Screenshot Window */}
      <div
        style={{
          border: '1px solid rgba(51, 65, 85, 0.7)',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#09101f',
          boxShadow: '0 10px 35px rgba(0, 0, 0, 0.75), 0 0 20px rgba(4, 170, 109, 0.08)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Title Bar (Header with Windows Controls) */}
        <div
          style={{
            background: '#0e1117',
            borderBottom: '1px solid rgba(51, 65, 85, 0.7)',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Left: CLI Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '3px',
                background: '#04AA6D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TermIcon size={9} color="#000000" strokeWidth={3} />
            </div>
            <span style={{ color: '#cbd5e1', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {isWindowsCmd ? `Administrator: Command Prompt - ${displayCommand}` : `terminal — bash (${displayCommand})`}
            </span>
          </div>

          {/* Right: Window Controls (- □ ✕) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
            <Minus size={13} style={{ cursor: 'pointer' }} />
            <Square size={11} style={{ cursor: 'pointer' }} />
            <X size={13} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div
          style={{
            padding: '16px 18px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.84rem',
            lineHeight: 1.55,
            color: '#cbd5e1',
            background: 'rgba(9, 16, 31, 0.85)',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {/* Windows Header Banner if Windows CMD */}
          {isWindowsCmd && (
            <div style={{ color: '#64748b', fontSize: '0.74rem', marginBottom: '4px' }}>
              Microsoft Windows [Version 10.0.22631.3007]<br />
              (c) Microsoft Corporation. All rights reserved.
            </div>
          )}

          {/* Prompt + Command Line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: '#04AA6D', fontWeight: 700 }}>
              {promptPrefix}
            </span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>
              {displayCommand}
            </span>
          </div>

          {/* Command Output */}
          <pre
            style={{
              margin: '2px 0',
              fontFamily: 'inherit',
              fontSize: '0.82rem',
              color: '#94a3b8',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.5
            }}
          >
            {simulatedOutput}
          </pre>

          {/* Final Return Prompt with Pulsing Block Cursor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ color: '#04AA6D', fontWeight: 700 }}>
              {promptPrefix}
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '14px',
                background: '#04AA6D',
                animation: 'pulseDot 1s infinite'
              }}
            />
          </div>
        </div>

        {/* Status Bottom Bar */}
        <div
          style={{
            background: '#0a0d14',
            borderTop: '1px solid rgba(51, 65, 85, 0.5)',
            padding: '5px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#04AA6D' }}>
            <CheckCircle2 size={12} />
            <span>Process executed with Exit Code: 0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Environment: Production CLI</span>
            <span>Latency: 4ms</span>
          </div>
        </div>
      </div>

      {/* 4. Senior Developer Takeaways & Pro-Tip Box */}
      <div
        style={{
          background: 'rgba(9, 16, 31, 0.45)',
          border: '1px solid rgba(51, 65, 85, 0.6)',
          borderRadius: '12px',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#04AA6D', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <Lightbulb size={15} /> Senior Developer Takeaways & Insights
        </div>

        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.6 }}>
          <li>Always verify parameters before running file alteration commands.</li>
          <li>Use <code style={{ color: '#04AA6D', fontFamily: 'var(--font-mono)' }}>--help</code> or <code style={{ color: '#04AA6D', fontFamily: 'var(--font-mono)' }}>/?</code> for complete flag documentation.</li>
          <li>You can practice this command safely in the <strong>Live Terminal</strong> or <strong>Practice Labs</strong>.</li>
        </ul>

        {/* Pro-Tip Box */}
        <div
          style={{
            marginTop: '4px',
            background: 'rgba(4, 170, 109, 0.08)',
            borderLeft: '3px solid #04AA6D',
            padding: '8px 12px',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.74rem',
            color: '#cbd5e1'
          }}
        >
          <strong style={{ color: '#04AA6D' }}>💡 Pro-Tip:</strong> Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: '3px', fontFamily: 'var(--font-mono)' }}>Tab</kbd> in the Live Terminal to auto-complete directory and file paths instantly!
        </div>
      </div>
    </div>
  );
}
