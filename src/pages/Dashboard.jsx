import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const CARDS = [
  { key: 'homework_total',     label: 'Mājasdarbi kopā',      icon: '📚', color: '#6366f1' },
  { key: 'homework_pending',   label: 'Nepaveiktie',           icon: '⏳', color: '#f59e0b' },
  { key: 'homework_done',      label: 'Paveiktie',             icon: '✅', color: '#10b981' },
  { key: 'homework_due_today', label: 'Termiņš šodien',        icon: '🔥', color: '#ef4444' },
  { key: 'unread_messages',    label: 'Neizlasītas vēstules',  icon: '✉️', color: '#3b82f6' },
  { key: 'todays_lessons',     label: 'Stundas šodien',        icon: '🏫', color: '#8b5cf6' },
  { key: 'subjects_total',     label: 'Priekšmeti',            icon: '🎓', color: '#0ea5e9' },
];

const QUICK = [
  { to: '/homework',      label: '📚 Mājasdarbi',   cls: 'btnPrimary' },
  { to: '/schedule',      label: '📅 Saraksts',     cls: 'btnGhost'   },
  { to: '/announcements', label: '📢 Paziņojumi',   cls: 'btnGhost'   },
  { to: '/messages',      label: '✉️ Vēstules',     cls: 'btnGhost'   },
  { to: '/profile',       label: '👤 Profils',       cls: 'btnGhost'   },
];

const ROLE_TITLE = { student: 'Skolēna panelis', teacher: 'Skolotāja panelis', admin: 'Administratora panelis' };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => setStats(r.data));
  }, []);

  return (
    <Layout title={ROLE_TITLE[user?.role] || 'Panelis'}>
      {!stats && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {CARDS.map(({ key }) => (
            <div key={key} className="statCard" style={{ flex: '1 1 160px', minHeight: 80, background: '#f1f5f9' }} />
          ))}
        </div>
      )}

      {stats && (
        <>
          <div className="grid3">
            {CARDS.map(({ key, label, icon, color }) => (
              <div key={key} className="statCard" style={{ borderLeft: `4px solid ${color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="muted" style={{ fontSize: '0.85rem' }}>{label}</span>
                  <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                </div>
                <span className="value" style={{ color }}>{stats[key]}</span>
              </div>
            ))}
          </div>

          <div className="panel stack" style={{ marginTop: 14 }}>
            <h2>⚡ Ātrās darbības</h2>
            <div className="quickActions">
              {QUICK.map(({ to, label, cls }) => (
                <Link key={to} to={to} className={cls}
                  style={{ textDecoration: 'none', textAlign: 'center' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
