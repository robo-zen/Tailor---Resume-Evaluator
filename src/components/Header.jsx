import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, Users, Award } from 'lucide-react';

export default function Header() {
  const { currentRole, setCurrentRole, setPmModalOpen, verificationTickets } = useApp();

  const pendingCount = verificationTickets.filter(t => t.verificationState === 'UNDER_REVIEW').length;
  const flaggedCount = verificationTickets.filter(t => t.verificationState === 'UNDER_REVIEW' && t.riskLevel === 'HIGH').length;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: 'rgba(12,15,14,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 20px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'var(--teal-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <ShieldCheck size={16} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: 15,
                color: '#e7e5e4',
                letterSpacing: '-0.02em',
              }}>
                PROJECT TAILOR
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgba(20,184,166,0.1)',
                color: 'var(--teal-400)',
                border: '1px solid rgba(20,184,166,0.2)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
              }}>
                PM v2
              </span>
            </div>
            <p style={{
              fontSize: 11,
              color: 'var(--stone-500)',
              margin: 0,
              lineHeight: 1,
            }}>
              GLIM CV Audit & Placement Engine
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* PM Charter Button */}
          <button
            className="btn btn-ghost"
            onClick={() => setPmModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
          >
            <Award size={13} color="#f59e0b" />
            <span style={{ color: 'var(--stone-400)' }}>Project Charter</span>
          </button>

          {/* Role Switcher */}
          <div className="tab-group" style={{ minWidth: 260 }}>
            <button
              className={`tab ${currentRole === 'student' ? 'active' : ''}`}
              onClick={() => setCurrentRole('student')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
            >
              <User size={12} />
              Student Portal
            </button>
            <button
              className={`tab ${currentRole === 'ccs' ? 'active' : ''}`}
              onClick={() => setCurrentRole('ccs')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, position: 'relative' }}
            >
              <Users size={12} />
              CCS Admin
              {pendingCount > 0 && (
                <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: 999,
                  background: flaggedCount > 0 ? '#ef4444' : 'rgba(20,184,166,0.3)',
                  color: '#fff',
                  marginLeft: 2,
                }}>
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
