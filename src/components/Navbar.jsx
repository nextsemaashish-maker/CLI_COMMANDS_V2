import React, { useState } from 'react';
import {
  Terminal, Search, Award, Monitor, Layers, FileText, Cpu,
  Volume2, VolumeX, Sparkles, Flame, Zap, Box, Palette, Music
} from 'lucide-react';
import NSLogo from './NSLogo';
import { playKeyClickSound } from '../utils/audioSynth';

const THEMES = [
  { id: 'theme-cyberpunk', name: 'Cyberpunk', icon: '🟢', color: '#10b981' },
  { id: 'theme-synthwave', name: 'Synthwave', icon: '🟣', color: '#ec4899' },
  { id: 'theme-matrix', name: 'Matrix', icon: '🟩', color: '#00ff66' },
  { id: 'theme-nord', name: 'Nordic', icon: '🔵', color: '#38bdf8' }
];

export default function Navbar({
  activeTab,
  setActiveTab,
  userStats,
  onOpenSearch,
  onOpenAiHelper,
  scanlinesEnabled,
  setScanlinesEnabled,
  bgMatrixEnabled,
  setBgMatrixEnabled,
  soundEnabled,
  setSoundEnabled,
  activeTheme,
  setActiveTheme,
  soundPack,
  setSoundPack,
  onOpenVisuals
}) {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  let levelTitle = 'CLI Novice';
  let nextRankXP = 400;
  let prevRankXP = 0;

  if (userStats.xp >= 2000) {
    levelTitle = 'CLI Mastermind';
    prevRankXP = 2000;
    nextRankXP = 3000;
  } else if (userStats.xp >= 1000) {
    levelTitle = 'Shell Specialist';
    prevRankXP = 1000;
    nextRankXP = 2000;
  } else if (userStats.xp >= 400) {
    levelTitle = 'Terminal Warrior';
    prevRankXP = 400;
    nextRankXP = 1000;
  }

  const xpInCurrentRank = userStats.xp - prevRankXP;
  const rankRange = nextRankXP - prevRankXP;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentRank / rankRange) * 100)));

  const handleTabSelect = (tabId) => {
    if (soundEnabled) playKeyClickSound();
    setActiveTab(tabId);
  };

  const cycleTheme = () => {
    if (soundEnabled) playKeyClickSound();
    const currentIndex = THEMES.findIndex((t) => t.id === activeTheme);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
    setActiveTheme(nextTheme.id);
  };

  return (
    <header
      className="main-navbar-header"
      style={{
        width: '100%',
        maxWidth: '100vw',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        zIndex: 100,
        background: 'rgba(5, 8, 14, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0
      }}
    >
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          onClick={() => handleTabSelect('lessons')}
        >
          <NSLogo size={28} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '0.96rem',
                fontWeight: 800,
                letterSpacing: '-0.2px',
                fontFamily: 'var(--font-display)',
                color: '#ffffff',
                whiteSpace: 'nowrap'
              }}
            >
              NEXTSEM
            </span>
            <span
              style={{
                fontSize: '0.58rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: 'var(--accent-green)',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid var(--border-color)',
                padding: '1px 5px',
                borderRadius: '4px',
                whiteSpace: 'nowrap'
              }}
            >
              v2.0 PRO
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Main Navigation Tabs */}
      <nav
        className="desktop-nav-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(0, 0, 0, 0.65)',
          padding: '3px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)'
        }}
      >
        {[
          { id: 'lessons', label: 'Lessons', icon: Layers, color: '#10b981' },
          { id: 'terminal', label: 'Terminal', icon: Terminal, color: '#06b6d4' },
          { id: 'labs', label: 'Practice Labs', icon: Cpu, color: '#a855f7' },
          { id: 'visuals', label: 'Sandboxes', icon: Box, color: '#ec4899' },
          { id: 'speed', label: 'Speed Arena', icon: Zap, color: '#f59e0b' },
          { id: 'cheatsheet', label: 'Cheat Sheet', icon: FileText, color: '#f97316' },
          { id: 'profile', label: 'Profile', icon: Award, color: '#f59e0b' }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSelect(tab.id)}
              title={tab.label}
              style={{
                padding: '6px 10px',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-mono)',
                borderRadius: '7px',
                border: isActive ? '1px solid var(--accent-green)' : '1px solid transparent',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(0, 255, 136, 0.12) 100%)'
                  : 'transparent',
                color: isActive ? 'var(--accent-neon)' : '#cbd5e1',
                boxShadow: isActive ? '0 0 12px var(--accent-green-glow)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <IconComponent size={14} color={isActive ? 'var(--accent-neon)' : tab.color} />
              <span className="desktop-nav-labels">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Tools & Rank Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {/* AI Assistant Trigger Button */}
        <button
          onClick={onOpenAiHelper}
          title="Open AI Command Generator"
          style={{
            padding: '6px 10px',
            fontSize: '0.78rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1px solid rgba(0, 255, 136, 0.5)',
            borderRadius: '8px',
            color: '#00ff88',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0, 255, 136, 0.15)'
          }}
        >
          <Sparkles size={14} color="#00ff88" />
          <span>AI Helper</span>
        </button>

        {/* Quick Search Button */}
        <button
          onClick={onOpenSearch}
          title="Search Commands (Ctrl + K)"
          style={{
            padding: '6px 9px',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: '#cbd5e1',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Search size={14} color="var(--accent-green)" />
          <span className="desktop-only-element" style={{ fontFamily: 'var(--font-mono)' }}>Search</span>
          <kbd
            className="desktop-only-element"
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '1px 5px',
              borderRadius: '3px',
              fontSize: '0.62rem',
              color: 'var(--accent-green)',
              fontFamily: 'var(--font-mono)',
              border: '1px solid var(--border-color)'
            }}
          >
            Ctrl K
          </kbd>
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={cycleTheme}
          className="btn-ghost desktop-only-element"
          style={{
            padding: '6px 8px',
            fontSize: '0.74rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px'
          }}
          title="Switch Color Theme (Cyberpunk / Synthwave / Matrix / Nord)"
        >
          <Palette size={14} color="var(--accent-green)" />
          <span>{THEMES.find((t) => t.id === activeTheme)?.name || 'Theme'}</span>
        </button>

        {/* Sound Toggle (Desktop) */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="btn-ghost desktop-only-element"
          style={{ padding: '6px 7px', color: soundEnabled ? 'var(--accent-green)' : 'var(--text-muted)' }}
          title={soundEnabled ? 'Audio Sound: ON' : 'Audio Sound: OFF'}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Matrix Rain Toggle (Desktop) */}
        <button
          onClick={() => setBgMatrixEnabled(!bgMatrixEnabled)}
          className="btn-ghost desktop-only-element"
          style={{ padding: '6px 7px', color: bgMatrixEnabled ? '#06b6d4' : 'var(--text-muted)' }}
          title="Toggle Ambient Cyber Rain"
        >
          <Sparkles size={15} />
        </button>

        {/* Streak Chip */}
        <div
          title={`Active Streak: ${userStats.streak || 1} day`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 7px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '8px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            color: '#f59e0b',
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }}
        >
          <Flame size={13} color="#f59e0b" fill="#f59e0b" />
          <span>{userStats.streak || 1}d</span>
        </div>

        {/* User Rank & XP Progress Pill */}
        <div
          onClick={() => handleTabSelect('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            fontSize: '0.76rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
          title={`Rank: ${levelTitle} (${userStats.xp} XP - ${progressPercent}% to next level)`}
        >
          <Award size={15} color="#f59e0b" />
          <div style={{ minWidth: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', gap: '4px' }}>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.72rem' }}>{userStats.xp} XP</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981, #00ff88)',
                  borderRadius: '2px',
                  transition: 'width 0.3s'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
