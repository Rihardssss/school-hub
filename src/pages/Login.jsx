import { useState } from "react";
import { loginUser } from "../services/api";

function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      await loginUser(email, password);
      setPage("dashboard");
    } catch {
      setError("Nepareizs e-pasts vai parole");
    }
  };

  return (
    <div className="center">
      <div className="card">
        <h1>Ielogošanās</h1>

        <input
          type="email"
          placeholder="E-pasts"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Parole"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btnPrimary" onClick={handleLogin}>Ielogoties</button>

        <button className="btnGhost" onClick={() => setPage("register")}>Reģistrēties</button>

        {error && <div className="errorText">{error}</div>}
      </div>
    </div>
  );
}

export default Login;