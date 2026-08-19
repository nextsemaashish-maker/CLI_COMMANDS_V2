import React from 'react';
import {
  Award, Zap, RotateCcw, Terminal, Cpu, GitBranch, Box, Trophy,
  Flame, GitPullRequest, CheckCircle2, ShieldCheck, Download, Sparkles
} from 'lucide-react';
import { BADGES_DATA } from '../data/badgesData';
import { LESSONS_DATA } from '../data/lessonsData';
import { playKeyClickSound, playSuccessBeep } from '../utils/audioSynth';

const iconMap = {
  Terminal,
  Cpu,
  GitBranch,
  Box,
  Zap,
  Award,
  Flame,
  GitPullRequest,
  CheckCircle2
};

export default function ProfileProgress({
  userStats,
  completedLessons,
  onResetProgress,
  onOpenCertificate,
  soundEnabled
}) {
  const totalLessonsCount = LESSONS_DATA.reduce((acc, curr) => acc + curr.lessons.length, 0);
  const completedCount = completedLessons.length;
  const overallPercentage = Math.round((completedCount / totalLessonsCount) * 100);

  const levelTitle =
    userStats.xp >= 2000
      ? 'NextSem Mastermind (Level 4)'
      : userStats.xp >= 1000
      ? 'Shell Specialist (Level 3)'
      : userStats.xp >= 400
      ? 'Terminal Warrior (Level 2)'
      : 'CLI Novice (Level 1)';

  const nextLevelXP = userStats.xp >= 2000 ? 3000 : userStats.xp >= 1000 ? 2000 : userStats.xp >= 400 ? 1000 : 400;
  const levelXPProgress = Math.min(100, Math.round((userStats.xp / nextLevelXP) * 100));

  const handleReset = () => {
    playKeyClickSound();
    onResetProgress();
  };

  const handleCertificateClick = () => {
    if (soundEnabled) playSuccessBeep();
    if (onOpenCertificate) onOpenCertificate();
  };

  return (
    <div
      className="glass-panel"
      style={{
        flex: 1,
        minWidth: 0,
        height: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* Profile Header Banner */}
      <div
        style={{
          background: 'var(--bg-dark-obsidian)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.14)',
              border: '2px solid var(--accent-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Trophy size={28} color="var(--accent-green)" />
          </div>
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.45rem)',
                fontWeight: 800,
                margin: 0,
                fontFamily: 'var(--font-display)',
                color: '#ffffff'
              }}
            >
              {levelTitle}
            </h2>
            <div style={{ color: 'var(--text-secondary)', marginTop: '2px', fontSize: '0.85rem' }}>
              Mastering Command Line Interfaces step-by-step.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#f59e0b',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
              >
                <Zap size={13} fill="#f59e0b" /> {userStats.streak || 1} Day Streak
              </div>
              <div style={{ color: 'var(--text-muted)' }}>•</div>
              <div
                style={{
                  color: 'var(--accent-green)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
              >
                {userStats.xp} Total XP
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress Meter */}
        <div style={{ width: '100%', maxWidth: '240px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              marginBottom: '5px'
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Rank Progress</span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>
              {userStats.xp} / {nextLevelXP} XP
            </span>
          </div>
          <div
            style={{
              height: '7px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${levelXPProgress}%`,
                background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Official Certificate Claim Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
          border: '1px solid rgba(0, 255, 136, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(0, 255, 136, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#00ff88',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}
          >
            <Award size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
              Official Certificate of Mastery
            </h3>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Generate, download high-res PNG, or print your verified student credential.
            </p>
          </div>
        </div>

        <button
          onClick={handleCertificateClick}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: 'none',
            borderRadius: '8px',
            color: '#000000',
            fontWeight: 800,
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)'
          }}
        >
          <Sparkles size={14} /> View & Download Certificate
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px'
        }}
      >
        <div
          style={{
            background: 'var(--bg-dark-obsidian)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-green)'
            }}
          >
            {completedCount} / {totalLessonsCount}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
            Lessons Done ({overallPercentage}%)
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-dark-obsidian)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: '#06b6d4'
            }}
          >
            {userStats.xp}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
            Earned XP Points
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-dark-obsidian)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: '#f59e0b'
            }}
          >
            {BADGES_DATA.filter((b) => userStats.xp >= (b.xpRequired || 0) || completedCount >= (b.requiredLessonsCount || 999)).length} / {BADGES_DATA.length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
            Badges Unlocked
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-display)'
          }}
        >
          <Award color="var(--accent-green)" size={18} /> Unlocked Achievements
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '12px'
          }}
        >
          {BADGES_DATA.map((badge) => {
            const isUnlocked =
              userStats.xp >= (badge.xpRequired || 0) ||
              completedCount >= (badge.requiredLessonsCount || 999);
            const IconComp = iconMap[badge.icon] || Award;

            return (
              <div
                key={badge.id}
                style={{
                  background: isUnlocked ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-dark-obsidian)',
                  border: isUnlocked ? '1px solid var(--accent-green)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: isUnlocked ? 1 : 0.45
                }}
              >
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '50%',
                    background: isUnlocked ? 'var(--accent-green)' : 'rgba(255,255,255,0.05)',
                    color: isUnlocked ? '#000000' : 'var(--text-muted)',
                    display: 'flex',
                    flexShrink: 0
                  }}
                >
                  <IconComp size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isUnlocked ? '#ffffff' : 'var(--text-muted)' }}>
                    {badge.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {badge.description}
                  </div>
                  {isUnlocked && (
                    <div
                      style={{
                        fontSize: '0.64rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-green)',
                        marginTop: '3px',
                        fontWeight: 700
                      }}
                    >
                      UNLOCKED ✓
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Progress Action */}
      <div
        style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '14px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <button
          onClick={handleReset}
          className="btn-ghost"
          style={{ color: '#ef4444', fontSize: '0.78rem' }}
        >
          <RotateCcw size={13} /> Reset Learning Progress
        </button>
      </div>
    </div>
  );
}
