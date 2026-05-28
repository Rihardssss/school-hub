import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Announcements() {
  const { user } = useAuth();
  const canManage = user?.role === 'teacher' || user?.role === 'admin';

  const [items,    setItems]    = useState([]);
  const [title,    setTitle]    = useState('');
  const [content,  setContent]  = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    api.get('/announcements').then((r) => setItems(r.data));
  }, []);

  const add = async () => {
    setError('');
    if (!title.trim() || !content.trim()) { setError('Aizpildi visus laukus.'); return; }
    const { data } = await api.post('/announcements', {
      title: title.trim(),
      content: content.trim(),
      is_pinned: isPinned,
    });
    setItems((prev) => [data, ...prev]);
    setTitle('');
    setContent('');
    setIsPinned(false);
  };

  const remove = async (id) => {
    await api.delete(`/announcements/${id}`);
    setItems((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <Layout title="Paziņojumi">
      {}
      {canManage && (
        <div className="panel stack">
          <input
            placeholder="Virsraksts"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="textArea"
            placeholder="Saturs..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' }}>
              <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
              Piespraust paziņojumu
            </label>
            {error && <span style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{error}</span>}
            <button className="btnPrimary" style={{ marginLeft: 'auto' }} onClick={add}>Publicēt</button>
          </div>
        </div>
      )}

      <div className="panel stack" style={{ marginTop: 8 }}>
        {items.length === 0 && <div className="muted">Nav neviena paziņojuma.</div>}
        {items.map((a) => (
          <div key={a.id} className="listItem" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {a.is_pinned && <span style={{ color: '#f59e0b', fontWeight: 700 }}>📌</span>}
                <strong>{a.title}</strong>
              </div>
              {}
              {canManage && (user?.role === 'admin' || a.author_id === user?.id) && (
                <button className="btnDanger btnSmall" onClick={() => remove(a.id)}>Dzēst</button>
              )}
            </div>
            <div style={{ color: '#374151', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{a.content}</div>
            <div className="muted" style={{ fontSize: '0.8rem' }}>
              {new Date(a.created_at).toLocaleDateString('lv-LV')}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
