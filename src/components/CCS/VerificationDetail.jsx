import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, ArrowLeft, MessageSquare, FileText, UserCheck, Award } from 'lucide-react';

export default function VerificationDetail({ ticket, onBack }) {
  const { handleCcsDecision, activeStudentMaster } = useApp();
  const [comment, setComment] = useState(ticket.reviewerComments || '');
  const [decisionApplied, setDecisionApplied] = useState(null);

  if (!ticket) return null;

  const onApplyDecision = (type) => {
    handleCcsDecision(ticket.ticket_id, type, comment);
    setDecisionApplied(type);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Review Queue</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Ticket ID: <strong className="text-indigo-400">{ticket.ticket_id}</strong></span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            ticket.riskLevel === 'HIGH' ? 'badge-discrepancy-high' : 'badge-clean'
          }`}>
            {ticket.riskLevel === 'HIGH' ? 'FLAGGED HIGH DISCREPANCY' : 'CLEAN AUTO-PASS'}
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Student Submitted CV Data */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-400">
            <FileText className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Student CV Claimed Data</h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-white text-sm">{ticket.studentName}</div>
            <div className="text-slate-400 font-mono">{ticket.student_id} • {ticket.program}</div>
            <div className="pt-2 border-t border-slate-800 flex justify-between">
              <span className="text-slate-400">Claimed CGPA:</span>
              <span className="font-mono font-bold text-white text-sm">{ticket.cgpa_claimed}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">CV Document Content:</span>
            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-96 overflow-y-auto leading-relaxed whitespace-pre-wrap">
              {ticket.cvText}
            </div>
          </div>
        </div>

        {/* Column 2: Ground-Truth GLIM Master Record & Discrepancies */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <UserCheck className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. GLIM Master Record</h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Verified CGPA:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{ticket.cgpa_master}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Academic Status:</span>
              <span className="text-emerald-300 font-semibold">Good Standing</span>
            </div>
          </div>

          {/* Discrepancy Findings Box */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Audit Engine Discrepancies:</span>
            {ticket.discrepancies.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                ✓ Ground-truth cross-check passed cleanly. No CGPA or certification discrepancies detected.
              </div>
            ) : (
              ticket.discrepancies.map((disc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-rose-300 font-bold">
                    <span>{disc.type}</span>
                    <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">{disc.risk}</span>
                  </div>
                  <div className="text-slate-300 font-mono text-[11px]">
                    Claimed: <span className="text-rose-300 font-bold">{disc.claimed}</span> vs Master: <span className="text-emerald-300 font-bold">{disc.groundTruth}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">{disc.detail}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: CCS Officer Decision Controls */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Award className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. CCS Official Decision</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reviewer Comments & Feedback for Student:</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Enter feedback notes or required CV revisions..."
              />
            </div>

            {decisionApplied && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Decision '{decisionApplied}' recorded in immutable audit log.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800">
            <button
              onClick={() => onApplyDecision('APPROVED')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve CV Verification</span>
            </button>

            <button
              onClick={() => onApplyDecision('CHANGES_REQUESTED')}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Request Revisions from Student</span>
            </button>

            <button
              onClick={() => onApplyDecision('REJECTED')}
              className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-rose-950/50 text-rose-400 border border-rose-900/50 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Claim</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
