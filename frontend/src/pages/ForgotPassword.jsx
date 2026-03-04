import React, { useState } from 'react';
import api from '../api';
import './auth-premium.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data?.message || 'Se o email existir, você receberá um link de recuperação.');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao solicitar recuperação de senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <aside className="auth-side">
        <h3 className="auth-brand">Sistema de Classificação Fiscal</h3>
        <p className="auth-sub">Recuperação segura com token temporário enviado por email.</p>
      </aside>
      <main className="auth-main">
        <section className="auth-card">
          <h2 className="auth-title">Recuperar senha</h2>
          <p className="auth-breadcrumb">Acesso / Recuperação</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field-label">Email corporativo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="auth-actions">
              <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar link'}</button>
              <a className="auth-link" href="/login">Voltar ao login</a>
            </div>
            {message && <div className="auth-message">{message}</div>}
            {error && <div className="auth-error">{error}</div>}
          </form>
        </section>
      </main>
    </div>
  );
}
