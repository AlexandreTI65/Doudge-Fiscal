import React, { useMemo, useState } from 'react';
import api from '../api';
import './auth-premium.css';

export default function ResetPassword() {
  const token = useMemo(() => new URLSearchParams(window.location.search).get('token') || '', []);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Token não encontrado na URL.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setMessage('Senha redefinida com sucesso. Você já pode entrar.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <aside className="auth-side">
        <h3 className="auth-brand">Sistema de Classificação Fiscal</h3>
        <p className="auth-sub">Defina uma nova senha para restabelecer acesso seguro ao painel tributário.</p>
      </aside>
      <main className="auth-main">
        <section className="auth-card">
          <h2 className="auth-title">Redefinir senha</h2>
          <p className="auth-breadcrumb">Acesso / Nova senha</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field-label">Nova senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className="field-label">Confirmar nova senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="auth-actions">
              <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar nova senha'}</button>
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
