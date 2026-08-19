import React, { useState } from 'react';
import {
  GitBranch, GitCommit, GitMerge, GitPullRequest, RotateCcw, Box,
  Play, Pause, Square, Trash2, Terminal as TermIcon, Layers, RefreshCw,
  Plus, Check, Sparkles, Activity, ShieldCheck, Eye
} from 'lucide-react';
import { playKeyClickSound, playSuccessBeep, playErrorSound } from '../utils/audioSynth';

export default function VisualPlaygroundView({ soundEnabled, onTryInTerminal }) {
  const [activeSandbox, setActiveSandbox] = useState('git'); // 'git' | 'docker'

  // ==========================================
  // 1. GIT BRANCHING VISUALIZER STATE
  // ==========================================
  const [gitHistory, setGitHistory] = useState([
    { id: 'c1', hash: '8f92a1', message: 'Initial commit (project setup)', branch: 'main', parent: null, x: 50, y: 120 },
    { id: 'c2', hash: '4b11c9', message: 'Add core CLI routing engine', branch: 'main', parent: 'c1', x: 170, y: 120 },
    { id: 'c3', hash: 'e309f4', message: 'Add responsive navigation layout', branch: 'main', parent: 'c2', x: 290, y: 120 },
    { id: 'c4', hash: '7c82d0', message: 'feat(auth): implement JWT token handler', branch: 'feature/auth', parent: 'c2', x: 290, y: 220 },
    { id: 'c5', hash: '1a54ef', message: 'feat(auth): add password hash bcrypt', branch: 'feature/auth', parent: 'c4', x: 410, y: 220 }
  ]);

  const [gitBranches, setGitBranches] = useState(['main', 'feature/auth', 'hotfix/patch']);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [headCommitId, setHeadCommitId] = useState('c3');
  const [gitTerminalLogs, setGitTerminalLogs] = useState([
    'Git Visual Sandbox initialized.',
    'HEAD is currently on branch: main (commit e309f4).'
  ]);

  const addGitLog = (msg) => {
    setGitTerminalLogs((prev) => [...prev.slice(-6), msg]);
  };

  const handleGitCommit = () => {
    if (soundEnabled) playSuccessBeep();
    const newId = `c${gitHistory.length + 1}`;
    const newHash = Math.random().toString(16).substring(2, 8);
    const parentNode = gitHistory.find((c) => c.id === headCommitId) || gitHistory[gitHistory.length - 1];

    const yPos = currentBranch === 'main' ? 120 : currentBranch === 'feature/auth' ? 220 : 40;
    const xPos = parentNode.x + 120;

    const newCommit = {
      id: newId,
      hash: newHash,
      message: `Update on ${currentBranch} (#${gitHistory.length + 1})`,
      branch: currentBranch,
      parent: parentNode.id,
      x: xPos,
      y: yPos
    };

    setGitHistory([...gitHistory, newCommit]);
    setHeadCommitId(newId);
    addGitLog(`$ git commit -m "${newCommit.message}" ➔ [${currentBranch} ${newHash}]`);
  };

  const handleGitBranch = () => {
    const branchName = prompt('Enter new branch name (e.g., feature/payment, bugfix/navbar):');
    if (!branchName) return;
    if (soundEnabled) playKeyClickSound();
    if (!gitBranches.includes(branchName)) {
      setGitBranches([...gitBranches, branchName]);
    }
    setCurrentBranch(branchName);
    addGitLog(`$ git checkout -b ${branchName} ➔ Switched to a new branch '${branchName}'`);
  };

  const handleGitCheckout = (branch) => {
    if (soundEnabled) playKeyClickSound();
    setCurrentBranch(branch);
    const latestOnBranch = [...gitHistory].reverse().find((c) => c.branch === branch);
    if (latestOnBranch) {
      setHeadCommitId(latestOnBranch.id);
    }
    addGitLog(`$ git checkout ${branch} ➔ Switched to branch '${branch}'`);
  };

  const handleGitMerge = () => {
    if (currentBranch !== 'main') {
      alert('Switch to `main` branch first to merge a feature branch into main!');
      return;
    }
    const targetBranch = 'feature/auth';
    if (soundEnabled) playSuccessBeep();
    const newId = `c${gitHistory.length + 1}`;
    const newHash = Math.random().toString(16).substring(2, 8);
    const mainHead = gitHistory.find((c) => c.id === headCommitId) || gitHistory[gitHistory.length - 1];

    const mergeCommit = {
      id: newId,
      hash: newHash,
      message: `Merge branch '${targetBranch}' into main`,
      branch: 'main',
      parent: mainHead.id,
      mergeParent: 'c5',
      x: mainHead.x + 120,
      y: 120
    };

    setGitHistory([...gitHistory, mergeCommit]);
    setHeadCommitId(newId);
    addGitLog(`$ git merge ${targetBranch} ➔ Merge made by the 'ort' strategy. [main ${newHash}]`);
  };

  const handleResetGitGraph = () => {
    if (soundEnabled) playKeyClickSound();
    setGitHistory([
      { id: 'c1', hash: '8f92a1', message: 'Initial commit (project setup)', branch: 'main', parent: null, x: 50, y: 120 },
      { id: 'c2', hash: '4b11c9', message: 'Add core CLI routing engine', branch: 'main', parent: 'c1', x: 170, y: 120 },
      { id: 'c3', hash: 'e309f4', message: 'Add responsive navigation layout', branch: 'main', parent: 'c2', x: 290, y: 120 },
      { id: 'c4', hash: '7c82d0', message: 'feat(auth): implement JWT token handler', branch: 'feature/auth', parent: 'c2', x: 290, y: 220 },
      { id: 'c5', hash: '1a54ef', message: 'feat(auth): add password hash bcrypt', branch: 'feature/auth', parent: 'c4', x: 410, y: 220 }
    ]);
    setCurrentBranch('main');
    setHeadCommitId('c3');
    addGitLog('$ git reset --hard initial-state ➔ Graph restored.');
  };

  // ==========================================
  // 2. DOCKER CONTAINER LIFECYCLE SIMULATOR
  // ==========================================
  const [containers, setContainers] = useState([
    {
      id: 'd1a8e932',
      name: 'web-nginx-proxy',
      image: 'nginx:1.25-alpine',
      status: 'running',
      port: '8080:80',
      cpu: '0.8%',
      memory: '24.5 MB',
      created: '2 hours ago',
      logs: ['[notice] 1#1: start worker processes', '[info] 127.0.0.1 - GET / HTTP/1.1 200 OK']
    },
    {
      id: 'f49b01c3',
      name: 'postgres-db-main',
      image: 'postgres:16-alpine',
      status: 'running',
      port: '5432:5432',
      cpu: '2.1%',
      memory: '78.2 MB',
      created: '5 hours ago',
      logs: ['PostgreSQL Database directory appears to contain a database; Skipping initialization', 'server started and ready for client connections']
    },
    {
      id: '88c2f10b',
      name: 'redis-cache-cluster',
      image: 'redis:7.2-alpine',
      status: 'paused',
      port: '6379:6379',
      cpu: '0.0%',
      memory: '14.1 MB',
      created: '1 day ago',
      logs: ['Running mode=standalone, port=6379.', 'Server initialized.']
    },
    {
      id: '2e7a99f1',
      name: 'node-worker-queue',
      image: 'node:20-slim',
      status: 'stopped',
      port: 'N/A',
      cpu: '0.0%',
      memory: '0 MB',
      created: '3 days ago',
      logs: ['Worker terminated with signal SIGTERM (Exit code 0)']
    }
  ]);

  const [selectedLogsContainer, setSelectedLogsContainer] = useState(null);

  const handleContainerAction = (id, action) => {
    if (soundEnabled) playKeyClickSound();
    setContainers(
      containers.map((c) => {
        if (c.id !== id) return c;
        if (action === 'start') return { ...c, status: 'running', cpu: '1.2%', memory: '35.0 MB' };
        if (action === 'pause') return { ...c, status: 'paused', cpu: '0.0%' };
        if (action === 'unpause') return { ...c, status: 'running', cpu: '1.1%' };
        if (action === 'stop') return { ...c, status: 'stopped', cpu: '0.0%', memory: '0 MB' };
        if (action === 'restart') return { ...c, status: 'running', cpu: '2.4%', memory: '38.0 MB' };
        return c;
      })
    );
  };

  const handleRemoveContainer = (id) => {
    if (soundEnabled) playKeyClickSound();
    setContainers(containers.filter((c) => c.id !== id));
  };

  const handleSpawnContainer = () => {
    const name = prompt('Enter container name (e.g. backend-api, mongodb-cluster):');
    if (!name) return;
    if (soundEnabled) playSuccessBeep();
    const newContainer = {
      id: Math.random().toString(16).substring(2, 10),
      name: name.toLowerCase().replace(/\s+/g, '-'),
      image: 'alpine:latest',
      status: 'running',
      port: '3000:3000',
      cpu: '0.5%',
      memory: '18.2 MB',
      created: 'Just now',
      logs: ['Container started in detached mode.', 'Application listening on port 3000.']
    };
    setContainers([...containers, newContainer]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', height: 'calc(100vh - 82px)', minHeight: 0, padding: '0 4px' }}>
      {/* Top Sandbox Selector */}
      <div
        className="glass-panel"
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#00ff88',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} color="#00ff88" />
            <span style={{ fontSize: '0.84rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              VISUAL SANDBOXES v2.0
            </span>
          </div>
          <span className="desktop-only-element" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Interactive real-time simulators for Git Version Control and Docker Containers
          </span>
        </div>

        {/* Sandbox Switcher Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.5)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => {
              if (soundEnabled) playKeyClickSound();
              setActiveSandbox('git');
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              border: activeSandbox === 'git' ? '1px solid #10b981' : '1px solid transparent',
              background: activeSandbox === 'git' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: activeSandbox === 'git' ? '#00ff88' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <GitBranch size={15} color={activeSandbox === 'git' ? '#00ff88' : '#64748b'} />
            Git Branching Visualizer
          </button>

          <button
            onClick={() => {
              if (soundEnabled) playKeyClickSound();
              setActiveSandbox('docker');
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              border: activeSandbox === 'docker' ? '1px solid #06b6d4' : '1px solid transparent',
              background: activeSandbox === 'docker' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: activeSandbox === 'docker' ? '#06b6d4' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Box size={15} color={activeSandbox === 'docker' ? '#06b6d4' : '#64748b'} />
            Docker Container Lifecycle
          </button>
        </div>
      </div>

      {/* ==========================================
          TAB 1: GIT BRANCHING VISUALIZER
         ========================================== */}
      {activeSandbox === 'git' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', flex: 1, minHeight: 0 }} className="responsive-grid-split">
          {/* Main SVG Graph Canvas */}
          <div
            className="glass-panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              background: 'radial-gradient(circle at 50% 50%, rgba(10, 16, 28, 0.9) 0%, #03060a 100%)'
            }}
          >
            {/* Action Bar */}
            <div
              style={{
                padding: '10px 14px',
                background: 'rgba(0, 0, 0, 0.65)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleGitCommit}
                  style={{
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#000000',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Create new commit on active branch"
                >
                  <GitCommit size={14} />
                  <span>git commit</span>
                </button>

                <button
                  onClick={handleGitBranch}
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Create and checkout a new branch"
                >
                  <Plus size={13} />
                  <span>git branch</span>
                </button>

                <button
                  onClick={handleGitMerge}
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    borderRadius: '6px',
                    color: '#c084fc',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Merge feature/auth into main"
                >
                  <GitMerge size={13} />
                  <span>git merge</span>
                </button>
              </div>

              <button
                onClick={handleResetGitGraph}
                style={{
                  padding: '5px 8px',
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Reset to default tree"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            {/* Interactive SVG Tree Area */}
            <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', padding: '20px', minHeight: '300px' }}>
              <svg width={Math.max(650, gitHistory.length * 130 + 100)} height="320" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="mainBranchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#00ff88" />
                  </linearGradient>
                  <linearGradient id="featureBranchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>

                {/* Draw Parent Connectors */}
                {gitHistory.map((c) => {
                  if (!c.parent) return null;
                  const parent = gitHistory.find((p) => p.id === c.parent);
                  if (!parent) return null;

                  return (
                    <g key={`line-${c.id}`}>
                      <path
                        d={`M ${parent.x} ${parent.y} C ${parent.x + 60} ${parent.y}, ${c.x - 60} ${c.y}, ${c.x} ${c.y}`}
                        fill="none"
                        stroke={c.branch === 'main' ? '#10b981' : '#a855f7'}
                        strokeWidth="3"
                        strokeDasharray={c.mergeParent ? '4,4' : 'none'}
                        opacity="0.8"
                      />
                    </g>
                  );
                })}

                {/* Draw Merge Secondary Connectors */}
                {gitHistory.map((c) => {
                  if (!c.mergeParent) return null;
                  const mParent = gitHistory.find((p) => p.id === c.mergeParent);
                  if (!mParent) return null;

                  return (
                    <path
                      key={`merge-line-${c.id}`}
                      d={`M ${mParent.x} ${mParent.y} C ${mParent.x + 60} ${mParent.y}, ${c.x - 60} ${c.y}, ${c.x} ${c.y}`}
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="3"
                      strokeDasharray="4,4"
                      opacity="0.9"
                    />
                  );
                })}

                {/* Draw Commit Nodes */}
                {gitHistory.map((c) => {
                  const isHead = c.id === headCommitId;
                  const nodeColor = c.branch === 'main' ? '#00ff88' : '#ec4899';

                  return (
                    <g
                      key={c.id}
                      onClick={() => {
                        if (soundEnabled) playKeyClickSound();
                        setHeadCommitId(c.id);
                        addGitLog(`$ git checkout ${c.hash} ➔ HEAD detached at ${c.hash}`);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Pulse circle for HEAD */}
                      {isHead && (
                        <circle cx={c.x} cy={c.y} r="22" fill="none" stroke="#00ff88" strokeWidth="2" strokeDasharray="3,3" opacity="0.8" />
                      )}

                      {/* Main Node */}
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={isHead ? 15 : 12}
                        fill="#05080e"
                        stroke={nodeColor}
                        strokeWidth={isHead ? 4 : 3}
                      />

                      {/* Hash Text */}
                      <text
                        x={c.x}
                        y={c.y + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontFamily="var(--font-mono)"
                        fontWeight="bold"
                      >
                        {c.hash.substring(0, 3)}
                      </text>

                      {/* Commit Label Above */}
                      <text
                        x={c.x}
                        y={c.y - 20}
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize="10"
                        fontFamily="var(--font-mono)"
                        fontWeight="600"
                      >
                        {c.hash}
                      </text>

                      {/* Branch Badge if Tip */}
                      {isHead && (
                        <g>
                          <rect
                            x={c.x - 24}
                            y={c.y + 22}
                            width="48"
                            height="16"
                            rx="4"
                            fill="rgba(16, 185, 129, 0.2)"
                            stroke="#10b981"
                            strokeWidth="1"
                          />
                          <text
                            x={c.x}
                            y={c.y + 33}
                            textAnchor="middle"
                            fill="#00ff88"
                            fontSize="8"
                            fontFamily="var(--font-mono)"
                            fontWeight="bold"
                          >
                            HEAD
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Mini Terminal Log */}
            <div
              style={{
                background: '#04070e',
                borderTop: '1px solid var(--border-color)',
                padding: '8px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem'
              }}
            >
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.68rem' }}>
                $ git log --oneline (live simulator output):
              </div>
              {gitTerminalLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.startsWith('$') ? '#00ff88' : '#94a3b8' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Right Git Inspector Panel */}
          <div
            className="glass-panel"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              borderRadius: '12px',
              overflowY: 'auto'
            }}
          >
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GitBranch size={16} color="#00ff88" /> Active Branch Manager
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Available Branches:
              </span>
              {gitBranches.map((branch) => {
                const isActive = branch === currentBranch;
                return (
                  <button
                    key={branch}
                    onClick={() => handleGitCheckout(branch)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: isActive ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      color: isActive ? '#00ff88' : '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{branch}</span>
                    {isActive && <span style={{ fontSize: '0.68rem', color: '#00ff88' }}>● HEAD</span>}
                  </button>
                );
              })}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Selected Commit Details:
              </span>
              {(() => {
                const commit = gitHistory.find((c) => c.id === headCommitId);
                if (!commit) return null;
                return (
                  <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px', borderRadius: '8px', marginTop: '6px', fontSize: '0.76rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div><strong style={{ color: '#00ff88' }}>Hash:</strong> <code style={{ fontFamily: 'var(--font-mono)' }}>{commit.hash}</code></div>
                    <div><strong style={{ color: 'var(--text-secondary)' }}>Branch:</strong> <code style={{ color: 'var(--accent-cyan)' }}>{commit.branch}</code></div>
                    <div><strong style={{ color: 'var(--text-secondary)' }}>Message:</strong> {commit.message}</div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: DOCKER CONTAINER LIFECYCLE
         ========================================== */}
      {activeSandbox === 'docker' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, minHeight: 0 }}>
          {/* Controls Bar */}
          <div
            className="glass-panel"
            style={{
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleSpawnContainer}
                style={{
                  padding: '6px 12px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={14} />
                <span>docker run -d (New Container)</span>
              </button>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Active Containers: <strong style={{ color: '#00ff88' }}>{containers.filter((c) => c.status === 'running').length}</strong> / {containers.length}
            </div>
          </div>

          {/* Container Grid Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '14px',
              overflowY: 'auto',
              flex: 1
            }}
          >
            {containers.map((container) => {
              const isRunning = container.status === 'running';
              const isPaused = container.status === 'paused';

              return (
                <div
                  key={container.id}
                  className="glass-panel"
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: isRunning ? '1px solid rgba(0, 255, 136, 0.4)' : isPaused ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isRunning ? 'rgba(10, 22, 20, 0.7)' : 'rgba(10, 15, 25, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  {/* Card Header */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                        {container.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          background: isRunning ? 'rgba(0, 255, 136, 0.15)' : isPaused ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isRunning ? '#00ff88' : isPaused ? '#f59e0b' : '#ef4444',
                          border: isRunning ? '1px solid rgba(0, 255, 136, 0.4)' : isPaused ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)'
                        }}
                      >
                        ● {container.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div>Image: <code style={{ color: 'var(--accent-cyan)' }}>{container.image}</code></div>
                      <div>Port: <code style={{ color: '#f59e0b' }}>{container.port}</code></div>
                      <div>ID: <code style={{ color: 'var(--text-muted)' }}>{container.id}</code></div>
                    </div>
                  </div>

                  {/* Resource Gauges */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <span>CPU: <strong style={{ color: '#00ff88' }}>{container.cpu}</strong></span>
                    <span>RAM: <strong style={{ color: 'var(--accent-cyan)' }}>{container.memory}</strong></span>
                  </div>

                  {/* Action Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {!isRunning && (
                        <button
                          onClick={() => handleContainerAction(container.id, 'start')}
                          style={{ padding: '5px 8px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: '4px', color: '#00ff88', cursor: 'pointer' }}
                          title="Start Container"
                        >
                          <Play size={12} />
                        </button>
                      )}
                      {isRunning && (
                        <button
                          onClick={() => handleContainerAction(container.id, 'pause')}
                          style={{ padding: '5px 8px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', borderRadius: '4px', color: '#f59e0b', cursor: 'pointer' }}
                          title="Pause Container"
                        >
                          <Pause size={12} />
                        </button>
                      )}
                      {isRunning && (
                        <button
                          onClick={() => handleContainerAction(container.id, 'stop')}
                          style={{ padding: '5px 8px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '4px', color: '#ef4444', cursor: 'pointer' }}
                          title="Stop Container"
                        >
                          <Square size={12} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => setSelectedLogsContainer(container)}
                        style={{ padding: '5px 8px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#cbd5e1', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                      >
                        <Eye size={12} /> Logs
                      </button>

                      <button
                        onClick={() => handleRemoveContainer(container.id)}
                        style={{ padding: '5px 8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '4px', color: '#ef4444', cursor: 'pointer' }}
                        title="Remove container (docker rm)"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Logs Modal / Drawer */}
          {selectedLogsContainer && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 2600,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
              }}
              onClick={() => setSelectedLogsContainer(null)}
            >
              <div
                className="glass-panel"
                style={{
                  width: '100%',
                  maxWidth: '650px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: '#04070e',
                  overflow: 'hidden'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ padding: '10px 14px', background: '#0a0f1d', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#00ff88', fontWeight: 700 }}>
                    $ docker logs -f {selectedLogsContainer.name}
                  </span>
                  <button
                    onClick={() => setSelectedLogsContainer(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: '#cbd5e1', maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedLogsContainer.logs.map((log, idx) => (
                    <div key={idx} style={{ color: '#00ff88' }}>{`> ${log}`}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
