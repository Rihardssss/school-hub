import { useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [fullName,  setFullName]  = useState(user?.full_name  || '');
  const [username,  setUsername]  = useState(user?.username   || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [msg,   setMsg]   = useState('');
  const [error, setError] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const { data } = await api.put('/users/me', {
        full_name:  fullName  || undefined,
        username:   username  || undefined,
        avatar_url: avatarUrl || undefined,
      });
      updateUser(data);
      setMsg('Profils saglabāts!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Neizdevās saglabāt.');
    }
  };

  const ROLE_LV = { student: 'Skolēns', teacher: 'Skolotājs', admin: 'Administrators' };

  return (
    <Layout title="Mans profils">
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

        {/* Info card */}
        <div className="card">
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              alt="Avatārs"
              style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }}
            />
          )}
          <div>
            <div className="muted" style={{ fontSize: '0.82rem' }}>Pilnais vārds</div>
            <div style={{ fontWeight: 600 }}>{user?.full_name}</div>
          </div>
          <div>
            <div className="muted" style={{ fontSize: '0.82rem' }}>Lietotājvārds</div>
            <div>@{user?.username}</div>
          </div>
          <div>
            <div className="muted" style={{ fontSize: '0.82rem' }}>E-pasts</div>
            <div>{user?.email}</div>
          </div>
          <div>
            <div className="muted" style={{ fontSize: '0.82rem' }}>Loma</div>
            <span style={{
              display: 'inline-block', padding: '2px 10px', borderRadius: 20,
              background: '#dbeafe', color: '#1e40af', fontWeight: 600, fontSize: '0.85rem',
            }}>
              {ROLE_LV[user?.role] || user?.role}
            </span>
          </div>
          <div>
            <div className="muted" style={{ fontSize: '0.82rem' }}>Reģistrēts</div>
            <div>{user?.created_at ? new Date(user.created_at).toLocaleDateString('lv-LV') : '-'}</div>
          </div>
        </div>

        {/* Edit form */}
        <form className="card" onSubmit={save}>
          <h2>Rediģēt profilu</h2>

          <label style={{ fontSize: '0.85rem', color: '#374151' }}>Pilnais vārds</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} />

          <label style={{ fontSize: '0.85rem', color: '#374151' }}>Lietotājvārds</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />

          <label style={{ fontSize: '0.85rem', color: '#374151' }}>Avatāra URL</label>
          <input placeholder="https://example.com/photo.jpg" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />

          {msg   && <div style={{ color: '#166534', background: '#dcfce7', borderRadius: 8, padding: '8px 12px' }}>{msg}</div>}
          {error && <div className="errorText">{error}</div>}

          <button className="btnPrimary" type="submit">Saglabāt izmaiņas</button>
        </form>
      </div>
    </Layout>
  );
}
