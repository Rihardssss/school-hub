import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';

const CARDS = [
  { key: 'homework_total',    label: 'Mājasdarbi kopā' },
  { key: 'homework_pending',  label: 'Nepaveiktie' },
  { key: 'homework_done',     label: 'Paveiktie' },
  { key: 'homework_due_today',label: 'Termiņš šodien' },
  { key: 'unread_messages',   label: 'Neizlasītas vēstules' },
  { key: 'todays_lessons',    label: 'Stundas šodien' },
  { key: 'subjects_total',    label: 'Priekšmeti' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => setStats(r.data));
  }, []);

  return (
    <Layout title="Skolēna panelis">
      {!stats && <div className="muted">Ielādē...</div>}

      {stats && (
        <>
          <div className="grid3">
            {CARDS.map(({ key, label }) => (
              <div key={key} className="statCard">
                <span className="muted">{label}</span>
                <span className="value">{stats[key]}</span>
              </div>
            ))}
          </div>

          <div className="panel stack" style={{ marginTop: 14 }}>
            <h2>Ātrās darbības</h2>
            <div className="quickActions">
              {[
                { to: '/homework',      label: 'Mājasdarbi',    cls: 'btnPrimary' },
                { to: '/schedule',      label: 'Saraksts',      cls: 'btnGhost'   },
                { to: '/announcements', label: 'Paziņojumi',    cls: 'btnGhost'   },
                { to: '/messages',      label: 'Vēstules',      cls: 'btnGhost'   },
                { to: '/profile',       label: 'Profils',       cls: 'btnGhost'   },
              ].map(({ to, label, cls }) => (
                <Link key={to} to={to} className={cls} style={{ textDecoration: 'none', textAlign: 'center' }}>
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
