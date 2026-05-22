import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard',     label: 'Panelis',     icon: '⌂' },
  { to: '/homework',      label: 'Mājasdarbi',  icon: '✓' },
  { to: '/schedule',      label: 'Saraksts',    icon: '◷' },
  { to: '/announcements', label: 'Paziņojumi',  icon: '!' },
  { to: '/messages',      label: 'Vēstules',    icon: '@' },
  { to: '/profile',       label: 'Profils',     icon: 'ID' },
];

const ROLE_LV = { student: 'Skolēns', teacher: 'Skolotājs', admin: 'Administrators' };

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const displayName = user?.full_name || user?.username || 'Lietotājs';
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const today = new Date().toLocaleDateString('lv-LV', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="appShell">
      <nav className="sidebar" aria-label="Galvenā navigācija">
        <div className="brandBlock">
          <div className="brandMark" aria-hidden="true">SH</div>
          <div>
            <div className="sidebarLogo">SchoolHub</div>
            <div className="sidebarTagline">Skolas darba telpa</div>
          </div>
        </div>

        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `navLink${isActive ? ' active' : ''}`}
          >
            <span className="navIcon" aria-hidden="true">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/users"
            className={({ isActive }) => `navLink${isActive ? ' active' : ''}`}
          >
            <span className="navIcon" aria-hidden="true">⚙</span>
            <span>Lietotāji</span>
          </NavLink>
        )}

        <div className="sidebarFooter">
          <div className="userPreview">
            <div className="userAvatar" aria-hidden="true">
              {user?.avatar_url ? <img src={user.avatar_url} alt="" /> : initials}
            </div>
            <div className="userMeta">
              <div className="sidebarUser">{displayName}</div>
              <span className={`roleBadge role-${user?.role || 'student'}`}>
              {ROLE_LV[user?.role] || 'Lietotājs'}
            </span>
            </div>
          </div>
          <button className="btnDanger btnSmall" onClick={handleLogout}>Iziet</button>
        </div>
      </nav>

      <main className="mainContent">
        <div className="contentFrame">
          {title && (
            <header className="pageHeader">
              <div>
                <div className="eyebrow">{today}</div>
                <h1 className="pageTitle">{title}</h1>
              </div>
              <div className="pageUserBadge">
                <span className={`roleDot role-${user?.role || 'student'}`} />
                {ROLE_LV[user?.role] || 'Lietotājs'}
              </div>
            </header>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
