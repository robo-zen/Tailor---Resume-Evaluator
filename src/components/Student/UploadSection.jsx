import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_JOB_DESCRIPTIONS } from '../../data/mockJDs';
import { MOCK_STUDENT_MASTER_RECORDS } from '../../data/mockStudentMaster';
import {
  UploadCloud, FileText, CheckCircle2, RefreshCw, Key, Globe, FileCode, Layers, Play, X, Sparkles
} from 'lucide-react';

const JD_MODES = [
  { id: 'no_jd', label: 'General Audit', icon: Globe, desc: 'Evaluate overall CV quality without a target role' },
  { id: 'preset_jd', label: 'Target Role', icon: Layers, desc: 'Match against a preset GLIM placement drive JD' },
  { id: 'custom_jd', label: 'Custom JD', icon: FileCode, desc: 'Paste or upload your own job description' },
];

export default function UploadSection() {
  const {
    activeStudentId,
    setActiveStudentId,
    jdMode,
    setJdMode,
    selectedJdId,
    setSelectedJdId,
    customJdText,
    setCustomJdText,
    selectedCvId,
    setSelectedCvId,
    handleFileUpload,
    isParsingFile,
    uploadedFileName,
    uploadedHistory,
    geminiApiKey,
    setGeminiApiKey,
    geminiError,
    isAnalyzing,
    analyzeProgress,
    runMasterEvaluation,
  } = useApp();

  const cvInputRef = useRef(null);
  const jdInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
  };
  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onCvFileChange = (e) => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); };
  const onJdFileChange = async (e) => {
    if (e.target.files?.[0]) {
      const text = await e.target.files[0].text();
      setCustomJdText(text);
      setJdMode('custom_jd');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Row 1: Profile Selector ── */}
      <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--teal-700)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
            fontFamily: 'var(--font-heading)',
          }}>
            {MOCK_STUDENT_MASTER_RECORDS.find(s => s.student_id === activeStudentId)?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e7e5e4' }}>
              {MOCK_STUDENT_MASTER_RECORDS.find(s => s.student_id === activeStudentId)?.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--stone-500)', fontFamily: 'var(--font-mono)' }}>
              {activeStudentId} · PGDM 2026–28
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--stone-500)' }}>Profile:</span>
          <select
            className="select"
            value={activeStudentId}
            onChange={(e) => setActiveStudentId(e.target.value)}
            style={{ width: 'auto', minWidth: 200, fontSize: 12 }}
          >
            {MOCK_STUDENT_MASTER_RECORDS.map(s => (
              <option key={s.student_id} value={s.student_id}>
                {s.name} ({s.student_id})
              </option>
            ))}
          </select>

          {/* Gemini API Key toggle */}
          <button
            className="btn btn-ghost"
            onClick={() => setShowApiKey(v => !v)}
            style={{ fontSize: 11, gap: 4, padding: '6px 10px', color: geminiApiKey ? 'var(--teal-400)' : 'var(--stone-500)' }}
          >
            <Key size={11} />
            {geminiApiKey ? 'AI: Active' : 'Add Gemini Key'}
          </button>
        </div>
      </div>

      {/* ── Gemini API Key Input (collapsible) ── */}
      {showApiKey && (
        <div className="card animate-fade-in" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={13} color="var(--teal-400)" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#e7e5e4' }}>Gemini AI (Optional)</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--stone-500)' }}>
              Without a key, local NLP engine runs instead
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="password"
              className="input"
              placeholder="Paste your Gemini API key (AIza...)"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
            />
            {geminiApiKey && (
              <button
                className="btn btn-ghost"
                onClick={() => setGeminiApiKey('')}
                style={{ flexShrink: 0, padding: '0 12px' }}
              >
                <X size={13} />
              </button>
            )}
          </div>
          {geminiError && (
            <p style={{ fontSize: 11, color: '#f87171', margin: 0 }}>
              ⚠ Gemini error: {geminiError} — fell back to local engine.
            </p>
          )}
          <p style={{ fontSize: 11, color: 'var(--stone-500)', margin: 0 }}>
            Get a free key at{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
              style={{ color: 'var(--teal-400)', textDecoration: 'none' }}>
              aistudio.google.com
            </a>
          </p>
        </div>
      )}

      {/* ── Row 2: Resume + JD side by side ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* LEFT: Resume Uploader */}
        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="section-label">1. Your Resume / CV</span>
            <span style={{ fontSize: 10, color: 'var(--stone-600)', fontFamily: 'var(--font-mono)' }}>PDF · DOCX · TXT</span>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => cvInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? 'var(--teal-500)' : uploadedFileName ? 'rgba(20,184,166,0.3)' : 'var(--border-subtle)'}`,
              borderRadius: 10,
              padding: '28px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? 'rgba(20,184,166,0.04)' : uploadedFileName ? 'rgba(20,184,166,0.03)' : 'transparent',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <input type="file" ref={cvInputRef} onChange={onCvFileChange} accept=".pdf,.docx,.txt" style={{ display: 'none' }} />

            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: uploadedFileName ? 'rgba(20,184,166,0.1)' : 'var(--bg-elevated)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isParsingFile ? (
                <RefreshCw size={18} color="var(--teal-400)" className="animate-spin" />
              ) : uploadedFileName ? (
                <CheckCircle2 size={18} color="var(--teal-400)" />
              ) : (
                <UploadCloud size={18} color="var(--stone-500)" />
              )}
            </div>

            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: uploadedFileName ? '#e7e5e4' : 'var(--stone-400)' }}>
                {isParsingFile
                  ? 'Parsing document...'
                  : uploadedFileName
                  ? uploadedFileName
                  : 'Drop file here or click to browse'}
              </p>
              {!isParsingFile && (
                <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--stone-600)' }}>
                  {uploadedFileName
                    ? 'Document ready · Click Evaluate below to analyze'
                    : 'Supports PDF, DOCX, and plain text files'}
                </p>
              )}
            </div>
          </div>

          {/* Sample CV picker */}
          <div>
            <label style={{ fontSize: 11, color: 'var(--stone-500)', display: 'block', marginBottom: 6 }}>
              Or use a sample CV:
            </label>
            <select
              className="select"
              value={selectedCvId}
              onChange={(e) => setSelectedCvId(e.target.value)}
              style={{ fontSize: 12 }}
            >
              {uploadedHistory.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT: JD Mode Selector */}
        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span className="section-label">2. Job Description Mode</span>

          {/* JD Mode Tabs */}
          <div className="tab-group">
            {JD_MODES.map(mode => (
              <button
                key={mode.id}
                className={`tab ${jdMode === mode.id ? 'active' : ''}`}
                onClick={() => setJdMode(mode.id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 6px', fontSize: 11 }}
              >
                <mode.icon size={13} />
                {mode.label}
              </button>
            ))}
          </div>

          {/* Mode-specific content */}
          {jdMode === 'no_jd' && (
            <div className="card-elevated animate-fade-in" style={{ padding: 14 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#e7e5e4', marginBottom: 4 }}>
                General Master CV Evaluation
              </p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--stone-400)', lineHeight: 1.6 }}>
                Evaluates formatting, metric density, leadership language, and general improvements — no specific role targeted.
              </p>
            </div>
          )}

          {jdMode === 'preset_jd' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 11, color: 'var(--stone-500)' }}>Select Placement Drive Role:</label>
              <select
                className="select"
                value={selectedJdId}
                onChange={(e) => setSelectedJdId(e.target.value)}
                style={{ fontSize: 12 }}
              >
                {MOCK_JOB_DESCRIPTIONS.map(jd => (
                  <option key={jd.id} value={jd.id}>
                    {jd.company} — {jd.role}
                  </option>
                ))}
              </select>
              {MOCK_JOB_DESCRIPTIONS.find(j => j.id === selectedJdId) && (
                <div className="card-elevated" style={{ padding: '10px 12px' }}>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--stone-400)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--stone-300)' }}>Key Skills: </strong>
                    {(MOCK_JOB_DESCRIPTIONS.find(j => j.id === selectedJdId)?.keywords || []).slice(0, 6).join(' · ')}
                  </p>
                </div>
              )}
            </div>
          )}

          {jdMode === 'custom_jd' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: 11, color: 'var(--stone-500)' }}>Paste Custom Job Description:</label>
                <button
                  className="btn btn-ghost"
                  onClick={() => jdInputRef.current?.click()}
                  style={{ fontSize: 10, padding: '4px 8px', gap: 3 }}
                >
                  <FileText size={10} /> Upload .txt
                </button>
                <input type="file" ref={jdInputRef} onChange={onJdFileChange} accept=".txt,.docx" style={{ display: 'none' }} />
              </div>
              <textarea
                className="textarea"
                value={customJdText}
                onChange={(e) => setCustomJdText(e.target.value)}
                rows={5}
                placeholder="Paste the job description here — role, requirements, responsibilities..."
              />
              {customJdText && (
                <p style={{ margin: 0, fontSize: 10, color: 'var(--teal-400)', fontFamily: 'var(--font-mono)' }}>
                  ✓ {customJdText.split(/\s+/).length} words loaded
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Evaluate Button ── */}
      <button
        className="btn btn-primary btn-lg"
        onClick={runMasterEvaluation}
        disabled={isAnalyzing}
        style={{
          background: isAnalyzing ? 'var(--teal-700)' : 'var(--teal-600)',
          gap: 10,
          letterSpacing: '0.03em',
          fontFamily: 'var(--font-heading)',
          fontSize: 14,
          fontWeight: 700,
          boxShadow: isAnalyzing ? 'none' : '0 4px 20px rgba(20,184,166,0.2)',
        }}
      >
        {isAnalyzing ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            <span>{analyzeProgress || 'Analyzing...'}</span>
          </>
        ) : (
          <>
            <Play size={16} fill="currentColor" />
            <span>Evaluate CV</span>
          </>
        )}
      </button>

    </div>
  );
}
