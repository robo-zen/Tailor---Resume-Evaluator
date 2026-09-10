import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, Send, AlertTriangle, CheckCircle2, Clock, History } from 'lucide-react';

export default function VerificationTracker() {
  const {
    activeStudentMaster,
    activeCvPreset,
    activeJd,
    currentVerificationCheck,
    handleSubmitForVerification,
    verificationTickets,
    setCurrentRole
  } = useApp();

  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Check if active student has existing ticket
  const existingTicket = verificationTickets.find(t => t.student_id === activeStudentMaster.student_id);

  const handleLockAndSubmit = () => {
    const ticket = handleSubmitForVerification();
    setSubmittedTicket(ticket);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Autonomous Verification Routing Explanation */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">CCS Official Verification & Version Lock</h3>
            <p className="text-xs text-slate-400">Locks CV version and routes to placement office for cross-verification against GLIM master records</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
          <div className="flex items-center space-x-2 text-indigo-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Autonomous Verification Cross-Check Engine</span>
          </div>
          <p>
            When you mark your CV as <strong>Ready for Submission</strong>, the system runs an automated rules-based audit comparing claimed CGPA, certifications, and prior employment against your official locked <strong>GLIM Master Student Record</strong>. Clean submissions are queued for standard approval, while discrepancies trigger high-priority CCS review alerts.
          </p>
        </div>
      </div>

      {/* Pre-submission Verification Audit Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Claimed Data vs Ground Truth Check */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ground-Truth Pre-Check Summary</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400">Claimed CGPA:</span>
                <span className="font-mono font-bold text-white ml-2">{activeCvPreset.cgpa_claimed}</span>
              </div>
              <div>
                <span className="text-slate-400">Master Record:</span>
                <span className="font-mono font-bold text-emerald-400 ml-2">{activeStudentMaster.cgpa}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                Math.abs(activeCvPreset.cgpa_claimed - activeStudentMaster.cgpa) < 0.05
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}>
                {Math.abs(activeCvPreset.cgpa_claimed - activeStudentMaster.cgpa) < 0.05 ? 'MATCH' : 'MISMATCH'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-medium">Claimed Certifications Audit:</span>
              <div className="space-y-1">
                {activeCvPreset.claimed_certifications.map((c, i) => {
                  const verified = activeStudentMaster.verified_certifications.some(vc => vc.name.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(vc.name.toLowerCase()));
                  return (
                    <div key={i} className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-200">{c}</span>
                      <span className={`px-1.5 py-0.5 rounded ${verified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {verified ? '✓ Verified' : '⚠️ Unverified'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {currentVerificationCheck && currentVerificationCheck.discrepancyCount > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Discrepancy Warning ({currentVerificationCheck.discrepancyCount} Flags)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Submitting this CV will auto-flag a <strong>HIGH DISCREPANCY TICKET</strong> to the CCS Admin Console review queue.
              </p>
            </div>
          )}
        </div>

        {/* Lock & Submit Action Box */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Submit to Placement Queue</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lock this CV version for <strong>{activeJd.company} ({activeJd.role})</strong> placement drive. Submission generates an immutable audit record.
            </p>

            {existingTicket || submittedTicket ? (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Ticket Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    (existingTicket || submittedTicket).verificationState === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    (existingTicket || submittedTicket).verificationState === 'CHANGES_REQUESTED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {(existingTicket || submittedTicket).verificationState}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Ticket ID: {(existingTicket || submittedTicket).ticket_id} | Version: {(existingTicket || submittedTicket).version_id}
                </div>
                {(existingTicket || submittedTicket).reviewerComments && (
                  <p className="text-xs text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-500/30 mt-2">
                    Reviewer Note: "{(existingTicket || submittedTicket).reviewerComments}"
                  </p>
                )}
              </div>
            ) : null}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleLockAndSubmit}
              disabled={Boolean(submittedTicket)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submittedTicket ? 'CV Locked & Submitted to CCS' : 'Lock CV & Submit to CCS Queue'}</span>
            </button>

            <button
              onClick={() => setCurrentRole('ccs')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Switch to CCS Admin View to Inspect Ticket Queue</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
