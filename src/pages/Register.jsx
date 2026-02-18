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
      setMsg("Registered. Now login.");
      setTimeout(() => setPage("login"), 700);
    } catch {
      setMsg("Register failed");
    }
  };

  return (
    <div className="center">
      <div className="card">
        <h1>Register</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button onClick={handleRegister}>Create account</button>
        {msg && <div>{msg}</div>}
        <button onClick={() => setPage("login")}>Back</button>
      </div>
    </div>
  );
}

export default Register;