import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LessonView from './components/LessonView';
import Terminal from './components/Terminal';
import PracticeLabsView from './components/PracticeLabsView';
import VisualPlaygroundView from './components/VisualPlaygroundView';
import SpeedTypingArenaView from './components/SpeedTypingArenaView';
import CheatSheetView from './components/CheatSheetView';
import ProfileProgress from './components/ProfileProgress';
import QuizModal from './components/QuizModal';
import CommandSearchModal from './components/CommandSearchModal';
import AiCommandHelperModal from './components/AiCommandHelperModal';
import CertificateModal from './components/CertificateModal';
import CyberBackground from './components/CyberBackground';
import ErrorBoundary from './components/ErrorBoundary';
import VisualDiagramModal from './components/VisualDiagramModal';
import MobileBottomNav from './components/MobileBottomNav';

import { LESSONS_DATA } from './data/lessonsData';
import { playSuccessBeep, setGlobalSoundPack } from './utils/audioSynth';
import { Sparkles, Terminal as TermIcon } from 'lucide-react';

export default function App() {
  // Tabs: 'lessons' | 'terminal' | 'labs' | 'visuals' | 'speed' | 'cheatsheet' | 'profile'
  const [activeTab, setActiveTab] = useState('lessons');

  // Multi-Theme & Soundpack state
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('cli_active_theme') || 'theme-cyberpunk';
  });

  const [soundPack, setSoundPack] = useState(() => {
    return localStorage.getItem('cli_sound_pack') || 'cyber';
  });

  // Flattened array of all lessons across all modules for seamless Prev/Next navigation
  const allLessons = LESSONS_DATA.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));

  // Selected module & lesson
  const [selectedModuleId, setSelectedModuleId] = useState(LESSONS_DATA[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState(LESSONS_DATA[0].lessons[0].id);

  // User Stats & LocalStorage Persistence with Safe try/catch Parsing
  const [userStats, setUserStats] = useState(() => {
    try {
      const saved = localStorage.getItem('cli_user_stats');
      return saved ? JSON.parse(saved) : { xp: 0, streak: 1, unlockedBadges: ['first-step'] };
    } catch (e) {
      console.error('Failed to parse cli_user_stats:', e);
      return { xp: 0, streak: 1, unlockedBadges: ['first-step'] };
    }
  });

  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('cli_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [completedLabs, setCompletedLabs] = useState(() => {
    try {
      const saved = localStorage.getItem('cli_completed_labs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('cli_bookmarks');
      return saved ? JSON.parse(saved) : ['ls', 'git-commit', 'docker-run'];
    } catch (e) {
      return ['ls', 'git-commit', 'docker-run'];
    }
  });

  // UI Toggles & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiHelperOpen, setIsAiHelperOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Desktop pinned sidebar
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false); // Mobile slide-out drawer
  const [isVisualsOpen, setIsVisualsOpen] = useState(false);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(false);
  const [bgMatrixEnabled, setBgMatrixEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Preset & Active Lab state
  const [activeTerminalPreset, setActiveTerminalPreset] = useState('');
  const [activeLabContext, setActiveLabContext] = useState({ id: null, reward: 0 });

  // Terminal Drawer State
  const [isTerminalDrawerOpen, setIsTerminalDrawerOpen] = useState(false);

  // Sync to LocalStorage & Soundpack
  useEffect(() => {
    localStorage.setItem('cli_active_theme', activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem('cli_sound_pack', soundPack);
    setGlobalSoundPack(soundPack);
  }, [soundPack]);

  useEffect(() => {
    localStorage.setItem('cli_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('cli_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('cli_completed_labs', JSON.stringify(completedLabs));
  }, [completedLabs]);

  useEffect(() => {
    localStorage.setItem('cli_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Keyboard shortcuts (Ctrl + K for search, Ctrl + ~ for terminal drawer, Ctrl + B for sidebar, Ctrl + I for AI)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsAiHelperOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsTerminalDrawerOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentModule = LESSONS_DATA.find((m) => m.id === selectedModuleId) || LESSONS_DATA[0];
  const currentLesson = currentModule.lessons.find((l) => l.id === selectedLessonId) || currentModule.lessons[0];

  const activeModuleColor = currentModule.color || '#10b981';

  // Navigation handlers
  const currentLessonIndex = allLessons.findIndex((l) => l.id === selectedLessonId);
  const hasPrevLesson = currentLessonIndex > 0;
  const hasNextLesson = currentLessonIndex < allLessons.length - 1;

  const handleNavigatePrev = () => {
    if (hasPrevLesson) {
      const prev = allLessons[currentLessonIndex - 1];
      setSelectedModuleId(prev.moduleId);
      setSelectedLessonId(prev.id);
    }
  };

  const handleNavigateNext = () => {
    if (hasNextLesson) {
      const next = allLessons[currentLessonIndex + 1];
      setSelectedModuleId(next.moduleId);
      setSelectedLessonId(next.id);
    }
  };

  const handleMarkComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
      setUserStats((prev) => ({ ...prev, xp: prev.xp + 100 }));
    }
  };

  const handleQuizSuccess = (xpReward) => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }
    setUserStats((prev) => ({ ...prev, xp: prev.xp + xpReward }));
  };

  const handleStartLabInTerminal = (presetCmd, labId, xpReward) => {
    setActiveTerminalPreset(presetCmd);
    setActiveLabContext({ id: labId, reward: xpReward });
    setIsTerminalDrawerOpen(true);
  };

  const handleSolveLab = (labId, xpReward) => {
    if (!completedLabs.includes(labId)) {
      setCompletedLabs([...completedLabs, labId]);
      setUserStats((prev) => ({ ...prev, xp: prev.xp + xpReward }));
    }
    setActiveLabContext({ id: null, reward: 0 });
  };

  const handleToggleBookmark = (cmdId) => {
    if (bookmarks.includes(cmdId)) {
      setBookmarks(bookmarks.filter((id) => id !== cmdId));
    } else {
      setBookmarks([...bookmarks, cmdId]);
    }
  };

  const handleTryInTerminal = (cmdStr) => {
    setActiveTerminalPreset(cmdStr);
    setIsTerminalDrawerOpen(true);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset your learning progress and XP?')) {
      setCompletedLessons([]);
      setCompletedLabs([]);
      setUserStats({ xp: 0, streak: 1, unlockedBadges: [] });
      setBookmarks(['ls', 'git-commit']);
    }
  };

  return (
    <ErrorBoundary>
      <div
        className={`app-container ${activeTheme} ${scanlinesEnabled ? 'scanlines' : ''}`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, ${activeModuleColor}15 0%, transparent 60%)
          `,
          transition: 'background-image 0.4s ease'
        }}
      >
        {/* Ambient Cyber Matrix Rain Background */}
        <CyberBackground enabled={bgMatrixEnabled} />

        {/* Adaptive Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userStats={userStats}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAiHelper={() => setIsAiHelperOpen(true)}
          scanlinesEnabled={scanlinesEnabled}
          setScanlinesEnabled={setScanlinesEnabled}
          bgMatrixEnabled={bgMatrixEnabled}
          setBgMatrixEnabled={setBgMatrixEnabled}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          activeTheme={activeTheme}
          setActiveTheme={setActiveTheme}
          soundPack={soundPack}
          setSoundPack={setSoundPack}
          onOpenVisuals={() => setIsVisualsOpen(true)}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
        />

        {/* Mobile Off-Canvas Sidebar Drawer & Backdrop */}
        {isMobileDrawerOpen && (
          <>
            <div
              className="sidebar-mobile-overlay"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            <Sidebar
              selectedModuleId={selectedModuleId}
              setSelectedModuleId={setSelectedModuleId}
              selectedLessonId={selectedLessonId}
              setSelectedLessonId={setSelectedLessonId}
              completedLessons={completedLessons}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
            />
          </>
        )}

        {/* Main Content Workspace */}
        <main className="main-content">
          {activeTab === 'lessons' && (
            <div
              style={{
                display: 'flex',
                width: '100%',
                gap: '16px',
                height: 'calc(100vh - 82px)',
                minHeight: 0
              }}
            >
              {/* Desktop Pinned Sidebar */}
              {isSidebarOpen && (
                <div className="desktop-only-element" style={{ height: '100%' }}>
                  <Sidebar
                    selectedModuleId={selectedModuleId}
                    setSelectedModuleId={setSelectedModuleId}
                    selectedLessonId={selectedLessonId}
                    setSelectedLessonId={setSelectedLessonId}
                    completedLessons={completedLessons}
                    onToggleSidebar={() => setIsSidebarOpen(false)}
                    isMobileDrawer={false}
                  />
                </div>
              )}

              {/* Lesson Reader View */}
              <LessonView
                lesson={currentLesson}
                currentModule={currentModule}
                isCompleted={completedLessons.includes(currentLesson.id)}
                onMarkComplete={handleMarkComplete}
                onOpenQuiz={() => setIsQuizOpen(true)}
                onTryInTerminal={handleTryInTerminal}
                onNavigateNext={handleNavigateNext}
                onNavigatePrev={handleNavigatePrev}
                hasNextLesson={hasNextLesson}
                hasPrevLesson={hasPrevLesson}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
              />
            </div>
          )}

          {activeTab === 'terminal' && (
            <Terminal
              activeCommandPreset={activeTerminalPreset}
              onClearPreset={() => setActiveTerminalPreset('')}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              activeLabId={activeLabContext.id}
              activeLabReward={activeLabContext.reward}
              onSolveLab={handleSolveLab}
            />
          )}

          {activeTab === 'labs' && (
            <PracticeLabsView
              onStartLabInTerminal={handleStartLabInTerminal}
              completedLabs={completedLabs}
              onCompleteLab={handleSolveLab}
            />
          )}

          {activeTab === 'visuals' && (
            <VisualPlaygroundView
              soundEnabled={soundEnabled}
              onTryInTerminal={handleTryInTerminal}
            />
          )}

          {activeTab === 'speed' && (
            <SpeedTypingArenaView
              soundEnabled={soundEnabled}
              userStats={userStats}
              onClaimQuestXp={(xp) => setUserStats((prev) => ({ ...prev, xp: prev.xp + xp }))}
            />
          )}

          {activeTab === 'cheatsheet' && (
            <CheatSheetView
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onTryInTerminal={handleTryInTerminal}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileProgress
              userStats={userStats}
              completedLessons={completedLessons}
              onResetProgress={handleResetProgress}
              onOpenCertificate={() => setIsCertificateOpen(true)}
              soundEnabled={soundEnabled}
            />
          )}
        </main>

        {/* Floating Quick Action Buttons */}
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
            right: '20px',
            zIndex: 1900,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {/* AI Helper Floating Trigger */}
          <button
            onClick={() => setIsAiHelperOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              color: '#000000',
              border: 'none',
              padding: '7px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0, 255, 136, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={14} />
            <span>AI Assistant</span>
          </button>

          {/* Floating Terminal Drawer Button */}
          <button
            onClick={() => setIsTerminalDrawerOpen((prev) => !prev)}
            style={{
              background: isTerminalDrawerOpen ? '#10b981' : 'rgba(10, 15, 29, 0.92)',
              color: isTerminalDrawerOpen ? '#000000' : 'var(--accent-green)',
              border: '1px solid var(--accent-green)',
              padding: '7px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.65)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>⚡ {isTerminalDrawerOpen ? 'Close Terminal' : 'Terminal'}</span>
            <kbd
              className="desktop-only-element"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '1px 4px',
                borderRadius: '3px',
                fontSize: '0.62rem',
                color: isTerminalDrawerOpen ? '#000000' : '#ffffff'
              }}
            >
              Ctrl ~
            </kbd>
          </button>
        </div>

        {/* Slide-Up Terminal Drawer Overlay */}
        {isTerminalDrawerOpen && (
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '1200px',
              height: 'clamp(320px, 50vh, 440px)',
              zIndex: 2200,
              background: '#05080e',
              border: '1px solid var(--accent-green)',
              borderRadius: '16px 16px 0 0',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.85)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                background: '#0a0f1d',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)'
              }}
            >
              <span style={{ fontSize: '0.76rem', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                ⚡ ON-DEMAND TERMINAL DRAWER
              </span>
              <button
                onClick={() => setIsTerminalDrawerOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer'
                }}
              >
                Close [✕]
              </button>
            </div>
            <Terminal
              activeCommandPreset={activeTerminalPreset}
              onClearPreset={() => setActiveTerminalPreset('')}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              activeLabId={activeLabContext.id}
              activeLabReward={activeLabContext.reward}
              onSolveLab={handleSolveLab}
            />
          </div>
        )}

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          soundEnabled={soundEnabled}
        />

        {/* Modals */}
        {isQuizOpen && (
          <QuizModal
            quiz={currentLesson.quiz}
            xpReward={currentLesson.xp}
            onClose={() => setIsQuizOpen(false)}
            onQuizSuccess={handleQuizSuccess}
          />
        )}

        <CommandSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmark}
          onTryInTerminal={handleTryInTerminal}
        />

        <AiCommandHelperModal
          isOpen={isAiHelperOpen}
          onClose={() => setIsAiHelperOpen(false)}
          onTryInTerminal={handleTryInTerminal}
          soundEnabled={soundEnabled}
        />

        <CertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          userStats={userStats}
          completedLessonsCount={completedLessons.length}
          soundEnabled={soundEnabled}
        />

        <VisualDiagramModal
          isOpen={isVisualsOpen}
          onClose={() => setIsVisualsOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}
