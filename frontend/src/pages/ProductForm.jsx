import React, { useState } from 'react';
import api from '../api';
import './products-dashboard.css';

export default function ProductForm() {
  const [descricao, setDescricao] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [paisOrigem, setPaisOrigem] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('Usuário');

  React.useEffect(() => {
    api.get('/auth/me')
      .then((res) => setUserName(res.data?.name || 'Usuário'))
      .catch(() => setUserName('Usuário'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/products', {
        descricao,
        marca,
        modelo,
        pais_origem: paisOrigem
      });
      window.location.href = '/products';
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar produto');
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">FiscalAI Platform</div>
        <nav className="sidebar-menu">
          <a href="/dashboards" className="menu-item"><span>📊</span>Dashboards</a>
          <a href="/products" className="menu-item menu-item-active"><span>📦</span>Produtos</a>
          <a href="/ai-classifications" className="menu-item"><span>🤖</span>Classificações IA</a>
          <a href="/catalog" className="menu-item"><span>📚</span>Catálogo</a>
          <a href="/integrations" className="menu-item"><span>🔗</span>Integrações</a>
          <a href="/settings" className="menu-item"><span>⚙️</span>Configurações</a>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Sistema de Classificação Fiscal</h1>
            <p className="topbar-breadcrumb">Dashboard / Produtos / Novo Produto</p>
          </div>
          <div className="topbar-actions">
            <span className="user-name">{userName}</span>
            <button type="button" className="btn btn-logout" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <section className="products-section form-shell">
          <div className="products-toolbar">
            <h2 className="section-title">Cadastro de Produto</h2>
            <a href="/products" className="btn btn-secondary">Voltar</a>
          </div>

          <form className="premium-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field-block">
                <span>Descrição *</span>
                <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} required />
              </label>

              <label className="field-block">
                <span>Marca</span>
                <input type="text" value={marca} onChange={e => setMarca(e.target.value)} />
              </label>

              <label className="field-block">
                <span>Modelo</span>
                <input type="text" value={modelo} onChange={e => setModelo(e.target.value)} />
              </label>

              <label className="field-block">
                <span>País de Origem</span>
                <input type="text" value={paisOrigem} onChange={e => setPaisOrigem(e.target.value)} />
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Salvar Produto</button>
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        </section>
      </div>
    </div>
  );
}
