import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { MOCK_STUDENT_MASTER_RECORDS } from '../data/mockStudentMaster';
import { MOCK_JOB_DESCRIPTIONS } from '../data/mockJDs';
import { MOCK_STUDENT_RESUMES } from '../data/mockResumes';
import { analyzeCvVsJd } from '../utils/analysisEngine';
import { generateActionPlan } from '../utils/actionPlanEngine';
import { auditAtsCompliance } from '../utils/atsEngine';
import { runVerificationCrossCheck, createAuditLogEntry } from '../utils/verificationEngine';
import { parseUploadedFile } from '../utils/fileParser';
import { analyzeWithGemini } from '../utils/geminiApi';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState('student'); // 'student' | 'ccs'
  const [activeStudentId, setActiveStudentId] = useState('PGDM26-042');
  
  // JD Mode State: 'no_jd' | 'preset_jd' | 'custom_jd'
  const [jdMode, setJdMode] = useState('preset_jd');
  const [selectedJdId, setSelectedJdId] = useState('JD-PM-01');
  const [customJdText, setCustomJdText] = useState('');
  
  // Selected CV & Upload History State
  const [selectedCvId, setSelectedCvId] = useState('CV-SHLOK-01');
  const [customCvText, setCustomCvText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState('');
  const [hasEvaluated, setHasEvaluated] = useState(false);

  // Array of Uploaded Resumes History
  const [uploadedHistory, setUploadedHistory] = useState([
    { id: 'CV-SHLOK-01', name: 'Shlok Sanyal — Sample CV (PM)', text: MOCK_STUDENT_RESUMES[0].raw_text, type: 'preset' },
    { id: 'CV-ANANYA-02', name: 'Ananya Verma — Sample CV (Finance)', text: MOCK_STUDENT_RESUMES[1].raw_text, type: 'preset' },
    { id: 'CV-ROHAN-03', name: 'Rohan Kapoor — Sample CV (Consulting)', text: MOCK_STUDENT_RESUMES[2].raw_text, type: 'preset' }
  ]);

  // Gemini AI Configuration
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [geminiError, setGeminiError] = useState(null);

  // Days Remaining for Action Plan
  const [daysRemaining, setDaysRemaining] = useState(7);
  const [pmModalOpen, setPmModalOpen] = useState(false);

  // Active Data Objects (derived from selections)
  const activeStudentMaster = useMemo(() =>
    MOCK_STUDENT_MASTER_RECORDS.find(s => s.student_id === activeStudentId) || MOCK_STUDENT_MASTER_RECORDS[0],
    [activeStudentId]
  );

  const activeJd = useMemo(() =>
    MOCK_JOB_DESCRIPTIONS.find(j => j.id === selectedJdId) || MOCK_JOB_DESCRIPTIONS[0],
    [selectedJdId]
  );

  const activeCvPreset = useMemo(() =>
    MOCK_STUDENT_RESUMES.find(c => c.id === selectedCvId) || MOCK_STUDENT_RESUMES[0],
    [selectedCvId]
  );

  const effectiveCvText = customCvText || activeCvPreset.raw_text;

  // Analysis Outputs
  const [analysisReport, setAnalysisReport] = useState(null);

  // ====================================================
  // MASTER EVALUATION — Core Engine
  // Triggered ONLY by the Evaluate button
  // ====================================================
  const runMasterEvaluation = useCallback(async () => {
    if (!effectiveCvText || effectiveCvText.length < 50) {
      alert('Please upload a CV or select a sample CV before evaluating.');
      return;
    }

    setIsAnalyzing(true);
    setGeminiError(null);
    setAnalyzeProgress('Processing CV content...');

    try {
      let report = null;
      const jdText = jdMode === 'no_jd'
        ? 'General Master CV Audit'
        : jdMode === 'custom_jd'
        ? customJdText
        : `${activeJd.role} at ${activeJd.company}\n\nRequirements:\n${(activeJd.keywords || []).join(', ')}\n\n${activeJd.description || ''}`;

      // Try Gemini first (if API key available)
      if (geminiApiKey && geminiApiKey.trim().length > 10) {
        try {
          setAnalyzeProgress('Connecting to Gemini AI...');
          await new Promise(r => setTimeout(r, 300)); // Small delay for UX
          setAnalyzeProgress('Analyzing CV with Gemini AI...');
          report = await analyzeWithGemini(effectiveCvText, jdMode, jdText, daysRemaining, geminiApiKey.trim());
          setAnalyzeProgress('Finalizing results...');
        } catch (geminiErr) {
          console.warn('Gemini fallback triggered:', geminiErr.message);
          setGeminiError(geminiErr.message);
          setAnalyzeProgress('Gemini unavailable — running local analysis...');
          report = buildLocalReport(effectiveCvText, jdMode, activeJd, customJdText, daysRemaining);
        }
      } else {
        // Local NLP analysis
        setAnalyzeProgress('Running AI analysis engine...');
        await new Promise(r => setTimeout(r, 600)); // Simulate processing
        report = buildLocalReport(effectiveCvText, jdMode, activeJd, customJdText, daysRemaining);
      }

      // If the report doesn't have actionItems (local engine), generate them
      if (!report.actionItems) {
        const plan = generateActionPlan(daysRemaining, report);
        report.actionItems = plan?.actionItems || [];
      }
      if (!report.atsScore) {
        const ats = auditAtsCompliance(effectiveCvText);
        report.atsScore = ats?.atsScore || 85;
        report.atsTips = (ats?.issues || []).map(i => i.detail).filter(Boolean);
      }

      setAnalysisReport(report);
      setHasEvaluated(true);
    } catch (err) {
      console.error('Master Evaluation Error:', err);
      alert('Evaluation failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalyzeProgress('');
    }
  }, [effectiveCvText, jdMode, activeJd, customJdText, daysRemaining, geminiApiKey]);

  // ====================================================
  // LOCAL ANALYSIS ENGINE (Fallback)
  // ====================================================
  function buildLocalReport(cvText, jdMode, jdObject, customJdText, days) {
    return analyzeCvVsJd(cvText, jdMode, jdObject, customJdText);
  }

  // Verification cross-check
  const currentVerificationCheck = useMemo(() =>
    runVerificationCrossCheck(activeCvPreset, activeStudentId),
    [activeCvPreset, activeStudentId]
  );

  // Handle File Upload — parses file and sets CV text WITHOUT running evaluation
  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsParsingFile(true);
    setHasEvaluated(false);

    try {
      const parsed = await parseUploadedFile(file);
      if (parsed && parsed.text) {
        setCustomCvText(parsed.text);
        setUploadedFileName(parsed.fileName);

        const newHistoryItem = {
          id: `UPL-${Date.now()}`,
          name: `${parsed.fileName} (uploaded ${new Date().toLocaleTimeString()})`,
          text: parsed.text,
          type: 'user_uploaded'
        };

        setUploadedHistory(prev => [newHistoryItem, ...prev]);
        setSelectedCvId(newHistoryItem.id);
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert(err.message || 'Failed to parse document. Please try a different format.');
    } finally {
      setIsParsingFile(false);
    }
  };

  // Verification Queue State
  const [verificationTickets, setVerificationTickets] = useState([
    {
      ticket_id: 'TICK-9082',
      student_id: 'PGDM26-015',
      studentName: 'Ananya Verma',
      studentEmail: 'ananya.v@greatlakes.edu.in',
      program: 'PGDM 2026-28',
      targetJdTitle: 'Financial Analyst — JPMC',
      version_id: 'V2.1-LOCKED',
      cvText: MOCK_STUDENT_RESUMES[1].raw_text,
      cgpa_claimed: 3.90,
      cgpa_master: 3.45,
      riskLevel: 'HIGH',
      status: 'FLAGGED_HIGH_RISK',
      verificationState: 'UNDER_REVIEW',
      discrepancies: [
        {
          type: 'CGPA_MISMATCH',
          field: 'cgpa',
          claimed: '3.90',
          groundTruth: '3.45',
          risk: 'High',
          detail: 'CV claims 3.90 CGPA vs GLIM Master Record of 3.45.'
        },
        {
          type: 'UNVERIFIED_CERTIFICATION',
          field: 'certification',
          claimed: 'PMP Certification',
          groundTruth: 'Not in CCS Registry',
          risk: 'High',
          detail: 'PMP certification claim lacks verified proof.'
        }
      ],
      submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      reviewerComments: ''
    },
    {
      ticket_id: 'TICK-9083',
      student_id: 'PGDM26-042',
      studentName: 'Shlok Sanyal',
      studentEmail: 'shlok.sanyal@greatlakes.edu.in',
      program: 'PGDM 2026-28',
      targetJdTitle: 'Senior APM — Flipkart',
      version_id: 'V1.0-LOCKED',
      cvText: MOCK_STUDENT_RESUMES[0].raw_text,
      cgpa_claimed: 3.82,
      cgpa_master: 3.82,
      riskLevel: 'CLEAN',
      status: 'CLEAN_AUTO_PASS',
      verificationState: 'UNDER_REVIEW',
      discrepancies: [],
      submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      reviewerComments: ''
    }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    createAuditLogEntry('SYSTEM_ROUTER', 'ROUTED_FLAGGED', 'Auto-routed TICK-9082 for Ananya Verma to High-Priority Queue — 2 HIGH discrepancies.', 'PGDM26-015'),
    createAuditLogEntry('SYSTEM_ROUTER', 'ROUTED_CLEAN', 'Auto-routed TICK-9083 for Shlok Sanyal to Standard Queue — no discrepancies.', 'PGDM26-042')
  ]);

  const handleStudentSelect = (studentId) => {
    setActiveStudentId(studentId);
    const preset = MOCK_STUDENT_RESUMES.find(c => c.student_id === studentId);
    if (preset) {
      setSelectedCvId(preset.id);
      setCustomCvText('');
      setUploadedFileName('');
      setHasEvaluated(false);
      setAnalysisReport(null);
    }
  };

  const handleSelectHistoryCv = (historyId) => {
    setSelectedCvId(historyId);
    setHasEvaluated(false);
    setAnalysisReport(null);
    const item = uploadedHistory.find(h => h.id === historyId);
    if (item) {
      setCustomCvText(item.text);
      setUploadedFileName(item.type === 'user_uploaded' ? item.name : '');
    }
  };

  const handleSubmitForVerification = () => {
    const check = runVerificationCrossCheck(activeCvPreset, activeStudentId);
    const newTicketId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = {
      ticket_id: newTicketId,
      student_id: activeStudentId,
      studentName: activeStudentMaster.name,
      studentEmail: activeStudentMaster.email,
      program: activeStudentMaster.program,
      targetJdTitle: jdMode === 'no_jd' ? 'General Master Resume' : jdMode === 'custom_jd' ? 'Custom JD Upload' : activeJd.role,
      version_id: `V1.${Math.floor(Math.random() * 5 + 1)}-LOCKED`,
      cvText: effectiveCvText,
      cgpa_claimed: activeCvPreset.cgpa_claimed,
      cgpa_master: activeStudentMaster.cgpa,
      riskLevel: check.riskLevel,
      status: check.status,
      verificationState: 'UNDER_REVIEW',
      discrepancies: check.discrepancies,
      submittedAt: new Date().toISOString(),
      reviewerComments: ''
    };

    setVerificationTickets(prev => [newTicket, ...prev]);

    const logDetail = `Verification Router assigned status '${check.status}' with ${check.discrepancyCount} discrepancy flags. Enqueued in CCS Review Queue.`;
    const logAction = check.riskLevel === 'HIGH' ? 'ROUTING_FLAGGED_HIGH' : 'ROUTING_CLEAN';
    setAuditLogs(prev => [createAuditLogEntry('SYSTEM_ROUTER', logAction, logDetail, activeStudentId), ...prev]);

    return newTicket;
  };

  const handleCcsDecision = (ticketId, decision, comments) => {
    setVerificationTickets(prev => prev.map(t => {
      if (t.ticket_id === ticketId) {
        return { ...t, verificationState: decision, reviewerComments: comments, decidedAt: new Date().toISOString() };
      }
      return t;
    }));

    const ticket = verificationTickets.find(t => t.ticket_id === ticketId);
    const logDetail = `CCS Decision '${decision}' for Ticket ${ticketId} (${ticket?.studentName}). "${comments || 'No comment'}"`;
    setAuditLogs(prev => [createAuditLogEntry('CCS_REVIEWER', `CCS_DECISION_${decision}`, logDetail, ticket?.student_id), ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeStudentId,
        setActiveStudentId: handleStudentSelect,

        // JD Mode Controls
        jdMode,
        setJdMode,
        selectedJdId,
        setSelectedJdId,
        customJdText,
        setCustomJdText,

        // CV & Upload History
        selectedCvId,
        setSelectedCvId: handleSelectHistoryCv,
        customCvText,
        setCustomCvText,
        uploadedFileName,
        uploadedHistory,
        isParsingFile,
        handleFileUpload,
        isAnalyzing,
        analyzeProgress,
        hasEvaluated,
        runMasterEvaluation,

        // Gemini AI config
        geminiApiKey,
        setGeminiApiKey,
        geminiError,

        daysRemaining,
        setDaysRemaining,
        pmModalOpen,
        setPmModalOpen,

        // Data & Analysis
        activeStudentMaster,
        activeJd,
        activeCvPreset,
        effectiveCvText,
        analysisReport,
        currentVerificationCheck,

        // Queues & Audit
        verificationTickets,
        auditLogs,

        // Actions
        handleSubmitForVerification,
        handleCcsDecision
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
