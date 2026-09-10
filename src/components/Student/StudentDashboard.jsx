import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import UploadSection from './UploadSection';
import {
  CheckCircle2, AlertCircle, Clock, ShieldCheck, Send, Lock,
  AlertTriangle, ExternalLink, ChevronDown, ChevronUp, TrendingUp
} from 'lucide-react';

// ── Score Ring Component ──────────────────────────────────────────
function ScoreRing({ score, size = 88 }) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score / 100);

  const color = score >= 75 ? 'var(--teal-400)' : score >= 55 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg viewBox="0 0 36 36" width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="18" cy="18" r={radius} fill="none" stroke="var(--bg-elevated)" strokeWidth="3" />
        <circle
          cx="18" cy="18" r={radius} fill="none"
          stroke={color} strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--stone-500)', letterSpacing: '0.06em' }}>
          SCORE
        </span>
      </div>
    </div>
  );
}

// ── Category Bar ─────────────────────────────────────────────────
function CategoryBar({ name, score }) {
  const color = score >= 75 ? 'progress-fill' : score >= 55 ? 'progress-fill-warn' : 'progress-fill-danger';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--stone-300)' }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#e7e5e4' }}>{score}%</span>
      </div>
      <div className="progress-bar">
        <div className={color} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

// ── Resource Link ─────────────────────────────────────────────────
function ResourceLink({ resource }) {
  if (!resource?.url || !resource?.title) return null;
  return (
    <a href={resource.url} target="_blank" rel="noreferrer" className="resource-link">
      <ExternalLink size={11} color="var(--teal-400)" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: 'var(--stone-300)', flex: 1 }}>{resource.title}</span>
      <span style={{
        fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 600,
        color: 'var(--stone-500)', textTransform: 'uppercase', letterSpacing: '0.04em'
      }}>
        {resource.type || 'link'}
      </span>
    </a>
  );
}

