import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard',     label: '🏠 Panelis'      },
  { to: '/homework',      label: '📚 Mājasdarbi'   },
  { to: '/schedule',      label: '📅 Saraksts'     },
  { to: '/announcements', label: '📢 Paziņojumi'   },
  { to: '/messages',      label: '✉️  Vēstules'     },
  { to: '/profile',       label: '👤 Profils'       },
];

const ROLE_LV = { student: 'Skolēns', teacher: 'Skolotājs', admin: 'Administrators' };
const ROLE_BADGE = {
  student: { background: '#1e40af22', color: '#93c5fd' },
  teacher: { background: '#16653422', color: '#86efac' },
  admin:   { background: '#7e22ce22', color: '#d8b4fe' },
};

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="appShell">
      <nav className="sidebar">
        <div className="sidebarLogo">SchoolHub</div>

        {NAV.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `navLink${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}

        {/* Admin-only link */}
        {user?.role === 'admin' && (
          <NavLink
            to="/users"
            className={({ isActive }) => `navLink${isActive ? ' active' : ''}`}
          >
            ⚙️ Lietotāji
          </NavLink>
        )}

        <div className="sidebarFooter">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="sidebarUser">{user?.full_name || user?.username}</div>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, borderRadius: 10,
              padding: '1px 8px', alignSelf: 'flex-start',
              ...(ROLE_BADGE[user?.role] || ROLE_BADGE.student),
            }}>
              {ROLE_LV[user?.role] || user?.role}
            </span>
          </div>
          <button className="btnDanger btnSmall" onClick={handleLogout}>Iziet</button>
        </div>
      </nav>

      <main className="mainContent">
        {title && <h1 className="pageTitle">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
