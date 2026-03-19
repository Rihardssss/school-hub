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
      setError("Wrong email or password");
    }
  };

  return (
    <div className="center">
      <div className="card">
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
}

export default Login;