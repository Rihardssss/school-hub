import { useEffect, useState } from "react";
import { createMessage, deleteMessage, getMessages, toggleMessageRead } from "../services/api";

function Messages({ setPage }) {
  const [messages, setMessages] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [to, setTo] = useState("Stepanova Jeļena");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const teachers = [
    "Stepanova Jeļena",
    "Medvedevs Vladislavs",
    "Liepiņa-Zakirova Inese",
    "Ozola Inese",
    "Devajeva Ludmila",
    "Kļaveniece-Zaharova Elizabete",
  ];

  useEffect(() => {
    async function load() {
      const data = await getMessages();
      setMessages(data);
      if (data[0]) setActiveId(data[0].id);
    }
    load();
  }, []);

  const activeMessage = messages.find((m) => m.id === activeId) || null;
  const unreadCount = messages.filter((m) => !m.read).length;

  const addMessage = async () => {
    if (!subject.trim() || !body.trim()) return;
    const created = await createMessage({ to, subject, body });
    setMessages((prev) => [created, ...prev]);
    setActiveId(created.id);
    setSubject("");
    setBody("");
  };

  const toggleRead = async (id) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: !m.read } : m)));
    await toggleMessageRead(id);
  };

  const removeMessage = async (id) => {
    setMessages((prev) => {
      const next = prev.filter((m) => m.id !== id);
      if (activeId === id) {
        setActiveId(next[0]?.id ?? null);
      }
      return next;
    });
    await deleteMessage(id);
  };

  return (
    <div className="layout">
      <div className="topbar">
        <div className="titleBlock">
          <h1>Vēstules</h1>
          <p className="muted">Neizlasītas: {unreadCount}</p>
        </div>
        <button className="btnGhost" onClick={() => setPage("dashboard")}>Atpakaļ</button>
      </div>

      <div className="mailLayout">
        <div className="panel stack">
          <h2>Ienākošās</h2>
          {messages.length === 0 && <div className="muted">Nav vēstuļu.</div>}
          {messages.map((m) => (
            <button
              key={m.id}
              className={m.id === activeId ? "mailItem activeMail" : "mailItem"}
              onClick={() => setActiveId(m.id)}
            >
              <div className="mailTop">
                <strong>{m.from}</strong>
                {!m.read && <span className="unreadDot" />}
              </div>
              <div>{m.subject}</div>
            </button>
          ))}
        </div>

        <div className="panel stack">
          <h2>Saturs</h2>
          {!activeMessage && <div className="muted">Izvēlies vēstuli.</div>}
          {activeMessage && (
            <>
              <div><strong>No:</strong> {activeMessage.from}</div>
              <div><strong>Kam:</strong> {activeMessage.to || "Tu"}</div>
              <div><strong>Tēma:</strong> {activeMessage.subject}</div>
              <div className="mailBody">{activeMessage.body}</div>
              <div className="actionsRow">
                <button className="btnGhost" onClick={() => toggleRead(activeMessage.id)}>
                  {activeMessage.read ? "Atzīmēt kā neizlasītu" : "Atzīmēt kā izlasītu"}
                </button>
                <button className="btnDanger" onClick={() => removeMessage(activeMessage.id)}>
                  Dzēst vēstuli
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="panel stack">
        <h2>Jauna vēstule</h2>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {teachers.map((teacher) => (
            <option key={teacher} value={teacher}>
              {teacher}
            </option>
          ))}
        </select>
        <input
          placeholder="Temats"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className="textArea"
          placeholder="Vēstules teksts"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button className="btnPrimary" onClick={addMessage}>Nosūtīt</button>
      </div>
    </div>
  );
}

export default Messages;
