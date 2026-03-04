import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
import './products-dashboard.css';

export default function Classification() {
  const { id } = useParams();
  const [classification, setClassification] = useState(null);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [userName, setUserName] = useState('Usuário');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUserName(res.data?.name || 'Usuário'))
      .catch(() => setUserName('Usuário'));

    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setError('Erro ao carregar produto'));
    api.get(`/classification/${id}`)
      .then(res => setClassification(res.data))
      .catch(() => setClassification(null));
  }, [id]);

  const handleClassify = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/classify/${id}`);
      setClassification(res.data);
    } catch {
      setError('Erro ao classificar');
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    try {
      await api.post(`/approve/${classification.id}`, { status: 'aprovado' });
      setApproved(true);
    } catch {
      setError('Erro ao aprovar');
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">FiscalAI Platform</div>
        <nav className="sidebar-menu">
          <a href="/dashboards" className="menu-item"><span>📊</span>Dashboards</a>
          <a href="/products" className="menu-item"><span>📦</span>Produtos</a>
          <a href="/ai-classifications" className="menu-item menu-item-active"><span>🤖</span>Classificações IA</a>
          <a href="/catalog" className="menu-item"><span>📚</span>Catálogo</a>
          <a href="/integrations" className="menu-item"><span>🔗</span>Integrações</a>
          <a href="/settings" className="menu-item"><span>⚙️</span>Configurações</a>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Sistema de Classificação Fiscal</h1>
            <p className="topbar-breadcrumb">Dashboard / Produtos / Classificação IA</p>
          </div>
          <div className="topbar-actions">
            <span className="user-name">{userName}</span>
            <button type="button" className="btn btn-logout" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <section className="products-section">
          <div className="products-toolbar">
            <h2 className="section-title">Classificação Fiscal com IA</h2>
            <a href="/products" className="btn btn-secondary">Voltar</a>
          </div>

          {product && (
            <article className="detail-card">
              <h3>Produto</h3>
              <p><strong>Descrição:</strong> {product.descricao}</p>
              <p><strong>Marca/Modelo:</strong> {product.marca || '—'} / {product.modelo || '—'}</p>
              <p><strong>Origem:</strong> {product.pais_origem || '—'}</p>
            </article>
          )}

          {classification ? (
            <article className="detail-card">
              <h3>Resultado da IA</h3>
              <p><strong>NCM sugerido:</strong> {classification.code}</p>
              <p><strong>Score IA:</strong> {classification.confidence}%</p>
              <p><strong>Status:</strong> {classification.status}</p>
              <p><strong>Justificativa:</strong> {classification.justification}</p>
              {!approved && (
                <button type="button" className="btn btn-primary" onClick={handleApprove}>Aprovar Classificação</button>
              )}
              {approved && <p className="success-text">Classificação aprovada com sucesso.</p>}
            </article>
          ) : (
            <article className="detail-card">
              <h3>Classificação automática</h3>
              <p>Execute a classificação para gerar NCM sugerido e score de confiança da IA.</p>
              <button type="button" className="btn btn-primary" onClick={handleClassify} disabled={loading}>
                {loading ? 'Classificando...' : 'Classificar com IA'}
              </button>
            </article>
          )}

          {error && <div className="error">{error}</div>}
        </section>
      </div>
    </div>
  );
}
