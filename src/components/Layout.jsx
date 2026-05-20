import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard',     label: 'Panelis' },
  { to: '/homework',      label: 'Mājasdarbi' },
  { to: '/schedule',      label: 'Saraksts' },
  { to: '/announcements', label: 'Paziņojumi' },
  { to: '/messages',      label: 'Vēstules' },
  { to: '/profile',       label: 'Profils' },
];

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        <div className="sidebarFooter">
          <div className="sidebarUser">{user?.full_name || user?.username || 'Lietotājs'}</div>
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
