import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AuthFrame from '../components/AuthFrame';

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
    <AuthFrame>
      <form className="card authCard" onSubmit={handle}>
        <h1>Ielogošanās</h1>
        <p className="muted">Turpini ar savu skolas kontu.</p>

        <div className="field">
          <label htmlFor="email">E-pasts</label>
          <input
            id="email"
            type="email"
            placeholder="anna.berzina@schoolhub.lv"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            autoFocus
          />
        </div>

        <div className="field">
          <label htmlFor="password">Parole</label>
          <input
            id="password"
            type="password"
            placeholder="Ievadi paroli"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <div className="errorText">{error}</div>}

        <button className="btnPrimary" type="submit" disabled={loading}>
          {loading ? 'Lūdzu uzgaidi...' : 'Ielogoties'}
        </button>
        <Link to="/register" className="btnGhost authSwitch">
          Reģistrēties
        </Link>
      </form>
    </AuthFrame>
  );
}
