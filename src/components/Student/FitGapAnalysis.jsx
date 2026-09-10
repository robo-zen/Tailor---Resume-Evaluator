import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, CheckCircle2, AlertCircle, Target, TrendingUp, Layers } from 'lucide-react';

export default function FitGapAnalysis() {
  const { analysisReport, activeJd } = useApp();

  if (!analysisReport) return null;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10';
    return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Fit Score Overview */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Overall Score Gauge */}
        <div className="flex items-center space-x-4 md:border-r border-slate-800 pr-4">
          <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-heading font-extrabold text-2xl shadow-xl ${getScoreColor(analysisReport.overallFitScore)}`}>
            <span>{analysisReport.overallFitScore}%</span>
            <span className="text-[10px] font-sans font-medium uppercase text-slate-400 mt-0.5">FIT MATCH</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Target Role Fit Score</h3>
            <p className="text-xs text-slate-400">{activeJd.company} — {activeJd.role}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {analysisReport.keywordMatchRatio}% Keyword Match
              </span>
            </div>
          </div>
        </div>

        {/* Category Breakdown Bars */}
        <div className="space-y-2 col-span-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dimension Score Breakdown</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysisReport.categories.map((cat, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                  <span className="font-mono font-bold text-indigo-400">{cat.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Strengths vs Critical Gaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Core Strengths */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Identified Core Strengths</h3>
          </div>

          <div className="space-y-3">
            {analysisReport.strengths.map((str, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-300">{str.title}</h4>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {str.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{str.detail}</p>
              </div>
            ))}
          </div>

          {/* Matched Keywords Pills */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Matched JD Keywords:</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {analysisReport.matchedKeywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Critical Skill Gaps */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 space-y-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Critical Skill & Keyword Gaps</h3>
          </div>

          <div className="space-y-3">
            {analysisReport.gaps.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                No major skill gaps identified! CV has exceptional keyword alignment with target JD.
              </div>
            ) : (
              analysisReport.gaps.map((gap) => (
                <div key={gap.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{gap.skill}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      gap.priority === 'Critical Gap' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {gap.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{gap.recommendation}</p>
                </div>
              ))
            )}
          </div>

          {/* Missing Keywords Pills */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Missing Keywords to Add:</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {analysisReport.missingKeywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                  + {kw}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
