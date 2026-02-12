import { useState } from "react";
import { registerUser } from "../services/api";

function Register({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    try {
      setMsg("");
      await registerUser(email, password);
      setMsg("Reģistrācija veiksmīga. Tagad pieslēdzies.");
      setTimeout(() => setPage("login"), 700);
    } catch {
      setMsg("Reģistrācija neizdevās");
    }
  };

  return (
    <div className="center">
      <div className="card">
        <h1>Reģistrēties</h1>
        <div className="muted">Izveido kontu un turpini uz paneli</div>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-pasts"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parole"
          type="password"
        />

        <button className="btnPrimary" onClick={handleRegister}>Izveidot kontu</button>

        {msg && <div className="muted">{msg}</div>}

        <button className="btnGhost" onClick={() => setPage("login")}>Atpakaļ</button>
      </div>
    </div>
  );
}

export default Register;