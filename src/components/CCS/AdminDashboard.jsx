import React, { useState } from 'react';
import ReviewQueue from './ReviewQueue';
import VerificationDetail from './VerificationDetail';
import CohortAnalytics from './CohortAnalytics';
import AuditLog from './AuditLog';
import { ShieldAlert, BarChart3, ShieldCheck } from 'lucide-react';

const TABS = [
  { id: 'queue', label: 'Verification Queue', icon: ShieldAlert },
  { id: 'analytics', label: 'Cohort Analytics', icon: BarChart3 },
  { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
];

export default function AdminDashboard() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('queue');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Tab Nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12,
        flexWrap: 'wrap', gap: 8,
      }}>
        <div className="tab-group" style={{ width: 'auto' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id && !selectedTicket ? 'active' : ''}`}
              onClick={() => { setSelectedTicket(null); setActiveTab(tab.id); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11, color: 'var(--teal-400)', fontFamily: 'var(--font-mono)' }}>
          CCS Operations Console
        </span>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {selectedTicket ? (
          <VerificationDetail ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />
        ) : (
          <>
            {activeTab === 'queue' && <ReviewQueue onSelectTicket={t => setSelectedTicket(t)} />}
            {activeTab === 'analytics' && <CohortAnalytics />}
            {activeTab === 'audit' && <AuditLog />}
          </>
        )}
      </div>
    </div>
  );
}
