import { useEffect, useState } from "react";
import { getAnnouncements, createAnnouncement } from "../services/api";

function Announcements({ setPage }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getAnnouncements();
      setItems(data);
    }
    load();
  }, []);

  const add = async () => {
    const t = title.trim();
    if (!t) return;
    const created = await createAnnouncement({ title: t });
    setItems([created, ...items]);
    setTitle("");
  };

  const remove = (id) => setItems(items.filter(x => x.id !== id));

  return (
    <div className="layout">
      <div className="topbar">
        <div className="titleBlock">
          <h1>Paziņojumi</h1>
          <p>Skolas ziņas un svarīgi atgādinājumi</p>
        </div>
        <button className="btnGhost" onClick={() => setPage("dashboard")}>Atpakaļ</button>
      </div>

      <div className="panel stack">
        <input
          placeholder="Jauns paziņojums..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btnPrimary" onClick={add}>Pievienot</button>
      </div>

      <div className="panel stack">
        {items.length === 0 && <div className="muted">Nav neviena paziņojuma.</div>}
        {items.map((a) => (
          <div key={a.id} className="listItem">
            <span>{a.title}</span>
            <button className="btnDanger" onClick={() => remove(a.id)}>Dzēst</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Announcements;