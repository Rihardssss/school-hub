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
    <div className="center">
      <div className="card">
        <h1>Paziņojumi</h1>

        <input
          placeholder="Jauns paziņojums..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={add}>Pievienot</button>

        <div>
          {items.map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span>{a.title}</span>
              <button onClick={() => remove(a.id)}>Dzēst</button>
            </div>
          ))}
        </div>

        <button onClick={() => setPage("dashboard")}>Atpakaļ</button>
      </div>
    </div>
  );
}

export default Announcements;