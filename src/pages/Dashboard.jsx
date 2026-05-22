import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const CARDS = [
  { key: 'homework_total',     label: 'Mājasdarbi kopā',      icon: 'Σ', color: '#2457d6' },
  { key: 'homework_pending',   label: 'Nepaveiktie',          icon: '!', color: '#c77700' },
  { key: 'homework_done',      label: 'Paveiktie',            icon: '✓', color: '#168650' },
  { key: 'homework_due_today', label: 'Termiņš šodien',       icon: 'D', color: '#d4475f' },
  { key: 'unread_messages',    label: 'Neizlasītas vēstules', icon: '@', color: '#0f9f8f' },
  { key: 'todays_lessons',     label: 'Stundas šodien',       icon: '◷', color: '#5c35a8' },
  { key: 'subjects_total',     label: 'Priekšmeti',           icon: '§', color: '#087a90' },
];

const QUICK = [
  { to: '/homework',      label: 'Mājasdarbi',  icon: '✓' },
  { to: '/schedule',      label: 'Saraksts',    icon: '◷' },
  { to: '/announcements', label: 'Paziņojumi',  icon: '!' },
  { to: '/messages',      label: 'Vēstules',    icon: '@' },
  { to: '/profile',       label: 'Profils',     icon: 'ID' },
];

const ROLE_TITLE = { student: 'Skolēna panelis', teacher: 'Skolotāja panelis', admin: 'Administratora panelis' };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const welcomeName = user?.full_name?.split(' ')[0] || user?.username || 'tur';

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => setStats(r.data));
  }, []);

  return (
    <Layout title={ROLE_TITLE[user?.role] || 'Panelis'}>
      {!stats && (
        <div className="grid3">
          {CARDS.map(({ key }) => (
            <div key={key} className="statCard statSkeleton" />
          ))}
        </div>
      )}

      {stats && (
        <>
          <section className="dashboardHero">
            <div>
              <h2>Sveiks, {welcomeName}</h2>
              <p>
                Šeit ir šodienas mācību ritms, neatbildētās vēstules un uzdevumi,
                kuriem vērts pievērst uzmanību vispirms.
              </p>
            </div>
            <div className="heroMetric">
              <span>Šodien plānā</span>
              <strong>{stats.todays_lessons || 0}</strong>
              <span>stundas</span>
            </div>
          </section>

          <div className="grid3">
            {CARDS.map(({ key, label, icon, color }) => (
              <div key={key} className="statCard" style={{ borderTop: `3px solid ${color}` }}>
                <div className="statTop">
                  <span className="statLabel">{label}</span>
                  <span className="statIcon" style={{ color, background: `${color}18` }}>{icon}</span>
                </div>
                <span className="value" style={{ color }}>{stats[key]}</span>
              </div>
            ))}
          </div>

          <div className="panel stack" style={{ marginTop: 14 }}>
            <h2>Ātrās darbības</h2>
            <div className="quickActions">
              {QUICK.map(({ to, label, icon }) => (
                <Link key={to} to={to} className="quickLink">
                  <span className="quickLinkIcon">{icon}</span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
