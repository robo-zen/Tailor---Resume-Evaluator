import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Calendar, CheckSquare, Zap, Target, BookOpen, AlertTriangle } from 'lucide-react';

export default function ActionPlan() {
  const { actionPlan, daysRemaining, setDaysRemaining } = useApp();

  if (!actionPlan) return null;

  return (
    <div className="space-y-6">
      
      {/* Dynamic Slider Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Time-Boxed Placement Action Plan</h3>
            </div>
            <p className="text-xs text-slate-400">Dynamically adapts strategy based on days remaining until interview drive</p>
          </div>

          {/* Mode Indicator Badge */}
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
            daysRemaining <= 4
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 glow-rose'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 glow-emerald'
          }`}>
            {daysRemaining <= 4 ? '⚡ Sprint / Narrative Path (<= 4 Days)' : '🎓 Certification & Skill Path (7+ Days)'}
          </span>
        </div>

        {/* Days Slider */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">Select Days Remaining Until Placement Drive:</span>
            <span className="font-mono font-extrabold text-lg text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
              {daysRemaining} Days
            </span>
          </div>

          <input
            type="range"
            min="2"
            max="30"
            step="1"
            value={daysRemaining}
            onChange={(e) => setDaysRemaining(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>2 Days (Immediate Sprint)</span>
            <span>7 Days (Standard Prep)</span>
            <span>14 Days (Certification Window)</span>
            <span>30 Days (Full Upskilling)</span>
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tailored Action Checklist ({actionPlan.totalSteps} Actionable Tasks)</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Total Est: {actionPlan.estimatedHours}</span>
        </div>

        <div className="space-y-3">
          {actionPlan.actionItems.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-mono text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    item.impact === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    item.impact === 'High' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.impact} Impact
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-7">{item.description}</p>
              </div>

              <div className="flex items-center space-x-3 pl-7 md:pl-0 shrink-0">
                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                  {item.timeframe}
                </span>
                <button
                  onClick={() => alert(`Marked task "${item.title}" as complete!`)}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white transition-colors"
                >
                  Mark Done
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
