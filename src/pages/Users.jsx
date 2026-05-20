import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

const ROLE_LV   = { student: 'Skolēns', teacher: 'Skolotājs', admin: 'Administrators' };
const ROLE_COLOR = {
  student: { background: '#dbeafe', color: '#1e40af' },
  teacher: { background: '#dcfce7', color: '#166534' },
  admin:   { background: '#fae8ff', color: '#7e22ce' },
};

export default function Users() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then((r) => { setUsers(r.data); setLoading(false); });
  }, []);

  const changeRole = async (id, role) => {
    const { data } = await api.patch(`/users/${id}/role`, { role });
    setUsers((prev) => prev.map((u) => (u.id === id ? data : u)));
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Dzēst lietotāju "${name}"?`)) return;
    await api.delete(`/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const counts = {
    student: users.filter((u) => u.role === 'student').length,
    teacher: users.filter((u) => u.role === 'teacher').length,
    admin:   users.filter((u) => u.role === 'admin').length,
  };

  return (
    <Layout title="Lietotāju pārvaldība">
      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([role, n]) => (
          <span key={role} style={{
            ...ROLE_COLOR[role],
            borderRadius: 20, padding: '4px 14px',
            fontWeight: 600, fontSize: '0.88rem',
          }}>
            {ROLE_LV[role]}: {n}
          </span>
        ))}
      </div>

      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && <div className="muted" style={{ padding: 18 }}>Ielādē...</div>}
        {!loading && users.length === 0 && <div className="muted" style={{ padding: 18 }}>Nav lietotāju.</div>}
        {!loading && users.map((u, i) => (
          <div key={u.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 18px',
            borderBottom: i < users.length - 1 ? '1px solid #f1f5f9' : 'none',
            flexWrap: 'wrap',
          }}>
            {/* Avatar circle */}
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: ROLE_COLOR[u.role]?.background || '#f1f5f9',
              color: ROLE_COLOR[u.role]?.color || '#374151',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.95rem', flexShrink: 0,
            }}>
              {u.full_name?.[0]?.toUpperCase() || '?'}
            </div>

            {/* Name + email */}
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{u.full_name}</div>
              <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>@{u.username} · {u.email}</div>
            </div>

            {/* Joined date */}
            <div className="muted" style={{ fontSize: '0.8rem', minWidth: 90 }}>
              {new Date(u.created_at).toLocaleDateString('lv-LV')}
            </div>

            {/* Role dropdown */}
            <select
              value={u.role}
              onChange={(e) => changeRole(u.id, e.target.value)}
              style={{
                padding: '5px 8px', fontSize: '0.85rem', borderRadius: 8,
                border: '1px solid #e5e7eb', background: '#f8fafc', width: 'auto',
              }}
            >
              <option value="student">Skolēns</option>
              <option value="teacher">Skolotājs</option>
              <option value="admin">Administrators</option>
            </select>

            {/* Delete */}
            <button
              className="btnDanger btnSmall"
              onClick={() => deleteUser(u.id, u.full_name)}
            >
              Dzēst
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
