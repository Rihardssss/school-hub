import { useEffect, useState } from "react";
import { getAnnouncements, getHomework, getMessages } from "../services/api";

function Dashboard({ setPage }) {
  const [homeworkCount, setHomeworkCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [todayLessons, setTodayLessons] = useState("3");

  useEffect(() => {
    async function load() {
      const [homework, announcements, messages] = await Promise.all([
        getHomework(),
        getAnnouncements(),
        getMessages(),
      ]);
      setHomeworkCount(homework.length);
      setAnnouncementCount(announcements.length);
      setUnreadMessages(messages.filter((m) => !m.read).length);
      setTodayLessons("4");
    }
    load();
  }, []);

  return (
    <div className="layout">
      <div className="topbar">
        <div className="titleBlock">
          <h1>Skolēna panelis</h1>
        </div>
        <button className="btnDanger" onClick={() => setPage("login")}>Iziet</button>
      </div>

      <div className="grid3">
        <div className="statCard">
          <span className="muted">Mājasdarbi</span>
          <span className="value">{homeworkCount}</span>
        </div>
        <div className="statCard">
          <span className="muted">Paziņojumi</span>
          <span className="value">{announcementCount}</span>
        </div>
        <div className="statCard">
          <span className="muted">Stundas šodien</span>
          <span className="value">{todayLessons}</span>
        </div>
        <div className="statCard">
          <span className="muted">Neizlasītas vēstules</span>
          <span className="value">{unreadMessages}</span>
        </div>
      </div>

      <div className="panel">
        <h2>Ātrās darbības</h2>
        <div className="quickActions">
          <button className="btnPrimary" onClick={() => setPage("homework")}>Mājasdarbi</button>
          <button className="btnGhost" onClick={() => setPage("schedule")}>Stundu saraksts</button>
          <button className="btnGhost" onClick={() => setPage("announcements")}>Paziņojumi</button>
          <button className="btnGhost" onClick={() => setPage("messages")}>Vēstules</button>
          <button className="btnGhost" onClick={() => setPage("progress")}>Sekmes</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;