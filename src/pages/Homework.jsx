import { useEffect, useState } from "react";
import { getHomework, createHomework } from "../services/api";

function Homework({ setPage }) {
  const [homework, setHomework] = useState([]);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getHomework();
      setHomework(data);
    }
    load();
  }, []);

  const add = async () => {
    const s = subject.trim();
    const t = title.trim();
    if (!s || !t) return;

    const created = await createHomework({ subject: s, title: t });
    setHomework([created, ...homework]);
    setSubject("");
    setTitle("");
  };

  const remove = (id) => {
    setHomework(homework.filter((h) => h.id !== id));
  };

  return (
    <div className="layout">
      <div className="topbar">
        <div className="titleBlock">
          <h1>Mājasdarbi</h1>
          <p>Pievieno un pārvaldi uzdevumus vienuviet</p>
        </div>
        <button className="btnGhost" onClick={() => setPage("dashboard")}>Atpakaļ</button>
      </div>

      <div className="panel stack">
        <input
          placeholder="Priekšmets (Matemātika)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <input
          placeholder="Uzdevums (45. lpp. 3. uzd.)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btnPrimary" onClick={add}>Pievienot</button>
      </div>

      <div className="panel stack">
        {homework.length === 0 && <div className="muted">Vēl nav neviena mājasdarba.</div>}
        {homework.map((h) => (
          <div key={h.id} className="listItem">
            <span>
              <strong>{h.subject}</strong> - {h.title}
            </span>
            <button className="btnDanger" onClick={() => remove(h.id)}>Dzēst</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Homework;