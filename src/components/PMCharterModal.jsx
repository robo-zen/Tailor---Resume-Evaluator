import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Award, ShieldAlert, DollarSign, Calendar, CheckCircle2, FileText, BarChart, Users } from 'lucide-react';

export default function PMCharterModal() {
  const { pmModalOpen, setPmModalOpen } = useApp();

  if (!pmModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-2xl border border-indigo-500/30 overflow-hidden shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">Project TAILOR Governance & PM Charter</h3>
              <p className="text-xs text-slate-400">Project Management Course Case & Financial Business Case</p>
            </div>
          </div>
          <button
            onClick={() => setPmModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">

          {/* Key Executive Summary Box */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">PM Project Designation</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Authorized Charter v1.0
              </span>
            </div>
            <h4 className="text-base font-bold text-white">Tailored Automated Inspection & Placement Optimisation Engine</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Authorized by Director — Career Services (CCS) for the ~1,000-student PGDM cohort. Designed to eliminate manual resume audit bottlenecks, increase student JD alignment, and autonomously flag academic discrepancies against verified institutional master records.
            </p>
          </div>

          {/* Business Case ROI & Financial Metrics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Financial Business Case & ROI Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Approved Year 0 Build Budget</span>
                <div className="text-xl font-bold text-emerald-400 font-mono">₹4.2 Lakh</div>
                <p className="text-[11px] text-slate-500">Fixed cost ceiling (G0/G1 approved)</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Quantified Annual Benefit (B1)</span>
                <div className="text-xl font-bold text-indigo-400 font-mono">₹2.1 Lakh / Year</div>
                <p className="text-[11px] text-slate-500">Saved 10 min/review across ~2,500 reviews</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Target Payback Horizon</span>
                <div className="text-xl font-bold text-amber-400 font-mono">2.0 Years</div>
                <p className="text-[11px] text-slate-500">Excludes non-quantified accuracy benefits</p>
              </div>
            </div>
          </div>

          {/* Milestone Schedule */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              G0 – G3 Milestone Schedule
            </h4>
            <div className="space-y-2">
              {[
                { title: "G0/G1: Business Case & Charter Authorization", date: "Charter Date", status: "Completed" },
                { title: "G1 Baseline Time-Motion Study (CCS Reviewers)", date: "Charter Date + 4 Weeks", status: "Completed" },
                { title: "Core Platform Build Complete (4 Core Features)", date: "Charter Date + 12 Weeks", status: "Active Stage" },
                { title: "Shadow-Mode Verification Pilot (8-Week Audit Log)", date: "Charter Date + 13 Weeks", status: "Upcoming" },
                { title: "G3 Go/No-Go Approval for Autonomous Routing", date: "Charter Date + 21 Weeks", status: "Upcoming" },
                { title: "Full Institutional Go-Live (SIP Placement Cycle)", date: "Charter Date + 22 Weeks", status: "Target" }
              ].map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className={`w-4 h-4 ${m.status === 'Completed' ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className="font-medium text-slate-200">{m.title}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 font-mono text-[11px]">{m.date}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      m.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                      m.status === 'Active Stage' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & DPDP Governance */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>DPDP Act 2023 Compliance & Human Sign-off Policy</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              1. <strong>Consent & Privacy</strong>: Student data consent captured under DPDP Act 2023 before first analysis.<br/>
              2. <strong>No LLM Training Clause</strong>: Commercial LLM calls execute under strict contractual zero-training clauses.<br/>
              3. <strong>Human-in-the-Loop Safeguard</strong>: Autonomous system only flags and routes. No student submission can be rejected without final human sign-off by a CCS officer.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-400">
          <span>Sponsor: Director — CCS | PM Team: PGDM 2026-28</span>
          <button
            onClick={() => setPmModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            Close Charter Window
          </button>
        </div>

      </div>
    </div>
  );
}
