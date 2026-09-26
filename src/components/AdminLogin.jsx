import React, { useState } from 'react';
import { API_BASE_URL } from './config';

export default function AdminLogin({ onConnecte }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const gererConnexion = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Identifiants incorrects.');
      }

      localStorage.setItem('token_admin', data.accessToken);
      localStorage.setItem('infos_admin', JSON.stringify(data.admin));
      if (onConnecte) onConnecte(data.admin);
      else window.location.reload();
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <div style={s.card}>
        <div style={s.brandMark}>E</div>
        <h1 style={s.title}>Console administrateur</h1>
        <p style={s.subtitle}>ESFPP — Accès réservé à la direction</p>

        <form onSubmit={gererConnexion} style={{ marginTop: '24px' }}>
          <label style={s.label}>Adresse email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="directeur@esfpp.ma"
            required
            style={s.input}
          />

          <label style={s.label}>Mot de passe</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="••••••••"
            required
            style={s.input}
          />

          {erreur && <div style={s.erreurBox}>{erreur}</div>}

          <button type="submit" disabled={chargement} style={{ ...s.submitButton, opacity: chargement ? 0.7 : 1 }}>
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', width: '100vw', backgroundColor: '#0B1220',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '36px 40px',
    width: '360px', boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
  },
  brandMark: {
    width: '38px', height: '38px', borderRadius: '9px', background: '#10B981',
    color: '#04241C', fontWeight: 700, fontSize: '1.1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px',
  },
  title: { fontSize: '1.15rem', fontWeight: 600, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.2px' },
  subtitle: { fontSize: '0.8rem', color: '#64748B', margin: 0 },
  label: { display: 'block', fontSize: '0.76rem', fontWeight: 500, color: '#334155', marginBottom: '6px', marginTop: '16px' },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: '7px', border: '1px solid #E2E8F0',
    fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none', color: '#0F172A',
  },
  erreurBox: {
    marginTop: '14px', padding: '9px 12px', borderRadius: '7px',
    backgroundColor: '#FEF2F2', color: '#B91C1C', fontSize: '0.78rem', fontWeight: 500,
  },
  submitButton: {
    width: '100%', marginTop: '22px', padding: '11px', borderRadius: '7px', border: 'none',
    backgroundColor: '#0F172A', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
  },
};