// ── Action Item ───────────────────────────────────────────────────
function ActionItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const typeColor = {
    immediate: 'var(--color-danger)',
    short_term: 'var(--color-warning)',
    strategic: 'var(--teal-400)',
  }[item.type] || 'var(--stone-400)';

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <button
        style={{
          width: '100%', textAlign: 'left', padding: '12px 14px',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: 'var(--bg-elevated)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: typeColor, flexShrink: 0,
          fontFamily: 'var(--font-mono)',
        }}>
          {index + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#e7e5e4' }}>{item.title}</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--stone-500)' }}>{item.timeframe}</p>
        </div>
        {open ? <ChevronUp size={14} color="var(--stone-500)" /> : <ChevronDown size={14} color="var(--stone-500)" />}
      </button>

      {open && (
        <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--stone-400)', lineHeight: 1.6 }}>
            {item.description}
          </p>
          {item.resources && item.resources.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="section-label" style={{ marginBottom: 0 }}>Resources</span>
              {item.resources.map((r, i) => <ResourceLink key={i} resource={r} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Student Dashboard ────────────────────────────────────────
export default function StudentDashboard() {
  const {
    hasEvaluated,
    analysisReport,
    activeStudentMaster,
    currentVerificationCheck,
    daysRemaining,
    setDaysRemaining,
    handleSubmitForVerification,
    verificationTickets,
    jdMode,
    geminiApiKey,
  } = useApp();

  const [submittedTicket, setSubmittedTicket] = useState(null);
  const existingTicket = verificationTickets.find(t => t.student_id === activeStudentMaster?.student_id);
  const activeTicket = submittedTicket || existingTicket;

  const handleLockSubmit = () => {
    const ticket = handleSubmitForVerification();
    setSubmittedTicket(ticket);
  };

  const score = analysisReport?.overallFitScore ?? 0;
  const isGeminiResult = analysisReport?.source === 'gemini';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Upload & Evaluate Section ── */}
      <UploadSection />

      {/* ── Results (shown only after evaluation) ── */}
      {hasEvaluated && analysisReport && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Score Banner ── */}
          <div className="card-teal" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <ScoreRing score={score} />

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#e7e5e4', fontFamily: 'var(--font-heading)' }}>
                    {analysisReport.modeLabel}
                  </h3>
                  {isGeminiResult && (
                    <span className="badge badge-teal">✦ Gemini AI</span>
                  )}
                  <span className="badge badge-neutral">
                    {analysisReport.keywordMatchRatio}% keyword match
                  </span>
                  {analysisReport.atsScore && (
                    <span className="badge badge-teal">
                      ATS {analysisReport.atsScore}/100
                    </span>
                  )}
                </div>

                {/* Keyword chips */}
                {analysisReport.matchedKeywords?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                    {analysisReport.matchedKeywords.slice(0, 8).map(kw => (
                      <span key={kw} className="chip chip-match">✓ {kw}</span>
                    ))}
                    {analysisReport.missingKeywords?.slice(0, 5).map(kw => (
                      <span key={kw} className="chip chip-missing">✗ {kw}</span>
                    ))}
                  </div>
                )}

                {/* Category bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {analysisReport.categories?.map((cat, i) => (
                    <CategoryBar key={i} name={cat.name} score={cat.score} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Strengths & Gaps ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* Strengths */}
            <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircle2 size={15} color="var(--teal-400)" />
                <span className="section-label" style={{ color: 'var(--stone-400)' }}>Strengths</span>
              </div>
              {analysisReport.strengths?.map((s, i) => (
                <div key={i} style={{
                  padding: '12px 14px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 8,
                  display: 'flex', flexDirection: 'column', gap: 4,
                  borderLeft: '3px solid var(--teal-600)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e7e5e4' }}>{s.title}</span>
                    <span className="badge badge-teal" style={{ flexShrink: 0 }}>{s.impact}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--stone-400)', lineHeight: 1.55 }}>{s.detail}</p>
                </div>
              ))}
            </div>

            {/* Gaps */}
            <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <AlertCircle size={15} color="#f59e0b" />
                <span className="section-label" style={{ color: 'var(--stone-400)' }}>Gaps & Recommendations</span>
              </div>
              {analysisReport.gaps?.map((gap) => (
                <div key={gap.id} style={{
                  padding: '12px 14px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 8,
                  display: 'flex', flexDirection: 'column', gap: 4,
                  borderLeft: `3px solid ${gap.priority === 'Critical Gap' ? 'var(--color-danger)' : '#f59e0b'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e7e5e4' }}>{gap.skill}</span>
                    <span className={`badge ${gap.priority === 'Critical Gap' ? 'badge-danger' : 'badge-warn'}`} style={{ flexShrink: 0 }}>
                      {gap.priority}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--stone-400)', lineHeight: 1.55 }}>{gap.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Action Plan ── */}
          <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={15} color="var(--teal-400)" />
                <span className="section-label" style={{ color: 'var(--stone-400)' }}>
                  Action Plan — {daysRemaining} Days to Drive
                </span>
              </div>
              <span className={`badge ${daysRemaining <= 4 ? 'badge-danger' : daysRemaining <= 7 ? 'badge-warn' : 'badge-teal'}`}>
                {daysRemaining <= 4 ? '⚡ Sprint Mode' : daysRemaining <= 7 ? '🎯 Focused Mode' : '📚 Build Mode'}
              </span>
            </div>

            {/* Days slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--stone-400)' }}>Days remaining until placement drive:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--teal-400)', fontWeight: 700 }}>{daysRemaining} days</span>
              </div>
              <input
                type="range"
                min="2" max="30"
                value={daysRemaining}
                onChange={(e) => setDaysRemaining(parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--stone-600)', fontFamily: 'var(--font-mono)' }}>
                <span>2 days (Sprint)</span>
                <span>15 days (Short Course)</span>
                <span>30 days (Certification)</span>
              </div>
            </div>

            {/* Action items */}
            {analysisReport.actionItems?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {analysisReport.actionItems.map((item, i) => (
                  <ActionItem key={item.id || i} item={item} index={i} />
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 12, color: 'var(--stone-500)', textAlign: 'center', padding: '16px 0' }}>
                Action plan not available. Try evaluating with Gemini AI for personalized plans.
              </p>
            )}
          </div>

          {/* ── ATS Tips (if available) ── */}
          {analysisReport.atsTips?.length > 0 && (
            <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={15} color="var(--teal-400)" />
                <span className="section-label" style={{ color: 'var(--stone-400)' }}>ATS Optimization Tips</span>
                <span className="badge badge-teal">{analysisReport.atsScore}/100</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {analysisReport.atsTips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: 'var(--teal-400)', fontSize: 11, marginTop: 2, flexShrink: 0 }}>→</span>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--stone-400)', lineHeight: 1.55 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CCS Verification Submit ── */}
          <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                  <Lock size={14} color="var(--teal-400)" />
                  <span className="section-label" style={{ color: 'var(--stone-400)' }}>Submit to CCS Placement Queue</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--stone-500)' }}>
                  Lock and submit your CV for official verification against GLIM Master Records.
                </p>
              </div>

              {activeTicket ? (
                <div className="badge badge-teal" style={{ padding: '8px 14px', fontSize: 12 }}>
                  <ShieldCheck size={13} />
                  {activeTicket.verificationState} ({activeTicket.ticket_id})
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleLockSubmit}
                  style={{ gap: 7, padding: '10px 20px' }}
                >
                  <Send size={13} />
                  Submit & Lock
                </button>
              )}
            </div>

            {currentVerificationCheck?.discrepancyCount > 0 && (
              <div style={{
                padding: '12px 14px',
                background: 'rgba(239,68,68,0.07)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 8,
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <AlertTriangle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#f87171' }}>
                    GLIM Master Record Discrepancy
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--stone-400)' }}>
                    {currentVerificationCheck.discrepancies[0]?.detail}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── Empty State ── */}
      {!hasEvaluated && (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          color: 'var(--stone-600)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={24} color="var(--stone-600)" />
          </div>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--stone-500)' }}>
            Upload your CV and click <strong style={{ color: 'var(--stone-400)' }}>Evaluate CV</strong> to get your personalized audit report.
          </p>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--stone-600)' }}>
            {geminiApiKey ? '✦ Gemini AI is active — results will be powered by Gemini 1.5 Flash.' : 'Add your Gemini API key above for AI-powered analysis.'}
          </p>
        </div>
      )}
    </div>
  );
}
