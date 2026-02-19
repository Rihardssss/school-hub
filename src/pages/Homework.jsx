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
    <div className="center">
      <div className="card">
        <h1>Mājasdarbi</h1>

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

        <button onClick={add}>Pievienot</button>

        <div>
          {homework.map((h) => (
            <div
              key={h.id}
              style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
            >
              <span>
                {h.subject} - {h.title}
              </span>
              <button onClick={() => remove(h.id)}>Dzēst</button>
            </div>
          ))}
        </div>

        <button onClick={() => setPage("dashboard")}>Atpakaļ</button>
      </div>
    </div>
  );
}

export default Homework;