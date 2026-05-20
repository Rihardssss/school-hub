import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await login(data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Nepareizs e-pasts vai parole');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <form className="card" onSubmit={handle}>
        <h1>Ielogošanās</h1>

        <input
          type="email"
          placeholder="E-pasts"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="Parole"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="errorText">{error}</div>}

        <button className="btnPrimary" type="submit" disabled={loading}>
          {loading ? 'Lūdzu uzgaidi...' : 'Ielogoties'}
        </button>
        <Link to="/register" className="btnGhost" style={{ textAlign: 'center', textDecoration: 'none' }}>
          Reģistrēties
        </Link>
      </form>
    </div>
  );
}
