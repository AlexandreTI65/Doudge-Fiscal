import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import './products-dashboard.css';

export default function Integrations() {
  const [userName, setUserName] = useState('Usuário');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [sendingMap, setSendingMap] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => setUserName(res.data?.name || 'Usuário'))
      .catch(() => setUserName('Usuário'));

    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const productsRes = await api.get('/products');
      const products = productsRes.data || [];

      const enriched = await Promise.all(products.map(async (p) => {
        try {
          const classRes = await api.get(`/classification/${p.id}`);
          const c = classRes.data;
          return {
            ...p,
            ncm: c?.code || '—',
            score: c?.confidence ?? null,
            classificationStatus: c?.status || 'pendente',
            integrationStatus: c?.status === 'aprovado' ? 'pronto' : 'bloqueado',
            lastMessage: c?.status === 'aprovado'
              ? 'Aguardando envio ao Portal Único'
              : 'Requer classificação aprovada'
          };
        } catch {
          return {
            ...p,
            ncm: '—',
            score: null,
            classificationStatus: 'pendente',
            integrationStatus: 'bloqueado',
            lastMessage: 'Sem classificação disponível'
          };
        }
      }));

      setRows(enriched);
    } catch (e) {
      setError(e.response?.data?.error || 'Erro ao carregar integrações');
    } finally {
      setLoading(false);
    }
  };

  const sendToPortal = async (productId) => {
    setSendingMap((prev) => ({ ...prev, [productId]: true }));
    setError('');
    try {
      const res = await api.post(`/integration/send/${productId}`);
      setRows((prev) => prev.map((item) => (
        item.id === productId
          ? {
              ...item,
              integrationStatus: 'enviado',
              lastMessage: res.data?.message || 'Enviado com sucesso ao Portal Único'
            }
          : item
      )));
    } catch (e) {
      setRows((prev) => prev.map((item) => (
        item.id === productId
          ? {
              ...item,
              integrationStatus: 'erro',
              lastMessage: e.response?.data?.error || 'Falha no envio para o Portal Único'
            }
          : item
      )));
      setError(e.response?.data?.error || 'Falha ao integrar produto.');
    } finally {
      setSendingMap((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const integrationBadge = (status) => {
    if (status === 'enviado') return 'status-badge status-ok';
    if (status === 'erro') return 'status-badge status-bad';
    if (status === 'pronto') return 'status-badge status-progress';
    return 'status-badge status-pending';
  };

  const integrationLabel = (status) => {
    if (status === 'enviado') return 'Enviado';
    if (status === 'erro') return 'Erro';
    if (status === 'pronto') return 'Pronto para envio';
    return 'Bloqueado';
  };

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const term = search.trim().toLowerCase();
      const matchesSearch = !term ||
        item.descricao?.toLowerCase().includes(term) ||
        item.marca?.toLowerCase().includes(term) ||
        item.modelo?.toLowerCase().includes(term) ||
        item.pais_origem?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'todos' || item.integrationStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const sent = rows.filter((r) => r.integrationStatus === 'enviado').length;
  const ready = rows.filter((r) => r.integrationStatus === 'pronto').length;
  const blocked = rows.filter((r) => r.integrationStatus === 'bloqueado').length;
  const withError = rows.filter((r) => r.integrationStatus === 'erro').length;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">FiscalAI Platform</div>
        <nav className="sidebar-menu">
          <a href="/dashboards" className="menu-item"><span>📊</span>Dashboards</a>
          <a href="/products" className="menu-item"><span>📦</span>Produtos</a>
          <a href="/ai-classifications" className="menu-item"><span>🤖</span>Classificações IA</a>
          <a href="/catalog" className="menu-item"><span>📚</span>Catálogo</a>
          <a href="/integrations" className="menu-item menu-item-active"><span>🔗</span>Integrações</a>
          <a href="/settings" className="menu-item"><span>⚙️</span>Configurações</a>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Sistema de Classificação Fiscal</h1>
            <p className="topbar-breadcrumb">Dashboard / Integrações</p>
          </div>
          <div className="topbar-actions">
            <span className="user-name">{userName}</span>
            <button type="button" className="btn btn-logout" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <section className="metrics-grid">
          <article className="metric-card">
            <div className="metric-icon">✅</div>
            <div>
              <p className="metric-label">Enviados</p>
              <h3 className="metric-value">{sent}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">🚀</div>
            <div>
              <p className="metric-label">Prontos para envio</p>
              <h3 className="metric-value">{ready}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">⏸️</div>
            <div>
              <p className="metric-label">Bloqueados</p>
              <h3 className="metric-value">{blocked}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">⚠️</div>
            <div>
              <p className="metric-label">Com erro</p>
              <h3 className="metric-value">{withError}</h3>
            </div>
          </article>
        </section>

        <section className="products-section">
          <div className="products-toolbar">
            <div className="filters-row">
              <input
                className="search-input"
                type="text"
                placeholder="Buscar produto para integração"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">Todos os status</option>
                <option value="pronto">Pronto para envio</option>
                <option value="enviado">Enviado</option>
                <option value="bloqueado">Bloqueado</option>
                <option value="erro">Erro</option>
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
                  <th>NCM</th>
                  <th>Score IA</th>
                  <th>Status integração</th>
                  <th>Detalhe</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const canSend = row.integrationStatus === 'pronto';
                  const isSending = !!sendingMap[row.id];

                  return (
                    <tr key={row.id}>
                      <td>
                        <div className="product-name">{row.descricao}</div>
                        <div className="product-sub">{row.marca || 'Marca não informada'} · {row.modelo || 'Modelo não informado'} · {row.pais_origem || 'Origem não informada'}</div>
                      </td>
                      <td>{row.ncm}</td>
                      <td>{row.score === null ? '—' : `${row.score}%`}</td>
                      <td><span className={integrationBadge(row.integrationStatus)}>{integrationLabel(row.integrationStatus)}</span></td>
                      <td>{row.lastMessage}</td>
                      <td>
                        <div className="action-row">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => sendToPortal(row.id)}
                            disabled={!canSend || isSending}
                            title={canSend ? 'Enviar ao Portal Único' : 'Apenas produtos aprovados podem ser enviados'}
                          >
                            {isSending ? 'Enviando...' : 'Enviar ao Portal Único'}
                          </button>
                          <a className="btn btn-secondary" href={`/products/${row.id}/classification`}>Visualizar</a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!filteredRows.length && <p className="empty-state">Nenhum produto disponível para os filtros selecionados.</p>}
          </div>
          {error && <div className="error">{error}</div>}
        </section>
      </div>
    </div>
  );
}
