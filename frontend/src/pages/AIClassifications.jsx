import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import './products-dashboard.css';

export default function AIClassifications() {
  const [userName, setUserName] = useState('Usuário');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [runningMap, setRunningMap] = useState({});

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
            classificationId: classification?.id || null,
            ncm: classification?.code || '—',
            status: classification?.status || 'pendente',
            score: classification?.confidence ?? null,
            justification: classification?.justification || 'Sem justificativa disponível.'
          };
        } catch {
          return {
            ...product,
            classificationId: null,
            ncm: '—',
            status: 'pendente',
            score: null,
            justification: 'Classificação ainda não executada.'
          };
        }
      }));

      setRows(enriched);
    } catch (e) {
      setError(e.response?.data?.error || 'Erro ao carregar classificações');
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

  const runClassification = async (productId) => {
    setRunningMap((prev) => ({ ...prev, [productId]: true }));
    setError('');
    try {
      const res = await api.post(`/classify/${productId}`);
      const classification = res.data;

      setRows((prev) => prev.map((item) => (
        item.id === productId
          ? {
              ...item,
              classificationId: classification?.id || null,
              ncm: classification?.code || '—',
              status: classification?.status || 'pendente',
              score: classification?.confidence ?? null,
              justification: classification?.justification || 'Sem justificativa disponível.'
            }
          : item
      )));
    } catch (e) {
      setError(e.response?.data?.error || 'Erro ao executar classificação de IA');
    } finally {
      setRunningMap((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const term = search.trim().toLowerCase();
      const matchesSearch = !term ||
        item.descricao?.toLowerCase().includes(term) ||
        item.marca?.toLowerCase().includes(term) ||
        item.modelo?.toLowerCase().includes(term) ||
        item.pais_origem?.toLowerCase().includes(term) ||
        String(item.ncm || '').toLowerCase().includes(term);

      const normalizedStatus = String(item.status || 'pendente').toLowerCase();
      const matchesStatus = statusFilter === 'todos' || normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const total = rows.length;
  const classificados = rows.filter((r) => String(r.status).toLowerCase() === 'aprovado').length;
  const pendentes = rows.filter((r) => String(r.status).toLowerCase() === 'pendente').length;
  const emAnalise = rows.filter((r) => {
    const status = String(r.status).toLowerCase();
    return status === 'em analise' || status === 'em_analise';
  }).length;

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
            <p className="topbar-breadcrumb">Dashboard / Classificações IA</p>
          </div>
          <div className="topbar-actions">
            <span className="user-name">{userName}</span>
            <button type="button" className="btn btn-logout" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <section className="metrics-grid">
          <article className="metric-card">
            <div className="metric-icon">🧾</div>
            <div>
              <p className="metric-label">Total de produtos</p>
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
            <div className="metric-icon">🔍</div>
            <div>
              <p className="metric-label">Em análise</p>
              <h3 className="metric-value">{emAnalise}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">🕒</div>
            <div>
              <p className="metric-label">Pendentes</p>
              <h3 className="metric-value">{pendentes}</h3>
            </div>
          </article>
        </section>

        <section className="products-section">
          <div className="products-toolbar">
            <div className="filters-row">
              <input
                className="search-input"
                type="text"
                placeholder="Buscar produto, marca, modelo, origem ou NCM"
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
            <button type="button" className="btn btn-secondary" onClick={loadData} disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>

          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>NCM sugerido</th>
                  <th>Status</th>
                  <th>Score IA</th>
                  <th>Justificativa</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const isRunning = !!runningMap[row.id];
                  const hasClassification = row.classificationId || row.ncm !== '—';

                  return (
                    <tr key={row.id}>
                      <td>
                        <div className="product-name">{row.descricao}</div>
                        <div className="product-sub">{row.marca || 'Marca não informada'} · {row.modelo || 'Modelo não informado'} · {row.pais_origem || 'Origem não informada'}</div>
                      </td>
                      <td>{row.ncm}</td>
                      <td><span className={statusClass(row.status)}>{statusLabel(row.status)}</span></td>
                      <td>{row.score === null ? '—' : `${row.score}%`}</td>
                      <td>{row.justification}</td>
                      <td>
                        <div className="action-row">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => runClassification(row.id)}
                            disabled={isRunning}
                          >
                            {isRunning ? 'Processando...' : hasClassification ? 'Reclassificar' : 'Classificar'}
                          </button>
                          <a className="btn btn-secondary" href={`/products/${row.id}/classification`}>Detalhar</a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!filteredRows.length && <p className="empty-state">Nenhuma classificação encontrada para os filtros aplicados.</p>}
          </div>

          {error && <div className="error">{error}</div>}
        </section>
      </div>
    </div>
  );
}