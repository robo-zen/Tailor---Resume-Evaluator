import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Clock, User, Cpu, Database } from 'lucide-react';

export default function AuditLog() {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Immutable Verification Audit Log Trail</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">DPDP Act 2023 Compliant Ledger</span>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="space-y-1 divide-y divide-slate-800/60 p-2">
          {auditLogs.map((log) => (
            <div key={log.log_id} className="p-3.5 hover:bg-slate-900/60 transition-colors rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[11px] font-bold text-indigo-400">{log.log_id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.actor.includes('SYSTEM') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {log.actor}
                  </span>
                  <span className="font-bold text-white">{log.action}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] pl-2 border-l-2 border-slate-700 leading-relaxed">
                {log.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
