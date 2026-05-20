import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const [tab,      setTab]      = useState('inbox'); // 'inbox' | 'sent'
  const [messages, setMessages] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [activeId, setActiveId] = useState(null);

  // Compose form
  const [recipientId, setRecipientId] = useState('');
  const [subject,     setSubject]     = useState('');
  const [body,        setBody]        = useState('');
  const [error,       setError]       = useState('');

  // Fetch other users once
  useEffect(() => {
    api.get('/users').then((r) => {
      const others = r.data.filter((u) => u.id !== user?.id);
      setUsers(others);
      if (others.length > 0) setRecipientId(others[0].id);
    });
  }, [user]);

  // Reload messages when tab changes
  useEffect(() => { loadMessages(); }, [tab]);

  async function loadMessages() {
    const { data } = await api.get(tab === 'inbox' ? '/messages/inbox' : '/messages/sent');
    setMessages(data);
    setActiveId(data[0]?.id || null);
  }

  const active = messages.find((m) => m.id === activeId) || null;
  const unread = messages.filter((m) => !m.is_read).length;

  const openMessage = async (id) => {
    setActiveId(id);
    const msg = messages.find((m) => m.id === id);
    if (tab === 'inbox' && msg && !msg.is_read) {
      await api.patch(`/messages/${id}/read`);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
    }
  };

  const send = async () => {
    setError('');
    if (!subject.trim() || !body.trim() || !recipientId) { setError('Aizpildi visus laukus.'); return; }
    try {
      const { data } = await api.post('/messages', {
        recipient_id: recipientId,
        subject: subject.trim(),
        body: body.trim(),
      });
      setSubject('');
      setBody('');
      if (tab === 'sent') setMessages((prev) => [data, ...prev]);
      else setError('');
      alert('Vēstule nosūtīta!');
    } catch (e) {
      setError(e.response?.data?.detail || 'Neizdevās nosūtīt.');
    }
  };

  const remove = async (id) => {
    await api.delete(`/messages/${id}`);
    setMessages((prev) => {
      const next = prev.filter((m) => m.id !== id);
      if (activeId === id) setActiveId(next[0]?.id || null);
      return next;
    });
  };

  const displayName = (userId) => {
    if (userId === user?.id) return 'Tu';
    const u = users.find((u) => u.id === userId);
    return u ? `${u.full_name} (@${u.username})` : userId?.slice(0, 8);
  };

  return (
    <Layout title="Vēstules">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className={tab === 'inbox' ? 'btnPrimary' : 'btnGhost'} onClick={() => setTab('inbox')}>
          Ienākošās{tab === 'inbox' && unread > 0 ? ` (${unread})` : ''}
        </button>
        <button className={tab === 'sent' ? 'btnPrimary' : 'btnGhost'} onClick={() => setTab('sent')}>
          Nosūtītās
        </button>
      </div>

      {/* Mail split view */}
      <div className="mailLayout">
        <div className="panel stack" style={{ overflowY: 'auto', maxHeight: 420 }}>
          {messages.length === 0 && <div className="muted">Nav vēstuļu.</div>}
          {messages.map((m) => (
            <button
              key={m.id}
              className={`mailItem${m.id === activeId ? ' activeMail' : ''}`}
              onClick={() => openMessage(m.id)}
            >
              <div className="mailTop">
                <strong style={{ fontSize: '0.9rem' }}>
                  {tab === 'inbox' ? displayName(m.sender_id) : displayName(m.recipient_id)}
                </strong>
                {tab === 'inbox' && !m.is_read && <span className="unreadDot" />}
              </div>
              <div style={{ fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#6b7280' }}>
                {m.subject}
              </div>
            </button>
          ))}
        </div>

        <div className="panel stack">
          {!active && <div className="muted">Izvēlies vēstuli.</div>}
          {active && (
            <>
              <div><strong>Tēma:</strong> {active.subject}</div>
              <div><strong>No:</strong> {displayName(active.sender_id)}</div>
              <div><strong>Kam:</strong> {displayName(active.recipient_id)}</div>
              <div className="muted" style={{ fontSize: '0.8rem' }}>
                {new Date(active.created_at).toLocaleString('lv-LV')}
              </div>
              <div className="mailBody">{active.body}</div>
              <div className="actionsRow">
                <button className="btnDanger btnSmall" onClick={() => remove(active.id)}>Dzēst vēstuli</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Compose */}
      <div className="panel stack" style={{ marginTop: 12 }}>
        <h2>Jauna vēstule</h2>
        {error && <div className="errorText">{error}</div>}
        <select value={recipientId} onChange={(e) => setRecipientId(e.target.value)}>
          {users.length === 0
            ? <option value="">Nav citu lietotāju</option>
            : users.map((u) => <option key={u.id} value={u.id}>{u.full_name} (@{u.username})</option>)
          }
        </select>
        <input
          placeholder="Temats"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className="textArea"
          placeholder="Vēstules teksts..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button className="btnPrimary" style={{ alignSelf: 'flex-start' }} onClick={send}>
          Nosūtīt
        </button>
      </div>
    </Layout>
  );
}
