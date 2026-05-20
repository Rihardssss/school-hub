import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

const DAYS = ['', 'Pirmdiena', 'Otrdiena', 'Trešdiena', 'Ceturtdiena', 'Piektdiena'];

export default function Schedule() {
  const [entries,     setEntries]     = useState([]);
  const [subjects,    setSubjects]    = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);

  // Form state
  const [fSubjectId, setFSubjectId] = useState('');
  const [fDay,       setFDay]       = useState(1);
  const [fStart,     setFStart]     = useState('09:00');
  const [fEnd,       setFEnd]       = useState('10:00');
  const [fRoom,      setFRoom]      = useState('');

  useEffect(() => { reload(); }, []);

  useEffect(() => {
    if (subjects.length > 0 && !fSubjectId) setFSubjectId(subjects[0].id);
  }, [subjects, fSubjectId]);

  async function reload() {
    const [s, e] = await Promise.all([api.get('/subjects'), api.get('/schedule')]);
    setSubjects(s.data);
    setEntries(e.data);
  }

  const addEntry = async () => {
    if (!fSubjectId) return;
    await api.post('/schedule', {
      subject_id: fSubjectId,
      day_of_week: fDay,
      start_time: fStart,
      end_time: fEnd,
      room: fRoom || null,
    });
    setFRoom('');
    reload();
  };

  const deleteEntry = async (id) => {
    await api.delete(`/schedule/${id}`);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const subjectName = (id) => subjects.find((s) => s.id === id)?.name || '?';
  const subjectColor = (id) => subjects.find((s) => s.id === id)?.color || '#6366f1';

  const dayEntries = entries
    .filter((e) => e.day_of_week === selectedDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <Layout title="Stundu saraksts">

      {/* Day tabs */}
      <div className="dayTabs">
        {[1, 2, 3, 4, 5].map((d) => (
          <button
            key={d}
            className={d === selectedDay ? 'btnPrimary' : 'btnGhost'}
            onClick={() => setSelectedDay(d)}
          >
            {DAYS[d]}
          </button>
        ))}
      </div>

      {/* Entries for selected day */}
      <div className="panel stack">
        {dayEntries.length === 0 && (
          <div className="muted">Nav stundu {DAYS[selectedDay].toLowerCase()} dienā.</div>
        )}
        {dayEntries.map((e) => (
          <div key={e.id} className="listItem">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 700, minWidth: 100, color: '#1e3a8a' }}>
                {e.start_time.slice(0, 5)} – {e.end_time.slice(0, 5)}
              </span>
              <span style={{ fontWeight: 600, color: subjectColor(e.subject_id) }}>
                {subjectName(e.subject_id)}
              </span>
              {e.room && <span className="muted">· {e.room}</span>}
            </div>
            <button className="btnDanger btnSmall" onClick={() => deleteEntry(e.id)}>Dzēst</button>
          </div>
        ))}
      </div>

      {/* Add form */}
      <h2 style={{ marginTop: 20 }}>Pievienot stundu</h2>
      <div className="panel stack">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select value={fSubjectId} onChange={(e) => setFSubjectId(e.target.value)} style={{ flex: 1 }}>
            {subjects.length === 0 && <option value="">— pievienojiet priekšmetus vispirms —</option>}
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={fDay} onChange={(e) => setFDay(Number(e.target.value))} style={{ width: 140 }}>
            {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{DAYS[d]}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input type="time" value={fStart} onChange={(e) => setFStart(e.target.value)} style={{ width: 120 }} />
          <input type="time" value={fEnd}   onChange={(e) => setFEnd(e.target.value)}   style={{ width: 120 }} />
          <input placeholder="Telpa (piem. 301)" value={fRoom} onChange={(e) => setFRoom(e.target.value)} style={{ flex: 1 }} />
          <button className="btnPrimary" onClick={addEntry} disabled={!fSubjectId}>Pievienot</button>
        </div>
      </div>
    </Layout>
  );
}
