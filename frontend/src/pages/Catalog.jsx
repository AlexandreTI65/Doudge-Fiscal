import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import './products-dashboard.css';

export default function Catalog() {
  const [userName, setUserName] = useState('Usuário');
  const [search, setSearch] = useState('');
  const [catalogItems, setCatalogItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [csvText, setCsvText] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => setUserName(res.data?.name || 'Usuário'))
      .catch(() => setUserName('Usuário'));
  }, []);

  const loadCatalog = async (term = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/catalog/ncm', { params: { search: term, limit: 300 } });
      setCatalogItems(res.data?.items || []);
      setTotal(res.data?.total || 0);
    } catch (e) {
      setError(e.response?.data?.error || 'Erro ao carregar catálogo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog('');
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return catalogItems;
    return catalogItems.filter((item) =>
      String(item.code).toLowerCase().includes(term) ||
      String(item.description).toLowerCase().includes(term)
    );
  }, [catalogItems, search]);

  const onFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCsvText(text);
  };

  const importTable = async () => {
    setImporting(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/catalog/import', { csvContent: csvText, delimiter: ';' });
      setMessage(`${res.data?.message}. Importados: ${res.data?.imported || 0}. Ignorados: ${res.data?.skipped || 0}.`);
      await loadCatalog(search);
      setCsvText('');
    } catch (e) {
      setError(e.response?.data?.error || 'Erro ao importar tabela');
    } finally {
      setImporting(false);
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
          <a href="/catalog" className="menu-item menu-item-active"><span>📚</span>Catálogo</a>
          <a href="/integrations" className="menu-item"><span>🔗</span>Integrações</a>
          <a href="/settings" className="menu-item"><span>⚙️</span>Configurações</a>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Sistema de Classificação Fiscal</h1>
            <p className="topbar-breadcrumb">Dashboard / Catálogo</p>
          </div>
          <div className="topbar-actions">
            <span className="user-name">{userName}</span>
            <button type="button" className="btn btn-logout" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <section className="metrics-grid">
          <article className="metric-card">
            <div className="metric-icon">📚</div>
            <div>
              <p className="metric-label">Registros NCM</p>
              <h3 className="metric-value">{total}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">📥</div>
            <div>
              <p className="metric-label">Itens exibidos</p>
              <h3 className="metric-value">{filteredItems.length}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">⚡</div>
            <div>
              <p className="metric-label">Status</p>
              <h3 className="metric-value">{loading ? '...' : 'Pronto'}</h3>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon">🧠</div>
            <div>
              <p className="metric-label">Fonte IA</p>
              <h3 className="metric-value">NCM</h3>
            </div>
          </article>
        </section>

        <section className="products-section">
          <div className="products-toolbar">
            <h2 className="section-title">Catálogo NCM</h2>
            <button type="button" className="btn btn-secondary" onClick={() => loadCatalog(search)} disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>

          <div className="filters-row">
            <input
              className="search-input"
              type="text"
              placeholder="Buscar código ou descrição do NCM"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <article className="detail-card">
            <h3>Importar tabela (CSV)</h3>
            <p>Formato esperado com cabeçalho: <strong>code;description</strong> (também aceita codigo/descricao).</p>
            <div className="catalog-import-grid">
              <input type="file" accept=".csv,text/csv" onChange={onFileSelected} />
              <textarea
                className="catalog-textarea"
                placeholder="Cole aqui a tabela CSV..."
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={importTable}
                  disabled={importing || !csvText.trim()}
                >
                  {importing ? 'Importando...' : 'Importar Tabela'}
                </button>
              </div>
            </div>
          </article>

          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Código NCM</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.code}</strong></td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredItems.length && !loading && <p className="empty-state">Nenhum item encontrado no catálogo.</p>}
          </div>
          {message && <div className="success-text">{message}</div>}
          {error && <div className="error">{error}</div>}
        </section>
      </div>
    </div>
  );
}
