import { useEffect, useState } from "react";
import { getLessons } from "../services/api";

function Schedule({ setPage }) {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getLessons();
      setLessons(data);
    }
    load();
  }, []);

  return (
    <div className="center">
      <div className="card">
        <h1>Schedule</h1>

        {lessons.map(l => (
          <div key={l.id}>
            {l.day} {l.time} — {l.subject} ({l.room})
          </div>
        ))}

        <button onClick={() => setPage("dashboard")}>Back</button>
      </div>
    </div>
  );
}

export default Schedule;