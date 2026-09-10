import React from 'react';
import { BarChart3, TrendingUp, Users, AlertCircle, Award } from 'lucide-react';

export default function CohortAnalytics() {
  const skillGaps = [
    { skill: "SQL & Query Optimization", gapPercentage: 42, count: "420 Students", category: "Data Analytics", priority: "High" },
    { skill: "PRD & Product Backlog Writing", gapPercentage: 38, count: "380 Students", category: "Product", priority: "High" },
    { skill: "MECE Strategic Frameworks", gapPercentage: 35, count: "350 Students", category: "Consulting", priority: "Medium" },
    { skill: "AWS Cloud Fundamentals", gapPercentage: 29, count: "290 Students", category: "Tech", priority: "Medium" },
    { skill: "DCF & Valuation Modeling", gapPercentage: 24, count: "240 Students", category: "Finance", priority: "Medium" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Cohort Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total PGDM Cohort Size</span>
          <div className="text-2xl font-bold text-white font-mono">1,000 Students</div>
          <p className="text-[11px] text-slate-500">PGDM 2026-28 Placement Batch</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Verified CV Submissions</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">842 / 1,000</div>
          <p className="text-[11px] text-slate-500">84.2% Cohort Adoption Rate</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Discrepancy Auto-Flag Rate</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">4.8%</div>
          <p className="text-[11px] text-slate-500">48 tickets flagged for review</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Avg CCS Review Touch Time</span>
          <div className="text-2xl font-bold text-indigo-400 font-mono">4.2 Minutes</div>
          <p className="text-[11px] text-slate-500">Reduced from 14.5 min baseline</p>
        </div>
      </div>

      {/* Cohort Skill Gap Aggregate Heatmap */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cohort Skill-Gap Aggregate Heatmap</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Live Recruiter Match Data</span>
        </div>

        <div className="space-y-3">
          {skillGaps.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{item.skill}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                    {item.category}
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-400">{item.count} ({item.gapPercentage}%)</span>
              </div>

              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                  style={{ width: `${item.gapPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
