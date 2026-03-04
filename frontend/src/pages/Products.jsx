import React, { useEffect, useState } from 'react';
import api from '../api';
import './products-dashboard.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [productRows, setProductRows] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [userName, setUserName] = useState('Usuário');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUserName(res.data?.name || 'Usuário'))
      .catch(() => setUserName('Usuário'));

    api.get('/products')
      .then(async res => {
        const list = res.data || [];
        setProducts(list);

        const enriched = await Promise.all(
          list.map(async product => {
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
          })
        );

        setProductRows(enriched);
      })
      .catch(() => setError('Erro ao carregar produtos'));
  }, []);

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

  const filteredProducts = productRows.filter((product) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term ||
      product.descricao?.toLowerCase().includes(term) ||
      product.marca?.toLowerCase().includes(term) ||
      product.modelo?.toLowerCase().includes(term) ||
      product.pais_origem?.toLowerCase().includes(term);

    const normalizedStatus = String(product.status || 'pendente').toLowerCase();
    const matchesStatus = statusFilter === 'todos' || normalizedStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const total = productRows.length;
  const classificados = productRows.filter(p => String(p.status).toLowerCase() === 'aprovado').length;
  const pendentes = productRows.filter(p => String(p.status).toLowerCase() === 'pendente').length;
  const emAnalise = productRows.filter(p => {
    const status = String(p.status).toLowerCase();
    return status === 'em analise' || status === 'em_analise';
  }).length;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">FiscalAI Platform</div>
        <nav className="sidebar-menu">
          <a href="/dashboards" className="menu-item">
            <span>📊</span>
            Dashboards
          </a>
          <a href="/products" className="menu-item menu-item-active">
            <span>📦</span>
            Produtos
          </a>
          <a href="/ai-classifications" className="menu-item">
            <span>🤖</span>
            Classificações IA
          </a>
          <a href="/catalog" className="menu-item">
            <span>📚</span>
            Catálogo
          </a>
          <a href="/integrations" className="menu-item">
            <span>🔗</span>
            Integrações
          </a>
          <a href="/settings" className="menu-item">
            <span>⚙️</span>
            Configurações
          </a>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Sistema de Classificação Fiscal</h1>
            <p className="topbar-breadcrumb">Dashboard / Produtos</p>
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
              <h3 className="metric-value">{total}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">✅</div>
            <div>
              <p className="metric-label">Classificados</p>
              <h3 className="metric-value">{classificados}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">🕒</div>
            <div>
              <p className="metric-label">Pendentes</p>
              <h3 className="metric-value">{pendentes}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">🔍</div>
            <div>
              <p className="metric-label">Aguardando Aprovação</p>
              <h3 className="metric-value">{emAnalise}</h3>
            </div>
          </article>
        </section>

        <section className="products-section">
          <div className="products-toolbar">
            <div className="filters-row">
              <input
                className="search-input"
                type="text"
                placeholder="Buscar produto, marca, modelo ou origem"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">Todos os status</option>
                <option value="aprovado">Classificado</option>
                <option value="pendente">Pendente</option>
                <option value="em_analise">Em análise</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
            </div>
            <a href="/products/new" className="btn btn-primary">+ Novo Produto</a>
          </div>

          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Origem</th>
                  <th>NCM sugerido</th>
                  <th>Status</th>
                  <th>Score IA</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-name">{product.descricao}</div>
                      <div className="product-sub">{product.marca || 'Marca não informada'} · {product.modelo || 'Modelo não informado'}</div>
                    </td>
                    <td>{product.pais_origem || '—'}</td>
                    <td>{product.ncm || '—'}</td>
                    <td>
                      <span className={statusClass(product.status)}>{statusLabel(product.status)}</span>
                    </td>
                    <td>{product.score === null ? '—' : `${product.score}%`}</td>
                    <td>
                      <div className="action-row">
                        <a className="btn btn-primary" href={`/products/${product.id}/classification`}>Classificar com IA</a>
                        <a className="btn btn-secondary" href={`/products/${product.id}/classification`}>Visualizar</a>
                        <button type="button" className="btn btn-neutral">Editar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredProducts.length && <p className="empty-state">Nenhum produto encontrado para os filtros aplicados.</p>}
          </div>
        </section>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
