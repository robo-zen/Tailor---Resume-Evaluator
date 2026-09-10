import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle2, Clock, Filter, Eye, Search, ShieldAlert, ArrowUpDown } from 'lucide-react';

export default function ReviewQueue({ onSelectTicket }) {
  const { verificationTickets } = useApp();
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'FLAGGED' | 'CLEAN' | 'PENDING'
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = verificationTickets.filter(t => {
    if (filter === 'FLAGGED' && t.riskLevel !== 'HIGH' && t.riskLevel !== 'MEDIUM') return false;
    if (filter === 'CLEAN' && t.riskLevel !== 'CLEAN') return false;
    if (filter === 'PENDING' && t.verificationState !== 'UNDER_REVIEW') return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        t.studentName.toLowerCase().includes(term) ||
        t.student_id.toLowerCase().includes(term) ||
        t.targetJdTitle.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Queue Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name, ID, or job description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl pl-9 pr-4 py-2 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {['ALL', 'FLAGGED', 'CLEAN', 'PENDING'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Ticket ID & Student</th>
                <th className="px-4 py-3">Program & CGPA</th>
                <th className="px-4 py-3">Target Placement JD</th>
                <th className="px-4 py-3">Verification Risk Status</th>
                <th className="px-4 py-3">Review State</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No tickets match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.ticket_id}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => onSelectTicket(ticket)}
                  >
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[11px] text-indigo-400 font-bold">{ticket.ticket_id}</span>
                        <div>
                          <div className="text-white font-bold">{ticket.studentName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{ticket.student_id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div>{ticket.program}</div>
                      <div className="font-mono text-[11px]">
                        Claimed: <span className="text-slate-200 font-bold">{ticket.cgpa_claimed}</span> | Master: <span className="text-emerald-400 font-bold">{ticket.cgpa_master}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-200">
                      {ticket.targetJdTitle}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                        ticket.riskLevel === 'HIGH' ? 'badge-discrepancy-high glow-rose' :
                        ticket.riskLevel === 'MEDIUM' ? 'badge-discrepancy-medium' : 'badge-clean glow-emerald'
                      }`}>
                        {ticket.riskLevel === 'HIGH' && <ShieldAlert className="w-3 h-3 text-rose-400" />}
                        <span>{ticket.riskLevel === 'HIGH' ? 'FLAGGED HIGH DISCREPANCY' : ticket.riskLevel === 'MEDIUM' ? 'MEDIUM RISK' : 'CLEAN AUTO-PASS'}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ticket.verificationState === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        ticket.verificationState === 'CHANGES_REQUESTED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        ticket.verificationState === 'REJECTED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {ticket.verificationState}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket(ticket);
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center space-x-1 ml-auto transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Ticket</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
