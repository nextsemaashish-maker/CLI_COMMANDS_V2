import React, { useState, useEffect, useRef } from 'react';
import {
  Flame, Zap, Trophy, RotateCcw, CheckCircle2, Clock,
  Sparkles, Award, Target, Terminal as TermIcon, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TYPING_CHALLENGES, INITIAL_DAILY_QUESTS } from '../data/dailyQuestsData';
import { playKeyClickSound, playSuccessBeep, playErrorSound } from '../utils/audioSynth';

export default function SpeedTypingArenaView({ soundEnabled, userStats, onClaimQuestXp }) {
  // Game Modes: 30s | 60s | Free
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'finished'

  // Challenge Prompt
  const [challengeIndex, setChallengeIndex] = useState(0);
  const currentChallenge = TYPING_CHALLENGES[challengeIndex % TYPING_CHALLENGES.length];
  const targetText = currentChallenge.cmd;

  // User input & metrics
  const [inputVal, setInputVal] = useState('');
  const [charErrors, setCharErrors] = useState(0);
  const [completedCmdsCount, setCompletedCmdsCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // Daily Quests Local State
  const [quests, setQuests] = useState(() => {
    try {
      const saved = localStorage.getItem('cli_daily_quests_v2');
      return saved ? JSON.parse(saved) : INITIAL_DAILY_QUESTS;
    } catch (e) {
      return INITIAL_DAILY_QUESTS;
    }
  });

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Save quests to storage
  useEffect(() => {
    localStorage.setItem('cli_daily_quests_v2', JSON.stringify(quests));
  }, [quests]);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && selectedDuration > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, selectedDuration]);

  const startGame = () => {
    if (soundEnabled) playSuccessBeep();
    setGameState('playing');
    setTimeLeft(selectedDuration);
    setInputVal('');
    setCharErrors(0);
    setCompletedCmdsCount(0);
    setWpm(0);
    setAccuracy(100);
    if (inputRef.current) inputRef.current.focus();
  };

  const finishGame = () => {
    setGameState('finished');
    if (soundEnabled) playSuccessBeep();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Check quest
    if (wpm >= 45) {
      setQuests((prev) =>
        prev.map((q) => (q.id === 'quest-speed-typing' ? { ...q, current: wpm, completed: true } : q))
      );
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (gameState === 'idle') {
      startGame();
    }

    // Check typing error on last typed char
    if (val.length > inputVal.length) {
      const lastCharIndex = val.length - 1;
      if (val[lastCharIndex] !== targetText[lastCharIndex]) {
        if (soundEnabled) playErrorSound();
        setCharErrors((prev) => prev + 1);
      } else {
        if (soundEnabled) playKeyClickSound();
      }
    }

    setInputVal(val);

    // Calculate real-time accuracy
    const totalTyped = val.length + charErrors;
    const currentAcc = totalTyped > 0 ? Math.max(0, Math.round(((totalTyped - charErrors) / totalTyped) * 100)) : 100;
    setAccuracy(currentAcc);

    // If completed target command
    if (val === targetText) {
      if (soundEnabled) playSuccessBeep();
      setCompletedCmdsCount((prev) => prev + 1);
      setChallengeIndex((prev) => prev + 1);
      setInputVal('');

      // Update WPM
      const elapsedTimeMin = Math.max(0.1, (selectedDuration - timeLeft) / 60);
      const wordsCount = (completedCmdsCount + 1) * (targetText.length / 5);
      const calculatedWpm = Math.round(wordsCount / elapsedTimeMin);
      setWpm(calculatedWpm);
    }
  };

  const handleClaim = (questId, xp) => {
    if (soundEnabled) playSuccessBeep();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setQuests(
      quests.map((q) => (q.id === questId ? { ...q, claimed: true } : q))
    );
    if (onClaimQuestXp) onClaimQuestXp(xp);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', height: 'calc(100vh - 82px)', minHeight: 0 }} className="responsive-grid-split">
      {/* Left: Speed Typing Arena */}
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: '16px',
          background: 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.08) 0%, #05080e 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          overflowY: 'auto'
        }}
      >
        {/* Top Controls & Metrics Bar */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
                }}
              >
                <Flame size={20} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  CLI Muscle Memory Arena
                </h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Level up your terminal typing speed and precision
                </span>
              </div>
            </div>

            {/* Time Mode Selector */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.5)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              {[
                { sec: 30, label: '30s Blitz' },
                { sec: 60, label: '60s Endurance' },
                { sec: 0, label: 'Zen Practice' }
              ].map((m) => (
                <button
                  key={m.sec}
                  onClick={() => {
                    if (soundEnabled) playKeyClickSound();
                    setSelectedDuration(m.sec);
                    setTimeLeft(m.sec);
                    setGameState('idle');
                    setInputVal('');
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: selectedDuration === m.sec ? '1px solid #00ff88' : '1px solid transparent',
                    background: selectedDuration === m.sec ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                    color: selectedDuration === m.sec ? '#00ff88' : 'var(--text-muted)'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Left</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: timeLeft <= 5 && gameState === 'playing' ? '#ef4444' : '#00ff88', fontFamily: 'var(--font-mono)' }}>
                {selectedDuration === 0 ? '∞' : `${timeLeft}s`}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Speed WPM</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {wpm}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: accuracy >= 95 ? '#10b981' : '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                {accuracy}%
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Commands</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                {completedCmdsCount}
              </div>
            </div>
          </div>
        </div>

        {/* Typing Target & Interactive Input Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
              Domain: {currentChallenge.category} • {currentChallenge.difficulty}
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Type the exact command below:
            </span>
          </div>

          {/* Interactive Character-by-Character Highlighting */}
          <div
            style={{
              background: '#04070e',
              border: '1px solid rgba(0, 255, 136, 0.35)',
              borderRadius: '12px',
              padding: '16px 20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              letterSpacing: '0.5px',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.6)',
              minHeight: '80px',
              wordBreak: 'break-all'
            }}
          >
            {targetText.split('').map((char, index) => {
              let color = 'rgba(255, 255, 255, 0.35)'; // Pending
              let bg = 'transparent';
              let underline = false;

              if (index < inputVal.length) {
                if (inputVal[index] === char) {
                  color = '#00ff88'; // Correct
                } else {
                  color = '#ef4444'; // Error
                  bg = 'rgba(239, 68, 68, 0.25)';
                }
              } else if (index === inputVal.length) {
                color = '#ffffff';
                underline = true; // Current Cursor
              }

              return (
                <span
                  key={index}
                  style={{
                    color,
                    background: bg,
                    borderBottom: underline ? '2px solid #00ff88' : 'none',
                    padding: '0 1px'
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Real Input Box */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '10px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span style={{ color: '#00ff88', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              disabled={gameState === 'finished'}
              placeholder={gameState === 'finished' ? 'Round Finished! Tap Reset to retry' : 'Start typing the command here...'}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                width: '100%'
              }}
              autoFocus
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Tip: Accuracy matters more than raw speed to build muscle memory.
          </div>

          <button
            onClick={startGame}
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
              gap: '6px'
            }}
          >
            <RotateCcw size={14} />
            <span>{gameState === 'finished' ? 'Play Again' : 'Reset Round'}</span>
          </button>
        </div>
      </div>

      {/* Right: Daily Quests Panel */}
      <div
        className="glass-panel"
        style={{
          padding: '18px',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ margin: 0, fontSize: '0.94rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={16} color="#00ff88" /> Daily Quests
          </h4>
          <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            Resets Daily
          </span>
        </div>

        <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          Complete daily challenges to earn bonus XP and climb leaderboards faster.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {quests.map((quest) => {
            const isDone = quest.completed || quest.current >= quest.target;
            const progressPercent = Math.min(100, Math.round((quest.current / quest.target) * 100));

            return (
              <div
                key={quest.id}
                style={{
                  background: 'rgba(10, 16, 28, 0.7)',
                  border: quest.claimed ? '1px solid rgba(255,255,255,0.06)' : isDone ? '1px solid rgba(0, 255, 136, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: quest.claimed ? 'var(--text-muted)' : '#ffffff' }}>
                    {quest.title}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#f59e0b', fontWeight: 700 }}>
                    +{quest.rewardXp} XP
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {quest.desc}
                </p>

                {/* Progress bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', background: '#00ff88', borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {quest.current}/{quest.target}
                  </span>
                </div>

                {/* Claim Button */}
                {isDone && !quest.claimed && (
                  <button
                    onClick={() => handleClaim(quest.id, quest.rewardXp)}
                    style={{
                      marginTop: '4px',
                      padding: '5px 10px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#000000',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sparkles size={12} /> Claim +{quest.rewardXp} XP
                  </button>
                )}

                {quest.claimed && (
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} color="#10b981" /> Claimed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
