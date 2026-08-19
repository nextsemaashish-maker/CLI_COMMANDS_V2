import React from 'react';
import { Layers, Terminal, Cpu, FileText, Award, Box, Zap } from 'lucide-react';
import { playKeyClickSound } from '../utils/audioSynth';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  soundEnabled
}) {
  const tabs = [
    { id: 'lessons', label: 'Lessons', icon: Layers, color: '#10b981' },
    { id: 'terminal', label: 'Terminal', icon: Terminal, color: '#06b6d4' },
    { id: 'labs', label: 'Labs', icon: Cpu, color: '#a855f7' },
    { id: 'visuals', label: 'Sandboxes', icon: Box, color: '#ec4899' },
    { id: 'speed', label: 'Speed', icon: Zap, color: '#f59e0b' },
    { id: 'profile', label: 'Profile', icon: Award, color: '#00ff88' }
  ];

  const handleTabClick = (tabId) => {
    if (soundEnabled) playKeyClickSound();
    setActiveTab(tabId);
  };

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        background: 'rgba(5, 8, 14, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-color)',
        padding: '6px 8px calc(6px + env(safe-area-inset-bottom, 0px)) 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.7)'
      }}
    >
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '5px 2px',
              background: isActive ? 'rgba(16, 185, 129, 0.14)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: isActive ? 'var(--accent-neon)' : '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              position: 'relative'
            }}
          >
            {/* Active Top Glow Pill */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  width: '16px',
                  height: '2px',
                  background: 'var(--accent-neon)',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px var(--accent-neon)'
                }}
              />
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.15s ease'
              }}
            >
              <IconComponent
                size={18}
                color={isActive ? 'var(--accent-neon)' : tab.color}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
            </div>

            <span
              style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '-0.2px',
                color: isActive ? '#ffffff' : '#94a3b8'
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
