import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck, AlertTriangle, CheckCircle, HelpCircle, BarChart2 } from 'lucide-react';

export default function ATSCheck() {
  const { atsAudit } = useApp();

  if (!atsAudit) return null;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: ATS Score overview */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        <div className="flex items-center space-x-4 md:border-r border-slate-800 pr-4">
          <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-heading font-extrabold text-2xl shadow-xl ${
            atsAudit.atsScore >= 85 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' :
            atsAudit.atsScore >= 70 ? 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10' : 'text-rose-400 border-rose-500/40 bg-rose-500/10'
          }`}>
            <span>{atsAudit.atsScore}</span>
            <span className="text-[10px] font-sans font-medium uppercase text-slate-400 mt-0.5">ATS SCORE</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">ATS Compliance & Parsing</h3>
            <p className="text-xs text-slate-400">{atsAudit.status}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                {atsAudit.metricCount} Quantified Metrics Found
              </span>
            </div>
          </div>
        </div>

        {/* ATS Compliance Checklist Summary */}
        <div className="space-y-2 col-span-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ATS Parseability Indicators</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Contact Header</span>
              <div className="flex items-center space-x-1 font-bold text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Standard Layout</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Metric Density</span>
              <div className={`flex items-center space-x-1 font-bold ${atsAudit.metricCount >= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                <BarChart2 className="w-4 h-4" />
                <span>{atsAudit.metricCount} Metrics</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Column & Table Check</span>
              <div className="flex items-center space-x-1 font-bold text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Clean Single-Column</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Formatting & Parsing Audit Findings */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">ATS Audit Findings ({atsAudit.issues.length} Issues Flagged)</h3>
          </div>
        </div>

        {atsAudit.issues.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Excellent! No ATS parsing issues or formatting risks detected. CV is optimized for automated recruiter screening engines.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {atsAudit.issues.map((issue, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      issue.severity === 'High' ? 'text-rose-400' : 'text-amber-400'
                    }`} />
                    <h4 className="text-xs font-bold text-white">{issue.rule}</h4>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    issue.severity === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {issue.severity} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">{issue.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
