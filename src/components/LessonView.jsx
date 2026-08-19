import React, { useState } from 'react';
import {
  Play, CheckCircle2, Award, Copy, Check, Terminal as TermIcon,
  Sliders, ChevronLeft, ChevronRight, Download, PanelLeftOpen, Menu, Lightbulb
} from 'lucide-react';
import { playSuccessBeep, playKeyClickSound } from '../utils/audioSynth';
import TerminalExecutionPreview from './TerminalExecutionPreview';

export default function LessonView({
  lesson,
  currentModule,
  isCompleted,
  onMarkComplete,
  onOpenQuiz,
  onTryInTerminal,
  onNavigateNext,
  onNavigatePrev,
  hasNextLesson,
  hasPrevLesson,
  isSidebarOpen,
  onToggleSidebar,
  onOpenMobileDrawer
}) {
  const [copied, setCopied] = useState(false);
  const [selectedFlags, setSelectedFlags] = useState([]);
  const [inlineSelectedAnswer, setInlineSelectedAnswer] = useState(null);
  const [showInlineHint, setShowInlineHint] = useState(false);

  if (!lesson) {
    return (
      <div className="glass-panel" style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
        <h2>Select a lesson from curriculum to begin learning</h2>
      </div>
    );
  }

  const themeColor = currentModule?.color || '#10b981';
  const interactive = lesson.interactiveCommand;

  const activeFlagsString = selectedFlags.join(' ');
  const constructedCommand = interactive
    ? `${interactive.base} ${activeFlagsString} ${
        interactive.targetDir || interactive.defaultArgs.split(' ').slice(-1)[0] || ''
      }`.trim()
    : '';

  const handleToggleFlag = (flagStr) => {
    playKeyClickSound();
    if (selectedFlags.includes(flagStr)) {
      setSelectedFlags(selectedFlags.filter((f) => f !== flagStr));
    } else {
      setSelectedFlags([...selectedFlags, flagStr]);
    }
  };

  const handleMarkCompleteClick = () => {
    playSuccessBeep();
    onMarkComplete(lesson.id);
  };

  const copyText = (text) => {
    playKeyClickSound();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportAsMarkdown = () => {
    playKeyClickSound();
    let mdContent = `# ${lesson.title}\n\n`;
    mdContent += `> Module: **${currentModule?.title}** | Subtopic: \`${lesson.subtopic}\`\n\n`;
    mdContent += `* **XP Reward**: \`+${lesson.xp} XP\`\n`;
    mdContent += `* **Summary**: ${lesson.summary}\n\n`;
    mdContent += `${lesson.content}\n\n`;

    if (interactive) {
      mdContent += `### Command Syntax & Flags\n\n`;
      mdContent += `\`\`\`bash\n$ ${interactive.defaultArgs}\n\`\`\`\n\n`;
      interactive.flags.forEach((f) => {
        mdContent += `- \`${f.flag}\` (${f.name}): ${f.desc}\n`;
      });
      mdContent += `\n`;
    }

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      key={lesson.id}
      className="glass-panel animate-fade-in"
      style={{
        flex: 1,
        minWidth: 0,
        height: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Breadcrumbs & Meta Badges Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Desktop toggle sidebar button */}
            {!isSidebarOpen && onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="desktop-only-element"
                title="Show Curriculum Sidebar (Ctrl + B)"
                style={{
                  padding: '3px 8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '6px',
                  color: '#00ff88',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <PanelLeftOpen size={13} />
                <span>Curriculum</span>
              </button>
            )}

            {/* Mobile open curriculum drawer button */}
            {onOpenMobileDrawer && (
              <button
                onClick={onOpenMobileDrawer}
                className="mobile-only-drawer-btn"
                style={{
                  padding: '4px 8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '6px',
                  color: '#00ff88',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Menu size={13} />
                <span>Curriculum</span>
              </button>
            )}

            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                color: '#04AA6D',
                background: 'rgba(4, 170, 109, 0.15)',
                border: '1px solid rgba(4, 170, 109, 0.4)',
                padding: '3px 10px',
                borderRadius: '20px'
              }}
            >
              {currentModule?.title?.toUpperCase()}
            </span>

            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: '#94a3b8',
                border: '1px solid rgba(51, 65, 85, 0.7)',
                padding: '3px 10px',
                borderRadius: '20px'
              }}
            >
              Lesson #{lesson.id} / 1000
            </span>

            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                padding: '3px 8px',
                borderRadius: '6px',
                color: 'var(--text-muted)'
              }}
            >
              ⏱️ {lesson.estimatedMinutes || 5} min read
            </span>
          </div>

          <div
            style={{
              padding: '3px 10px',
              background: 'rgba(4, 170, 109, 0.15)',
              border: '1px solid rgba(4, 170, 109, 0.4)',
              borderRadius: '20px',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              color: '#04AA6D',
              fontWeight: 800,
              whiteSpace: 'nowrap'
            }}
          >
            +{lesson.xp} XP REWARD
          </div>
        </div>

        {/* Hero Title & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h1
            style={{
              fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.4px',
              lineHeight: 1.25
            }}
          >
            {lesson.title}
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              margin: 0,
              fontSize: '0.94rem',
              lineHeight: 1.55
            }}
          >
            {lesson.summary}
          </p>
        </div>

        {/* Action Controls Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '8px 12px',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          {/* Previous & Next Quick Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onNavigatePrev}
              disabled={!hasPrevLesson}
              className="btn-secondary"
              style={{
                opacity: hasPrevLesson ? 1 : 0.4,
                cursor: hasPrevLesson ? 'pointer' : 'not-allowed',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Go to previous lesson"
            >
              <ChevronLeft size={14} /> Prev
            </button>

            <button
              onClick={onNavigateNext}
              disabled={!hasNextLesson}
              className="btn-secondary"
              style={{
                opacity: hasNextLesson ? 1 : 0.4,
                cursor: hasNextLesson ? 'pointer' : 'not-allowed',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Go to next lesson"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>

          {/* Export & Mark Complete CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportAsMarkdown}
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
              title="Download lesson .md file"
            >
              <Download size={13} /> <span className="desktop-only-element">Export</span> .md
            </button>

            <button
              onClick={handleMarkCompleteClick}
              className="btn-primary"
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: isCompleted ? themeColor : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: isCompleted ? '#000000' : '#ffffff',
                border: 'none'
              }}
            >
              <CheckCircle2 size={14} color={isCompleted ? '#000000' : '#ffffff'} />
              {isCompleted ? 'Completed ✓' : 'Mark Complete'}
            </button>
          </div>
        </div>

        {/* Interactive Command Flag Builder Widget */}
        {interactive && (
          <div
            style={{
              background: 'var(--bg-dark-obsidian)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: themeColor }}>
                <Sliders size={15} />
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                  INTERACTIVE FLAG BUILDER
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Toggle flags to construct live command
              </span>
            </div>

            {/* Flags Selector Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {interactive.flags.map((f) => {
                const isActive = selectedFlags.includes(f.flag);
                return (
                  <div
                    key={f.flag}
                    onClick={() => handleToggleFlag(f.flag)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.76rem',
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-xs)',
                      border: isActive ? `1px solid ${themeColor}` : '1px solid var(--border-subtle)',
                      background: isActive ? `${themeColor}22` : 'rgba(255, 255, 255, 0.03)',
                      color: isActive ? themeColor : 'var(--text-secondary)',
                      fontWeight: isActive ? 700 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    title={f.desc}
                  >
                    {f.flag} <span style={{ opacity: 0.7, fontSize: '0.68rem' }}>({f.name})</span>
                  </div>
                );
              })}
            </div>

            {/* Code Output Row */}
            <div
              style={{
                background: '#090d14',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <code
                style={{
                  color: themeColor,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  wordBreak: 'break-all'
                }}
              >
                $ {constructedCommand || interactive.defaultArgs}
              </code>

              <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                <button
                  onClick={() => copyText(constructedCommand || interactive.defaultArgs)}
                  className="btn-ghost"
                  style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                >
                  {copied ? <Check size={13} color={themeColor} /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => onTryInTerminal(constructedCommand || interactive.defaultArgs)}
                  className="btn-primary"
                  style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                >
                  <TermIcon size={13} /> Try in Terminal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Terminal Execution & Output Screenshot Preview */}
        <TerminalExecutionPreview
          command={constructedCommand || interactive?.defaultArgs || lesson.title}
          baseCmd={interactive?.base || (lesson.title.includes('(') ? lesson.title.split('(')[1]?.replace(')', '') : '')}
          moduleTitle={currentModule?.title}
          themeColor={themeColor}
          onTryInTerminal={onTryInTerminal}
        />

        {/* Main Lesson Content */}
        <div
          style={{
            lineHeight: 1.75,
            color: 'var(--text-secondary)',
            fontSize: '0.92rem'
          }}
        >
          {(() => {
            const renderInline = (str) => {
              if (!str) return null;
              const parts = str.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
              return parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={i} style={{ color: '#ffffff', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
                  return <em key={i} style={{ color: '#e2e8f0', fontStyle: 'italic' }}>{part.slice(1, -1)}</em>;
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                  return (
                    <code
                      key={i}
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: themeColor,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.86em',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      {part.slice(1, -1)}
                    </code>
                  );
                }
                return part;
              });
            };

            // Structured AST block parser
            const lines = (lesson.content || '').split('\n');
            const blocks = [];
            let i = 0;

            while (i < lines.length) {
              const line = lines[i];
              const trimmed = line.trim();

              if (!trimmed) {
                i++;
                continue;
              }

              // 1. Fenced Code Block (```lang ... ```)
              if (trimmed.startsWith('```')) {
                const lang = trimmed.replace(/^```/, '').trim();
                const codeLines = [];
                i++;
                while (i < lines.length && !lines[i].trim().startsWith('```')) {
                  codeLines.push(lines[i]);
                  i++;
                }
                if (i < lines.length && lines[i].trim().startsWith('```')) {
                  i++;
                }
                blocks.push({
                  type: 'code',
                  lang: lang || 'bash',
                  code: codeLines.join('\n')
                });
                continue;
              }

              // 2. Horizontal Divider (--- or ***)
              if (/^(---|\*\*\*|___)$/.test(trimmed)) {
                blocks.push({ type: 'hr' });
                i++;
                continue;
              }

              // 3. Headings (# to ######)
              const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
              if (headingMatch) {
                blocks.push({
                  type: 'heading',
                  level: headingMatch[1].length,
                  text: headingMatch[2]
                });
                i++;
                continue;
              }

              // 4. Blockquotes (> ...)
              if (trimmed.startsWith('>')) {
                const quoteLines = [];
                while (i < lines.length && lines[i].trim().startsWith('>')) {
                  quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
                  i++;
                }
                blocks.push({
                  type: 'blockquote',
                  text: quoteLines.join(' ')
                });
                continue;
              }

              // 5. Unordered List (- or *)
              if (/^[-*]\s/.test(trimmed)) {
                const listItems = [];
                while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
                  listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
                  i++;
                }
                blocks.push({
                  type: 'unordered-list',
                  items: listItems
                });
                continue;
              }

              // 6. Ordered List (1. , 2. ) with potential nested code blocks
              if (/^\d+\.\s/.test(trimmed)) {
                const listItems = [];
                while (i < lines.length) {
                  const currLine = lines[i];
                  const currTrimmed = currLine.trim();

                  if (!currTrimmed) {
                    let nextIdx = i + 1;
                    while (nextIdx < lines.length && !lines[nextIdx].trim()) nextIdx++;
                    if (
                      nextIdx < lines.length &&
                      (/^\d+\.\s/.test(lines[nextIdx].trim()) || lines[nextIdx].trim().startsWith('```'))
                    ) {
                      i++;
                      continue;
                    } else {
                      break;
                    }
                  }

                  if (/^\d+\.\s/.test(currTrimmed)) {
                    const itemText = currTrimmed.replace(/^\d+\.\s+/, '');
                    listItems.push({ text: itemText, subCode: null });
                    i++;
                  } else if (currTrimmed.startsWith('```')) {
                    const lang = currTrimmed.replace(/^```/, '').trim();
                    const codeLines = [];
                    i++;
                    while (i < lines.length && !lines[i].trim().startsWith('```')) {
                      codeLines.push(lines[i]);
                      i++;
                    }
                    if (i < lines.length && lines[i].trim().startsWith('```')) {
                      i++;
                    }
                    if (listItems.length > 0) {
                      listItems[listItems.length - 1].subCode = {
                        lang: lang || 'bash',
                        code: codeLines.join('\n')
                      };
                    }
                  } else {
                    if (
                      listItems.length > 0 &&
                      !currTrimmed.startsWith('#') &&
                      !/^[-*]\s/.test(currTrimmed) &&
                      !/^(---|\*\*\*|___)$/.test(currTrimmed)
                    ) {
                      listItems[listItems.length - 1].text += ' ' + currTrimmed;
                      i++;
                    } else {
                      break;
                    }
                  }
                }
                blocks.push({
                  type: 'ordered-list',
                  items: listItems
                });
                continue;
              }

              // 7. Regular Paragraph
              const paraLines = [];
              while (i < lines.length) {
                const pLine = lines[i];
                const pTrimmed = pLine.trim();
                if (!pTrimmed) break;
                if (
                  pTrimmed.startsWith('```') ||
                  /^(#{1,6})\s/.test(pTrimmed) ||
                  pTrimmed.startsWith('>') ||
                  /^[-*]\s/.test(pTrimmed) ||
                  /^\d+\.\s/.test(pTrimmed) ||
                  /^(---|\*\*\*|___)$/.test(pTrimmed)
                ) {
                  break;
                }
                paraLines.push(pTrimmed);
                i++;
              }
              if (paraLines.length > 0) {
                blocks.push({
                  type: 'paragraph',
                  text: paraLines.join(' ')
                });
              }
            }

            // Render AST blocks to React elements
            return blocks.map((b, idx) => {
              if (b.type === 'hr') {
                return (
                  <hr
                    key={idx}
                    style={{
                      border: 'none',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      margin: '22px 0'
                    }}
                  />
                );
              }

              if (b.type === 'code') {
                return (
                  <div
                    key={idx}
                    style={{
                      margin: '16px 0',
                      background: '#04060b',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        background: '#090d14',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <span>{b.lang || 'bash'}</span>
                      <button
                        onClick={() => copyText(b.code.replace(/^\$\s*/gm, ''))}
                        className="btn-ghost"
                        style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                      >
                        Copy
                      </button>
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        padding: '12px 16px',
                        overflowX: 'auto',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.86rem',
                        color: themeColor,
                        lineHeight: 1.5
                      }}
                    >
                      <code>{b.code}</code>
                    </pre>
                  </div>
                );
              }

              if (b.type === 'blockquote') {
                return (
                  <div
                    key={idx}
                    style={{
                      margin: '16px 0',
                      padding: '12px 16px',
                      background: 'rgba(16, 185, 129, 0.08)',
                      borderLeft: `4px solid ${themeColor}`,
                      borderRadius: '0 8px 8px 0',
                      fontSize: '0.9rem',
                      color: '#ffffff'
                    }}
                  >
                    {renderInline(b.text)}
                  </div>
                );
              }

              if (b.type === 'heading') {
                if (b.level === 1) {
                  return (
                    <h1
                      key={idx}
                      style={{
                        color: '#ffffff',
                        margin: '26px 0 12px 0',
                        fontSize: '1.45rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800
                      }}
                    >
                      {renderInline(b.text)}
                    </h1>
                  );
                }
                if (b.level === 2) {
                  return (
                    <h2
                      key={idx}
                      style={{
                        color: '#ffffff',
                        margin: '24px 0 12px 0',
                        fontSize: '1.3rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800
                      }}
                    >
                      {renderInline(b.text)}
                    </h2>
                  );
                }
                if (b.level === 3) {
                  return (
                    <h3
                      key={idx}
                      style={{
                        color: '#ffffff',
                        margin: '22px 0 10px 0',
                        fontSize: '1.16rem',
                        fontFamily: 'var(--font-display)',
                        borderLeft: `3px solid ${themeColor}`,
                        paddingLeft: '10px',
                        fontWeight: 800
                      }}
                    >
                      {renderInline(b.text)}
                    </h3>
                  );
                }
                if (b.level === 4) {
                  return (
                    <h4
                      key={idx}
                      style={{
                        color: '#ffffff',
                        margin: '18px 0 8px 0',
                        fontSize: '1rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700
                      }}
                    >
                      {renderInline(b.text)}
                    </h4>
                  );
                }
                if (b.level === 5) {
                  return (
                    <h5
                      key={idx}
                      style={{
                        color: '#00ff88',
                        margin: '16px 0 8px 0',
                        fontSize: '0.86rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        letterSpacing: '0.3px',
                        display: 'block'
                      }}
                    >
                      <span style={{ color: themeColor, marginRight: '6px' }}>▸</span>
                      {renderInline(b.text)}
                    </h5>
                  );
                }
                return (
                  <h6
                    key={idx}
                    style={{
                      color: 'var(--text-muted)',
                      margin: '12px 0 6px 0',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {renderInline(b.text)}
                  </h6>
                );
              }

              if (b.type === 'unordered-list') {
                return (
                  <ul
                    key={idx}
                    style={{
                      paddingLeft: '22px',
                      margin: '10px 0',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {b.items.map((li, liIdx) => (
                      <li key={liIdx} style={{ marginBottom: '6px', lineHeight: 1.6 }}>
                        {renderInline(li)}
                      </li>
                    ))}
                  </ul>
                );
              }

              if (b.type === 'ordered-list') {
                return (
                  <ol
                    key={idx}
                    style={{
                      paddingLeft: '22px',
                      margin: '10px 0',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {b.items.map((item, itemIdx) => (
                      <li key={itemIdx} style={{ marginBottom: '8px', lineHeight: 1.6 }}>
                        <div>{renderInline(item.text)}</div>
                        {item.subCode && (
                          <div
                            style={{
                              margin: '8px 0',
                              background: '#04060b',
                              border: '1px solid var(--border-color)',
                              borderRadius: '6px',
                              overflow: 'hidden'
                            }}
                          >
                            <pre
                              style={{
                                margin: 0,
                                padding: '10px 14px',
                                overflowX: 'auto',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.84rem',
                                color: themeColor,
                                lineHeight: 1.4
                              }}
                            >
                              <code>{item.subCode.code}</code>
                            </pre>
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                );
              }

              return (
                <p key={idx} style={{ marginBottom: '12px', lineHeight: 1.7 }}>
                  {renderInline(b.text)}
                </p>
              );
            });
          })()}
        </div>

        {/* Footer Controls: Quiz CTA + Previous / Next Buttons */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '18px'
          }}
        >
          {/* Interactive Lesson Check (nextsem.online style) */}
          {(() => {
            const quizQuestions = lesson.quiz?.questions || (Array.isArray(lesson.quiz) ? lesson.quiz : []);
            if (!quizQuestions || quizQuestions.length === 0) return null;
            const firstQ = quizQuestions[0];
            const correctOpt = firstQ.correctIndex !== undefined ? firstQ.correctIndex : (firstQ.correct !== undefined ? firstQ.correct : 0);

            return (
              <div
                style={{
                  border: '1px solid rgba(51, 65, 85, 0.7)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  background: 'rgba(9, 16, 31, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#ffffff' }}>
                      Interactive Lesson Check
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>
                      Test your understanding to unlock progress & XP
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => setShowInlineHint(!showInlineHint)}
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(51, 65, 85, 0.7)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Lightbulb size={12} color="#f59e0b" /> Hint
                    </button>

                    <button
                      onClick={onOpenQuiz}
                      style={{
                        padding: '4px 12px',
                        background: 'rgba(4, 170, 109, 0.15)',
                        border: '1px solid rgba(4, 170, 109, 0.4)',
                        borderRadius: '6px',
                        color: '#04AA6D',
                        fontSize: '0.74rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Award size={13} /> Full Quiz ({quizQuestions.length} Qs)
                    </button>
                  </div>
                </div>

                {/* Hint box if toggled */}
                {showInlineHint && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderLeft: '3px solid #f59e0b', padding: '8px 12px', borderRadius: '0 6px 6px 0', fontSize: '0.76rem', color: '#fde68a' }}>
                    💡 {firstQ.explanation || 'Review the command syntax and flags shown in the screenshot above.'}
                  </div>
                )}

                {/* Question */}
                <div style={{ color: '#04AA6D', fontSize: '0.86rem', fontWeight: 700, marginTop: '4px' }}>
                  Q1: {firstQ.question}
                </div>

                {/* 2-Column Answer Options Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {firstQ.options.map((opt, optIdx) => {
                    const isSelected = inlineSelectedAnswer === optIdx;
                    const isCorrect = optIdx === correctOpt;
                    const showResult = inlineSelectedAnswer !== null;

                    let borderStyle = '1px solid rgba(51, 65, 85, 0.7)';
                    let bgStyle = 'rgba(15, 23, 42, 0.4)';
                    let textColor = '#cbd5e1';

                    if (showResult) {
                      if (isCorrect) {
                        borderStyle = '1px solid #04AA6D';
                        bgStyle = 'rgba(4, 170, 109, 0.18)';
                        textColor = '#04AA6D';
                      } else if (isSelected) {
                        borderStyle = '1px solid #ef4444';
                        bgStyle = 'rgba(239, 68, 68, 0.18)';
                        textColor = '#ef4444';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => {
                          if (inlineSelectedAnswer === null) {
                            setInlineSelectedAnswer(optIdx);
                            if (optIdx === correctOpt) {
                              playSuccessBeep();
                              onMarkComplete(lesson.id);
                            } else {
                              playKeyClickSound();
                            }
                          }
                        }}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: borderStyle,
                          background: bgStyle,
                          color: textColor,
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          textAlign: 'left',
                          cursor: inlineSelectedAnswer === null ? 'pointer' : 'default',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{opt}</span>
                        {showResult && isCorrect && <Check size={14} color="#04AA6D" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Previous / Next Lesson Footer Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <button
              onClick={onNavigatePrev}
              disabled={!hasPrevLesson}
              className="btn-secondary"
              style={{
                opacity: hasPrevLesson ? 1 : 0.4,
                cursor: hasPrevLesson ? 'pointer' : 'not-allowed',
                padding: '8px 16px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ChevronLeft size={16} /> Prev Lesson
            </button>

            <button
              onClick={onNavigateNext}
              disabled={!hasNextLesson}
              className="btn-primary"
              style={{
                opacity: hasNextLesson ? 1 : 0.4,
                cursor: hasNextLesson ? 'pointer' : 'not-allowed',
                padding: '8px 18px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Next Lesson <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
