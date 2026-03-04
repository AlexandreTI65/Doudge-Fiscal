import React, { useEffect, useState } from 'react';
import api from '../api';
import './products-dashboard.css';

export default function Settings() {
  const [userName, setUserName] = useState('Usuário');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    companyName: 'Pyramid Diamantados',
    notificationEmail: 'ti@pyramiddiamantados.com.br',
    defaultWorkflow: 'automatico',
    aiAutoClassify: true,
    requireApproval: true,
    portalIntegration: true
  });

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => setUserName(res.data?.name || 'Usuário'))
      .catch(() => setUserName('Usuário'));

    api.get('/settings')
      .then((res) => {
        setSettings(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Erro ao carregar configurações.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await api.put('/settings', settings);
      setSettings(res.data);
      setMessage('Configurações salvas com sucesso.');
      setTimeout(() => setMessage(''), 1800);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">FiscalAI Platform</div>
        <nav className="sidebar-menu">
          <a href="/dashboards" className="menu-item"><span>📊</span>Dashboards</a>
          <a href="/products" className="menu-item"><span>📦</span>Produtos</a>
          <a href="/ai-classifications" className="menu-item"><span>🤖</span>Classificações IA</a>
          <a href="/catalog" className="menu-item"><span>📚</span>Catálogo</a>
          <a href="/integrations" className="menu-item"><span>🔗</span>Integrações</a>
          <a href="/settings" className="menu-item menu-item-active"><span>⚙️</span>Configurações</a>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Sistema de Classificação Fiscal</h1>
            <p className="topbar-breadcrumb">Dashboard / Configurações</p>
          </div>
          <div className="topbar-actions">
            <span className="user-name">{userName}</span>
            <button type="button" className="btn btn-logout" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <section className="products-section form-shell">
          <div className="products-toolbar">
            <h2 className="section-title">Configurações da Plataforma</h2>
          </div>

          <form className="premium-form" onSubmit={handleSave}>
            {loading && <div className="detail-card"><p>Carregando configurações...</p></div>}
            <div className="form-grid">
              <label className="field-block">
                <span>Nome da empresa</span>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                />
              </label>

              <label className="field-block">
                <span>Email para notificações</span>
                <input
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(e) => handleChange('notificationEmail', e.target.value)}
                />
              </label>

              <label className="field-block">
                <span>Fluxo padrão de classificação</span>
                <select
                  value={settings.defaultWorkflow}
                  onChange={(e) => handleChange('defaultWorkflow', e.target.value)}
                >
                  <option value="automatico">Automático</option>
                  <option value="manual">Manual</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </label>
            </div>

            <article className="detail-card">
              <h3>Preferências operacionais</h3>
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={settings.aiAutoClassify}
                  onChange={(e) => handleChange('aiAutoClassify', e.target.checked)}
                />
                <span>Classificação automática com IA</span>
              </label>

              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={settings.requireApproval}
                  onChange={(e) => handleChange('requireApproval', e.target.checked)}
                />
                <span>Exigir aprovação humana antes da integração</span>
              </label>

              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={settings.portalIntegration}
                  onChange={(e) => handleChange('portalIntegration', e.target.checked)}
                />
                <span>Integração ativa com Portal Único</span>
              </label>
            </article>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading || saving}>
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
            {message && <div className="success-text">{message}</div>}
            {error && <div className="error">{error}</div>}
          </form>
        </section>
      </div>
    </div>
  );
}
