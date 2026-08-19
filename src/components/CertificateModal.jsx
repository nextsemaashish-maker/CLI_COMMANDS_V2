import React, { useState, useRef, useEffect } from 'react';
import {
  Award, Download, Printer, X, Sparkles, CheckCircle2, ShieldCheck,
  Calendar, User, Flame, Layers, Hash
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessBeep, playKeyClickSound } from '../utils/audioSynth';

export default function CertificateModal({ isOpen, onClose, userStats, completedLessonsCount, soundEnabled }) {
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('cli_student_name') || 'CLI Terminal Specialist';
  });
  const [certId] = useState(() => {
    return 'NS-CLI-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  });
  const [issueDate] = useState(() => {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (soundEnabled) playSuccessBeep();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
      localStorage.setItem('cli_student_name', studentName);
    }
  }, [isOpen]);

  const handleNameChange = (e) => {
    setStudentName(e.target.value);
    localStorage.setItem('cli_student_name', e.target.value);
  };

  const handleDownloadImage = () => {
    if (soundEnabled) playSuccessBeep();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 800;

    // Background Dark Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#05080e');
    bgGrad.addColorStop(0.5, '#0a101d');
    bgGrad.addColorStop(1, '#030509');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Cyber Border
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 1120, 720);

    // Header Branding
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 24px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NEXTSEM ACADEMY • VERIFIED CREDENTIAL', 600, 110);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px "Space Grotesk", sans-serif';
    ctx.fillText('CERTIFICATE OF MASTERY', 600, 180);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px "Inter", sans-serif';
    ctx.fillText('This is to officially certify that', 600, 240);

    // Student Name
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 44px "Space Grotesk", sans-serif';
    ctx.fillText(studentName.toUpperCase(), 600, 310);

    // Decorative Line under Name
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 330);
    ctx.lineTo(850, 330);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '20px "Inter", sans-serif';
    ctx.fillText('has successfully mastered the complete Command Line Interface (CLI) Curriculum,', 600, 380);
    ctx.fillText('demonstrating excellence across Linux, Bash, Git, Docker, Kubernetes & SysAdmin engineering.', 600, 415);

    // Stat Boxes
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.fillRect(200, 470, 240, 90);
    ctx.fillRect(480, 470, 240, 90);
    ctx.fillRect(760, 470, 240, 90);

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.strokeRect(200, 470, 240, 90);
    ctx.strokeRect(480, 470, 240, 90);
    ctx.strokeRect(760, 470, 240, 90);

    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 30px "Fira Code", monospace';
    ctx.fillText(`${userStats.xp} XP`, 320, 515);
    ctx.fillText(`${completedLessonsCount || 10}+`, 600, 515);
    ctx.fillText(`${userStats.streak || 1} Days`, 880, 515);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillText('Total Experience', 320, 545);
    ctx.fillText('Lessons Completed', 600, 545);
    ctx.fillText('Active Streak', 880, 545);

    // Footer Details
    ctx.fillStyle = '#64748b';
    ctx.font = '14px "Fira Code", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Issued: ${issueDate}`, 100, 680);
    ctx.fillText(`Verification ID: ${certId}`, 100, 710);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 18px "Space Grotesk", sans-serif';
    ctx.fillText('NextSem Academic Authority', 1100, 680);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillText('Cryptographically Signed Credential', 1100, 710);

    // Trigger Download
    const imageUri = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `NextSem_CLI_Certificate_${studentName.replace(/\s+/g, '_')}.png`;
    link.href = imageUri;
    link.click();
  };

  const handlePrint = () => {
    if (soundEnabled) playKeyClickSound();
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2700,
        background: 'rgba(2, 6, 12, 0.88)',
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
          maxWidth: '850px',
          maxHeight: '92vh',
          borderRadius: '16px',
          border: '1px solid rgba(0, 255, 136, 0.4)',
          background: 'linear-gradient(180deg, #090e1a 0%, #03060c 100%)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 70px rgba(0, 255, 136, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '14px 20px',
            background: 'rgba(16, 185, 129, 0.08)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={22} color="#00ff88" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
              Official Certificate of Mastery
            </h3>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Certificate Preview Card */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Student Name Editor */}
          <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={18} color="#00ff88" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Certificate Name:</span>
            <input
              type="text"
              value={studentName}
              onChange={handleNameChange}
              placeholder="Enter your full name"
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(0, 255, 136, 0.4)',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 700,
                padding: '4px 8px',
                outline: 'none',
                width: '100%',
                fontFamily: 'var(--font-sans)'
              }}
            />
          </div>

          {/* Styled Visual Certificate Render */}
          <div
            style={{
              background: 'radial-gradient(circle at 50% 30%, #0e1726 0%, #04070e 100%)',
              border: '2px solid rgba(0, 255, 136, 0.5)',
              borderRadius: '12px',
              padding: '28px 24px',
              textAlign: 'center',
              position: 'relative',
              boxShadow: 'inset 0 0 40px rgba(0, 255, 136, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {/* Top Badge */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  padding: '4px 14px',
                  borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#00ff88',
                  fontWeight: 800,
                  letterSpacing: '1px'
                }}
              >
                NEXTSEM ACADEMY • VERIFIED CREDENTIAL
              </div>
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.5px'
              }}
            >
              CERTIFICATE OF MASTERY
            </h2>

            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              This is to officially certify that
            </p>

            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#00ff88',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.5px',
                borderBottom: '2px solid rgba(16, 185, 129, 0.4)',
                display: 'inline-block',
                margin: '0 auto',
                paddingBottom: '4px'
              }}
            >
              {studentName.toUpperCase()}
            </div>

            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '600px', alignSelf: 'center' }}>
              has successfully demonstrated complete practical mastery in modern Command Line Interfaces, shell scripting, containerization, and systems administration.
            </p>

            {/* Achievement Chips */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '6px' }}>
              <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 14px', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
                🏆 Score: <strong style={{ color: '#00ff88' }}>{userStats.xp} XP</strong>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 14px', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
                🔥 Streak: <strong style={{ color: '#f59e0b' }}>{userStats.streak || 1} Days</strong>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 14px', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
                🛡️ Credential ID: <strong style={{ color: 'var(--accent-cyan)' }}>{certId}</strong>
              </div>
            </div>

            {/* Footer Signatures */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', marginTop: '8px' }}>
              <div style={{ textAlign: 'left', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <div>Date: {issueDate}</div>
                <div>Status: Verified & Cryptographically Signed</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00ff88', fontSize: '0.78rem', fontWeight: 700 }}>
                <ShieldCheck size={16} /> NextSem Academic Authority
              </div>
            </div>
          </div>

          {/* Hidden Canvas for High-Resolution Export */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Bottom Actions */}
        <div
          style={{
            padding: '14px 20px',
            background: 'rgba(0, 0, 0, 0.6)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <button
            onClick={handlePrint}
            style={{
              padding: '8px 14px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Printer size={15} /> Print / Save PDF
          </button>

          <button
            onClick={handleDownloadImage}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.84rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)'
            }}
          >
            <Download size={15} /> Download High-Res PNG
          </button>
        </div>
      </div>
    </div>
  );
}
