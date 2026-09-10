import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import PMCharterModal from './components/PMCharterModal';
import StudentDashboard from './components/Student/StudentDashboard';
import AdminDashboard from './components/CCS/AdminDashboard';
import './index.css';

function MainAppContent() {
  const { currentRole } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)' }}>
      <Header />

      <main style={{ flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {currentRole === 'student' ? <StudentDashboard /> : <AdminDashboard />}
      </main>

      <PMCharterModal />

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: 11,
        color: 'var(--stone-600)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.04em'
      }}>
        PROJECT TAILOR • GLIM Career Services & CV Verification Engine • PM Course Presentation
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
