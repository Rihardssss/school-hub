import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

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
    <div className="center">
      <form className="card" onSubmit={handle}>
        <h1>Reģistrēties</h1>
        <div className="muted">Izveido kontu un sāc lietot SchoolHub</div>

        <input placeholder="Pilnais vārds" value={form.full_name} onChange={set('full_name')} required />
        <input placeholder="Lietotājvārds" value={form.username}  onChange={set('username')}  required />
        <input type="email"    placeholder="E-pasts" value={form.email}    onChange={set('email')}    required />
        <input type="password" placeholder="Parole (min. 6 simboli)" value={form.password} onChange={set('password')} required />

        {error   && <div className="errorText">{error}</div>}
        {success && <div style={{ color: '#166534', background: '#dcfce7', borderRadius: 8, padding: '8px 12px' }}>{success}</div>}

        <button className="btnPrimary" type="submit" disabled={loading}>
          {loading ? 'Lūdzu uzgaidi...' : 'Izveidot kontu'}
        </button>
        <Link to="/login" className="btnGhost" style={{ textAlign: 'center', textDecoration: 'none' }}>
          Jau ir konts? Ielogojies
        </Link>
      </form>
    </div>
  );
}
