import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const STATUS_LV = { pending: 'Nepaveikts', submitted: 'Iesniegts', done: 'Pabeigts' };
const STATUS_STYLES = {
  pending:   { background: '#fef3c7', color: '#92400e' },
  submitted: { background: '#dbeafe', color: '#1e40af' },
  done:      { background: '#dcfce7', color: '#166534' },
};

export default function Homework() {
  const { user } = useAuth();
  const canManage = user?.role === 'teacher' || user?.role === 'admin';
  const [subjects, setSubjects] = useState([]);
  const [homework, setHomework] = useState([]);

  
  const [subjName,  setSubjName]  = useState('');
  const [subjColor, setSubjColor] = useState('#6366f1');

  
  const [hwSubjectId, setHwSubjectId] = useState('');
  const [hwTitle,     setHwTitle]     = useState('');
  const [hwDueDate,   setHwDueDate]   = useState('');

  useEffect(() => { reload(); }, []);

  
  useEffect(() => {
    if (subjects.length > 0 && !hwSubjectId) setHwSubjectId(subjects[0].id);
  }, [subjects, hwSubjectId]);

  async function reload() {
    const [s, h] = await Promise.all([api.get('/subjects'), api.get('/homework')]);
    setSubjects(s.data);
    setHomework(h.data);
  }

  const addSubject = async () => {
    if (!subjName.trim()) return;
    await api.post('/subjects', { name: subjName.trim(), color: subjColor });
    setSubjName('');
    reload();
  };

  const deleteSubject = async (id) => {
    await api.delete(`/subjects/${id}`);
    if (hwSubjectId === id) setHwSubjectId('');
    reload();
  };

  const addHomework = async () => {
    if (!hwSubjectId || !hwTitle.trim()) return;
    await api.post('/homework', {
      subject_id: hwSubjectId,
      title: hwTitle.trim(),
      due_date: hwDueDate || null,
    });
    setHwTitle('');
    setHwDueDate('');
    reload();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/homework/${id}`, { status });
    setHomework((prev) => prev.map((h) => (h.id === id ? { ...h, status } : h)));
  };

  const deleteHomework = async (id) => {
    await api.delete(`/homework/${id}`);
    setHomework((prev) => prev.filter((h) => h.id !== id));
  };

  const subjectFor = (id) => subjects.find((s) => s.id === id);

  return (
    <Layout title="Mājasdarbi">

      {}
      <h2>Priekšmeti</h2>
      <div className="panel stack">
        {canManage && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              placeholder="Priekšmeta nosaukums"
              value={subjName}
              onChange={(e) => setSubjName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSubject()}
              style={{ flex: 1 }}
            />
            <input
              type="color"
              value={subjColor}
              onChange={(e) => setSubjColor(e.target.value)}
              style={{ width: 44, padding: 2, cursor: 'pointer' }}
              title="Krāsa"
            />
            <button className="btnPrimary" onClick={addSubject}>Pievienot</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', minHeight: 32 }}>
          {subjects.length === 0 && <span className="muted">Vēl nav priekšmetu.</span>}
          {subjects.map((s) => (
            <span key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: s.color + '22', border: `1px solid ${s.color}`,
              borderRadius: 20, padding: '3px 10px',
            }}>
              <span style={{ color: s.color, fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</span>
              {canManage && (
                <button
                  onClick={() => deleteSubject(s.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.color, fontWeight: 700, padding: '0 2px', fontSize: '1rem' }}
                >×</button>
              )}
            </span>
          ))}
        </div>
      </div>

      {}
      <h2 style={{ marginTop: 20 }}>Pievienot uzdevumu</h2>
      <div className="panel stack">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select
            value={hwSubjectId}
            onChange={(e) => setHwSubjectId(e.target.value)}
            style={{ flex: 1 }}
          >
            {subjects.length === 0 && <option value="">— vispirms pievienojiet priekšmetu —</option>}
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input
            type="date"
            value={hwDueDate}
            onChange={(e) => setHwDueDate(e.target.value)}
            style={{ width: 160 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Uzdevuma apraksts"
            value={hwTitle}
            onChange={(e) => setHwTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHomework()}
            style={{ flex: 1 }}
          />
          <button className="btnPrimary" onClick={addHomework} disabled={!hwSubjectId}>
            Pievienot
          </button>
        </div>
      </div>

      {}
      <div className="panel stack" style={{ marginTop: 8 }}>
        {homework.length === 0 && <div className="muted">Vēl nav neviena uzdevuma.</div>}
        {homework.map((h) => {
          const subj = subjectFor(h.subject_id);
          return (
            <div key={h.id} className="listItem">
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, color: subj?.color || '#6366f1' }}>
                  {subj?.name || '?'}
                </span>
                <span style={{ margin: '0 8px', color: '#9ca3af' }}>·</span>
                {h.title}
                {h.due_date && (
                  <span className="muted" style={{ marginLeft: 8, fontSize: '0.82rem' }}>
                    termiņš: {h.due_date}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                <span style={{
                  ...STATUS_STYLES[h.status],
                  borderRadius: 20, padding: '2px 10px', fontSize: '0.8rem', fontWeight: 600,
                }}>
                  {STATUS_LV[h.status]}
                </span>
                <select
                  value={h.status}
                  onChange={(e) => updateStatus(h.id, e.target.value)}
                  style={{ padding: '4px 6px', fontSize: '0.82rem', width: 'auto' }}
                >
                  {Object.entries(STATUS_LV).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                <button className="btnDanger btnSmall" onClick={() => deleteHomework(h.id)}>Dzēst</button>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
