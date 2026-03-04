import React, { useState } from 'react';
import api from '../api';
import './auth-premium.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('analista');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/dashboards';
        return;
      }
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar');
    }
  };

  return (
    <div className="auth-layout">
      <aside className="auth-side">
        <h3 className="auth-brand">Sistema de Classificação Fiscal</h3>
        <p className="auth-sub">Ambiente institucional para cadastro seguro e gestão tributária com IA.</p>
      </aside>
      <main className="auth-main">
        <section className="auth-card">
          <h2 className="auth-title">Cadastro</h2>
          <p className="auth-breadcrumb">Acesso / Cadastrar novo usuário</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field-label">Nome</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />

            <label className="field-label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

            <label className="field-label">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

            <label className="field-label">Perfil</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="analista">Analista</option>
              <option value="admin">Admin</option>
            </select>

            <div className="auth-actions">
              <button className="auth-btn" type="submit">Cadastrar</button>
              <a className="auth-link" href="/login">Voltar ao login</a>
            </div>
            {error && <div className="auth-error">{error}</div>}
          </form>
        </section>
      </main>
    </div>
  );
}
