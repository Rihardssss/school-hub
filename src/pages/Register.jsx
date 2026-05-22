import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AuthFrame from '../components/AuthFrame';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '' });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess('Reģistrācija veiksmīga! Novirza uz ielogošanos...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail[0]?.msg : detail || 'Reģistrācija neizdevās');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame>
      <form className="card authCard" onSubmit={handle}>
        <h1>Reģistrēties</h1>
        <p className="muted">Izveido kontu un sāc lietot SchoolHub.</p>

        <div className="field">
          <label htmlFor="full_name">Pilnais vārds</label>
          <input id="full_name" placeholder="Anna Bērziņa" value={form.full_name} onChange={set('full_name')} autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="username">Lietotājvārds</label>
          <input id="username" placeholder="anna_b" value={form.username} onChange={set('username')} autoComplete="username" required />
        </div>
        <div className="field">
          <label htmlFor="register_email">E-pasts</label>
          <input id="register_email" type="email" placeholder="anna.berzina@schoolhub.lv" value={form.email} onChange={set('email')} autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="register_password">Parole</label>
          <input id="register_password" type="password" placeholder="Vismaz 6 simboli" value={form.password} onChange={set('password')} autoComplete="new-password" minLength={6} required />
        </div>

        {error   && <div className="errorText">{error}</div>}
        {success && <div className="successText">{success}</div>}

        <button className="btnPrimary" type="submit" disabled={loading}>
          {loading ? 'Lūdzu uzgaidi...' : 'Izveidot kontu'}
        </button>
        <Link to="/login" className="btnGhost authSwitch">
          Jau ir konts? Ielogojies
        </Link>
      </form>
    </AuthFrame>
  );
}
