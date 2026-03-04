import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import './products-dashboard.css';

export default function Dashboards() {
  const [userName, setUserName] = useState('Usuário');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const statusLabel = (status) => {
    const map = {
      aprovado: 'Classificado',
      pendente: 'Pendente',
      'em analise': 'Em análise',
      em_analise: 'Em análise',
      rejeitado: 'Rejeitado'
    };
    return map[String(status || '').toLowerCase()] || 'Pendente';
  };

  const statusClass = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'aprovado') return 'status-badge status-ok';
    if (normalized === 'rejeitado') return 'status-badge status-bad';
    if (normalized === 'em analise' || normalized === 'em_analise') return 'status-badge status-progress';
    return 'status-badge status-pending';
  };

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const productsRes = await api.get('/products');
      const products = productsRes.data || [];

      const enriched = await Promise.all(products.map(async (product) => {
        try {
          const classRes = await api.get(`/classification/${product.id}`);
          const classification = classRes.data;
          return {
            ...product,
            ncm: classification?.code || '—',
            status: classification?.status || 'pendente',
            score: classification?.confidence ?? null
          };
        } catch {
          return {
            ...product,
            ncm: '—',
            status: 'pendente',
            score: null
          };
        }
      }));

      setRows(enriched);
    } catch (e) {
      setError(e.response?.data?.error || 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => setUserName(res.data?.name || 'Usuário'))
      .catch(() => setUserName('Usuário'));

    loadData();
  }, []);

  const metrics = useMemo(() => {
    const total = rows.length;
    const classificados = rows.filter((r) => String(r.status).toLowerCase() === 'aprovado').length;
    const pendentes = rows.filter((r) => String(r.status).toLowerCase() === 'pendente').length;
    const emAnalise = rows.filter((r) => {
      const status = String(r.status).toLowerCase();
      return status === 'em analise' || status === 'em_analise';
    }).length;

    return { total, classificados, pendentes, emAnalise };
  }, [rows]);

  const recentes = useMemo(() => rows.slice(0, 8), [rows]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">FiscalAI Platform</div>
        <nav className="sidebar-menu">
          <a href="/dashboards" className="menu-item menu-item-active"><span>📊</span>Dashboards</a>
          <a href="/products" className="menu-item"><span>📦</span>Produtos</a>
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
            <p className="topbar-breadcrumb">Dashboards</p>
          </div>
          <div className="topbar-actions">
            <span className="user-name">{userName}</span>
            <button type="button" className="btn btn-logout" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <section className="metrics-grid">
          <article className="metric-card">
            <div className="metric-icon">📦</div>
            <div>
              <p className="metric-label">Total de Produtos</p>
              <h3 className="metric-value">{metrics.total}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">✅</div>
            <div>
              <p className="metric-label">Classificados</p>
              <h3 className="metric-value">{metrics.classificados}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">🔎</div>
            <div>
              <p className="metric-label">Em análise</p>
              <h3 className="metric-value">{metrics.emAnalise}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">🕒</div>
            <div>
              <p className="metric-label">Pendentes</p>
              <h3 className="metric-value">{metrics.pendentes}</h3>
            </div>
          </article>
        </section>

        <section className="products-section">
          <div className="products-toolbar">
            <h2 className="section-title">Visão geral operacional</h2>
            <div className="action-row">
              <a href="/products/new" className="btn btn-primary">+ Novo Produto</a>
              <a href="/ai-classifications" className="btn btn-secondary">Abrir Classificações IA</a>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>NCM sugerido</th>
                  <th>Status</th>
                  <th>Score IA</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {recentes.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="product-name">{row.descricao}</div>
                      <div className="product-sub">{row.marca || 'Marca não informada'} · {row.modelo || 'Modelo não informado'} · {row.pais_origem || 'Origem não informada'}</div>
                    </td>
                    <td>{row.ncm}</td>
                    <td><span className={statusClass(row.status)}>{statusLabel(row.status)}</span></td>
                    <td>{row.score === null ? '—' : `${row.score}%`}</td>
                    <td>
                      <div className="action-row">
                        <a className="btn btn-secondary" href={`/products/${row.id}/classification`}>Detalhar</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && !recentes.length && <p className="empty-state">Nenhum produto disponível para exibição no dashboard.</p>}
          </div>

          {loading && <p className="empty-state">Carregando dados...</p>}
          {error && <div className="error">{error}</div>}
        </section>
      </div>
    </div>
  );
}