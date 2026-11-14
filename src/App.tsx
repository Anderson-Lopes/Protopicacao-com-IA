import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  getHistoryReadings,
  summarizeHistory,
} from './data/demoData';
import type {
  AlertStatus,
  BusinessSettings,
  EnergyAlert,
  Equipment,
  HistoryPeriod,
  PageId,
} from './domain';
import { DemoRepository } from './services/demoRepository';

const repository = new DemoRepository();

const navigation: { id: PageId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'history', label: 'Histórico', icon: 'chart' },
  { id: 'alerts', label: 'Alertas', icon: 'bell' },
  { id: 'settings', label: 'Configurações', icon: 'settings' },
];

const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-5 5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" /></>,
    bolt: <><path d="m13 2-3 8h7l-6 12 1-9H5l8-11Z" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5m-5 5V3" /></>,
    leaf: <><path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-6 10-16Z" /><path d="M5 20c2-5 6-8 11-11" /></>,
    alert: <><path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4m0 4h.01" /></>,
    building: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-3h4v3" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1 2.5 2.5 1-2.5 1L19 21l-1-2.5-2.5-1 2.5-1L19 14Z" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] ?? paths.grid}
    </svg>
  );
}

function formatNumber(value: number, digits = 1): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [dashboard] = useState(() => repository.getDashboard());
  const [settings, setSettings] = useState<BusinessSettings>(() => repository.getSettings());
  const [alerts, setAlerts] = useState<EnergyAlert[]>(() => repository.getAlerts());
  const [settingsDirty, setSettingsDirty] = useState(false);
  const [toast, setToast] = useState('');
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const activeAlerts = alerts.filter((alert) => alert.status === 'active').length;
  const changePage = (nextPage: PageId) => setPage(nextPage);

  const updateSettings = (nextSettings: BusinessSettings) => {
    setSettings(nextSettings);
    setSettingsDirty(true);
    setStorageError('');
  };

  const saveSettings = () => {
    try {
      repository.saveSettings(settings);
      setSettingsDirty(false);
      setToast('Configurações salvas neste navegador.');
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : 'Não foi possível salvar as configurações.');
    }
  };

  const updateAlert = (id: string, status: AlertStatus, reason?: string) => {
    try {
      setAlerts(repository.updateAlert(id, status, reason));
      setToast(status === 'resolved' ? 'Alerta encerrado.' : 'Alerta atualizado.');
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : 'Não foi possível atualizar o alerta.');
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Icon name="bolt" size={21} /></div>
          <span>energia<span className="brand-light">clara</span></span>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-icon"><Icon name="building" size={16} /></span>
          <span className="workspace-text"><small>ESPAÇO DE TRABALHO</small><strong>Minha empresa</strong></span>
          <span className="chevron">⌄</span>
        </div>
        <nav className="main-nav" aria-label="Navegação principal">
          <span className="nav-caption">MENU</span>
          {navigation.map((item) => (
            <button
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              key={item.id}
              onClick={() => changePage(item.id)}
              aria-current={page === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.id === 'alerts' && activeAlerts > 0 && <span className="nav-count">{activeAlerts}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="connection-card">
            <span className="connection-dot" />
            <span><strong>Dados locais demonstrativos</strong><small>Nenhum medidor integrado</small></span>
          </div>
          <div className="demo-notice">Protótipo de UX/UI<br /><strong>Dados demonstrativos</strong></div>
          <div className="profile-row">
            <div className="avatar">JM</div>
            <span><strong>Juliana Martins</strong><small>Proprietária</small></span>
            <span className="profile-menu">···</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Minha empresa</span><span className="breadcrumb-separator">/</span><strong>{pageTitle(page)}</strong></div>
          <div className="topbar-actions">
            <span className="today-label"><Icon name="clock" size={15} /> Dados de exemplo</span>
            <button className="icon-button notification-button" aria-label={`${activeAlerts} alertas ativos`} onClick={() => changePage('alerts')}>
              <Icon name="bell" size={18} />
              {activeAlerts > 0 && <span className="notification-dot" />}
            </button>
            <div className="top-avatar" aria-label="Perfil Juliana Martins">JM</div>
          </div>
        </header>

        {storageError && (
          <div className="error-banner" role="alert">
            <Icon name="alert" size={17} /> <span>{storageError}</span>
            <button onClick={() => setStorageError('')} aria-label="Fechar mensagem">×</button>
          </div>
        )}

        {page === 'dashboard' && (
          <DashboardPage
            dashboard={dashboard}
            alerts={alerts}
            settings={settings}
            onNavigate={changePage}
            onResolveAlert={(id) => updateAlert(id, 'resolved', 'Encerrado pelo painel.')}
          />
        )}
        {page === 'history' && <HistoryPage tariff={settings.tariffPerKwh} />}
        {page === 'alerts' && <AlertsPage alerts={alerts} onUpdate={updateAlert} />}
        {page === 'settings' && (
          <SettingsPage settings={settings} isDirty={settingsDirty} onChange={updateSettings} onSave={saveSettings} />
        )}
        <footer className="app-footer">
          <span>Energia Clara <span className="footer-dot">·</span> Monitoramento de energia para o seu negócio</span>
          <span>Os valores exibidos são demonstrativos e não substituem a fatura da distribuidora.</span>
        </footer>
      </main>

      <nav className="mobile-nav" aria-label="Navegação móvel">
        {navigation.map((item) => (
          <button
            key={item.id}
            className={page === item.id ? 'active' : ''}
            onClick={() => changePage(item.id)}
            aria-current={page === item.id ? 'page' : undefined}
          >
            <span className="mobile-icon-wrap"><Icon name={item.icon} size={19} />{item.id === 'alerts' && activeAlerts > 0 && <i />}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      {toast && <div className="toast" role="status"><Icon name="check" size={17} />{toast}</div>}
    </div>
  );
}

function pageTitle(page: PageId): string {
  return navigation.find((item) => item.id === page)?.label ?? 'Dashboard';
}

function PageHeading({ eyebrow, title, description, action }: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function SectionTitle({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  return (
    <div className="section-title">
      <div><h2>{title}</h2>{detail && <p>{detail}</p>}</div>
      {action}
    </div>
  );
}

function DashboardPage({
  dashboard,
  alerts,
  settings,
  onNavigate,
  onResolveAlert,
}: {
  dashboard: ReturnType<DemoRepository['getDashboard']>;
  alerts: EnergyAlert[];
  settings: BusinessSettings;
  onNavigate: (page: PageId) => void;
  onResolveAlert: (id: string) => void;
}) {
  const visibleAlerts = alerts.filter((alert) => alert.status === 'active').slice(0, 3);
  const dailyPercent = Math.min((dashboard.dailyEnergyKwh / settings.dailyLimitKwh) * 100, 100);
  const todayLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="page-content">
      <PageHeading
        eyebrow={todayLabel.toLocaleUpperCase('pt-BR')}
        title={`${greeting}, Juliana`}
        description="Veja o que está acontecendo com a energia da sua empresa."
        action={<button className="button button-outline" onClick={() => onNavigate('history')}><Icon name="chart" size={16} /> Ver relatório</button>}
      />
      <div className="status-strip">
        <span><i className="status-dot" /> Sistema funcionando normalmente</span>
        <span>Leitura demonstrativa: {dashboard.lastReading} <span className="measured-tag">DADO SIMULADO</span></span>
      </div>

      <section className="metric-grid" aria-label="Indicadores de consumo">
        <article className="metric-card">
          <div className="metric-card-top"><span className="metric-icon blue"><Icon name="bolt" /></span><span className="metric-label">Consumo instantâneo</span><button className="help-dot" title="Energia utilizada neste instante, medida em quilowatts (kW)." aria-label="Sobre o consumo instantâneo">?</button></div>
          <div className="metric-value">{formatNumber(dashboard.currentPowerKw)} <small>kW</small></div>
          <div className="metric-foot"><span>Limite configurado: {formatNumber(settings.instantLimitKw)} kW</span><span className="metric-status status-safe">Normal</span></div>
          <div className="metric-progress"><span className="blue-fill" style={{ width: `${Math.min(dashboard.currentPowerKw / settings.instantLimitKw * 100, 100)}%` }} /></div>
        </article>
        <article className="metric-card">
          <div className="metric-card-top"><span className="metric-icon green"><Icon name="chart" /></span><span className="metric-label">Consumo acumulado hoje</span><button className="help-dot" title="Energia consumida ao longo do dia, medida em quilowatts-hora (kWh)." aria-label="Sobre o consumo acumulado">?</button></div>
          <div className="metric-value">{formatNumber(dashboard.dailyEnergyKwh)} <small>kWh</small></div>
          <div className="metric-foot"><span>{formatNumber(dailyPercent, 0)}% do limite diário de {settings.dailyLimitKwh} kWh</span><span className="metric-status status-safe">No limite</span></div>
          <div className="metric-progress"><span className="green-fill" style={{ width: `${dailyPercent}%` }} /></div>
        </article>
        <article className="metric-card">
          <div className="metric-card-top"><span className="metric-icon yellow"><Icon name="building" /></span><span className="metric-label">Custo estimado no mês</span><button className="help-dot" title="Estimativa com base no consumo e tarifa configurada." aria-label="Sobre o custo estimado">?</button></div>
          <div className="metric-value">{formatCurrency(dashboard.monthlyEnergyKwh * settings.tariffPerKwh)}</div>
          <div className="metric-foot"><span>Estimativa · não substitui a fatura</span><span className="metric-status status-warn"><Icon name="arrow" size={12} /> {dashboard.monthChangePercent}%</span></div>
          <div className="metric-progress"><span className="yellow-fill" style={{ width: '66%' }} /></div>
        </article>
        <article className="metric-card">
          <div className="metric-card-top"><span className="metric-icon purple"><Icon name="spark" /></span><span className="metric-label">Energia solar hoje</span><button className="help-dot" title="Parcela do consumo atendida pela geração solar." aria-label="Sobre a energia solar">?</button></div>
          <div className="metric-value">{settings.solarEnabled ? '38%' : '—'} <small>{settings.solarEnabled ? 'do consumo' : 'desativada'}</small></div>
          <div className="metric-foot"><span>{settings.solarEnabled ? 'Autoconsumo da geração solar' : 'Ative o monitoramento nas configurações'}</span><span className="metric-status status-safe"><Icon name="leaf" size={13} /> Solar</span></div>
          <div className="metric-progress"><span className="purple-fill" style={{ width: settings.solarEnabled ? '38%' : '0%' }} /></div>
        </article>
      </section>

      <section className="content-grid dashboard-main-grid">
        <article className="panel consumption-panel">
          <SectionTitle title="Consumo ao longo do dia" detail="Acompanhe a energia utilizada por horário." action={<button className="text-button" onClick={() => onNavigate('history')}>Ver histórico <Icon name="arrow" size={14} /></button>} />
          <div className="chart-summary"><strong>{formatNumber(dashboard.dailyEnergyKwh)} <small>kWh</small></strong><span className="summary-comparison"><Icon name="arrow" size={13} /> 8,2% <span>vs. ontem</span></span></div>
          <EnergyChart data={dashboard.readings} max={14} compact />
          <div className="chart-legend"><span><i className="legend-blue" />Consumo da rede</span><span><i className="legend-green" />Energia solar</span><span className="chart-unit">kWh por hora</span></div>
        </article>
        <article className="panel origin-panel">
          <SectionTitle title="De onde vem sua energia?" detail="Distribuição do consumo de hoje." />
          <div className="origin-total"><strong>42,6 <small>kWh</small></strong><span>consumo total</span></div>
          <div className="origin-bar" aria-label="Distribuição das fontes de energia">
            <span style={{ width: '62%', background: '#6aa6ff' }} />
            <span style={{ width: '24%', background: '#d9ee70' }} />
            <span style={{ width: '14%', background: '#a58bfa' }} />
          </div>
          <div className="origin-list">
            {dashboard.origins.map((origin) => (
              <div className="origin-row" key={origin.label}>
                <span className="origin-name"><i style={{ backgroundColor: origin.color }} />{origin.label}</span>
                <strong>{origin.value}%</strong>
              </div>
            ))}
          </div>
          {!settings.solarEnabled && <p className="inline-note">Os indicadores solares estão desativados nas configurações.</p>}
        </article>
      </section>

      <section className="content-grid dashboard-lower-grid">
        <article className="panel alerts-panel">
          <SectionTitle
            title="Alertas que precisam de atenção"
            detail={visibleAlerts.length ? `${visibleAlerts.length} ocorrências em aberto` : 'Tudo em dia por aqui.'}
            action={<button className="text-button" onClick={() => onNavigate('alerts')}>Ver todos <Icon name="arrow" size={14} /></button>}
          />
          {visibleAlerts.length ? (
            <div className="recent-alert-list">
              {visibleAlerts.map((alert, index) => (
                <div className="recent-alert" key={alert.id}>
                  <span className={`alert-icon ${index === 0 ? 'alert-orange' : 'alert-blue'}`}><Icon name={index === 0 ? 'alert' : 'clock'} size={17} /></span>
                  <div className="recent-alert-copy"><strong>{alert.title}</strong><span>{alert.detail}</span><small>{alert.happenedAt}</small></div>
                  <button className="resolve-icon-button" onClick={() => onResolveAlert(alert.id)} title="Encerrar alerta" aria-label={`Encerrar: ${alert.title}`}><Icon name="check" size={16} /></button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><span className="empty-icon"><Icon name="check" size={20} /></span><strong>Nenhum alerta ativo</strong><p>Vamos avisar se algo sair do esperado.</p></div>
          )}
        </article>
        <article className="recommendation-card">
          <div className="recommendation-icon"><Icon name="spark" size={20} /></div>
          <span className="recommendation-label">DICA PARA ECONOMIZAR</span>
          <h2>Use a energia solar a seu favor</h2>
          <p>Entre 10h e 14h sua geração solar costuma ser maior. Se puder, programe equipamentos de maior consumo para esse período.</p>
          <button className="recommendation-link" onClick={() => onNavigate('history')}>Explorar horários <Icon name="arrow" size={14} /></button>
          <span className="recommendation-decoration"><Icon name="sun" size={112} /></span>
        </article>
      </section>

      <section className="quick-links">
        <button onClick={() => onNavigate('history')}><span><Icon name="chart" /></span><strong>Consultar histórico</strong><small>Veja seus dados por período</small><Icon name="arrow" size={15} /></button>
        <button onClick={() => onNavigate('alerts')}><span><Icon name="bell" /></span><strong>Gerenciar alertas</strong><small>Revise ocorrências recentes</small><Icon name="arrow" size={15} /></button>
        <button onClick={() => onNavigate('settings')}><span><Icon name="settings" /></span><strong>Ajustar configurações</strong><small>Horários, limites e equipamentos</small><Icon name="arrow" size={15} /></button>
      </section>
    </div>
  );
}

function EnergyChart({ data, max, compact = false, compare = false }: {
  data: ReturnType<typeof getHistoryReadings>;
  max: number;
  compact?: boolean;
  compare?: boolean;
}) {
  return (
    <div className={`chart-wrap ${compact ? 'compact-chart' : ''}`}>
      <div className="chart-y-axis" aria-hidden="true"><span>{max}</span><span>{formatNumber(max / 2)}</span><span>0</span></div>
      <div className="chart-plot">
        <div className="chart-grid-lines"><i /><i /><i /></div>
        <div className={`chart-bars ${data.length > 12 ? 'many-bars' : ''}`}>
          {data.map((point, index) => {
            const height = Math.max((point.total / max) * 100, 2);
            const solarHeight = (point.solar / point.total) * 100;
            const previousHeight = height * (index % 3 === 0 ? 0.78 : 0.86);
            return (
              <div className="chart-column" key={`${point.label}-${index}`} title={`${point.label}: ${formatNumber(point.total)} kWh`}>
                <div className="bar-stack">
                  {compare && <span className="comparison-bar" style={{ height: `${previousHeight}%` }} />}
                  <span className="consumption-bar" style={{ height: `${height}%` }}>
                    <i style={{ height: `${solarHeight}%` }} />
                  </span>
                </div>
                {(!compact || data.length <= 8 || index % 4 === 0 || index === data.length - 1) && <span className="chart-x-label">{point.label}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HistoryPage({ tariff }: { tariff: number }) {
  const [period, setPeriod] = useState<HistoryPeriod>('week');
  const [compare, setCompare] = useState(false);
  const readings = useMemo(() => getHistoryReadings(period), [period]);
  const summary = useMemo(() => summarizeHistory(readings, tariff), [readings, tariff]);
  const max = period === 'today' ? 14 : period === 'week' ? 150 : 150;
  const periodLabel = period === 'today' ? 'hoje' : period === 'week' ? 'últimos 7 dias' : 'últimos 30 dias';

  const exportReport = () => {
    const rows = [
      ['Período', 'Consumo total (kWh)', 'Energia da rede (kWh)', 'Energia solar (kWh)'],
      ...readings.map((item) => [item.label, item.total.toFixed(1), item.grid.toFixed(1), item.solar.toFixed(1)]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map((field) => `"${field.replaceAll('"', '""')}"`).join(';')).join('\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `energia-clara-relatorio-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-content">
      <PageHeading eyebrow="DADOS DE CONSUMO" title="Histórico de consumo" description="Explore seus dados e compare o uso de energia ao longo do tempo." />
      <section className="panel history-panel">
        <div className="history-toolbar">
          <div className="segmented-control" aria-label="Período do histórico">
            {([
              ['today', 'Hoje'],
              ['week', 'Últimos 7 dias'],
              ['month', 'Últimos 30 dias'],
            ] as [HistoryPeriod, string][]).map(([id, label]) => (
              <button key={id} className={period === id ? 'selected' : ''} onClick={() => setPeriod(id)} aria-pressed={period === id}>{label}</button>
            ))}
          </div>
          <label className="compare-control"><input type="checkbox" checked={compare} onChange={(event) => setCompare(event.target.checked)} /><span>Comparar com período anterior</span></label>
        </div>
        <div className="history-period-line"><span><Icon name="clock" size={15} /> Consumo nos {periodLabel}</span><span className="measured-tag">DADOS SIMULADOS</span></div>
        <div className="history-chart-summary"><strong>{formatNumber(summary.totalKwh)} <small>kWh</small></strong><span>{formatCurrency(summary.estimatedCost)} estimados no período</span></div>
        <EnergyChart data={readings} max={max} compare={compare} />
        <div className="chart-legend history-legend"><span><i className="legend-blue" />Consumo da rede</span><span><i className="legend-green" />Energia solar</span>{compare && <span><i className="legend-muted" />Período anterior</span>}<span className="chart-unit">Consumo em kWh</span></div>
      </section>
      <div className="history-summary-heading"><div><h2>Resumo do período</h2><p>Uma visão geral do uso de energia.</p></div><button className="button button-outline" onClick={exportReport}><Icon name="download" size={16} /> Exportar relatório</button></div>
      <section className="history-summary-grid">
        <SummaryCard icon="chart" label="Consumo total" value={`${formatNumber(summary.totalKwh)} kWh`} detail={`nos ${periodLabel}`} color="blue" />
        <SummaryCard icon="building" label="Custo estimado" value={formatCurrency(summary.estimatedCost)} detail={`Tarifa de ${formatCurrency(tariff)}/kWh`} color="yellow" />
        <SummaryCard icon="clock" label="Média diária" value={`${formatNumber(summary.dailyAverageKwh)} kWh`} detail={period === 'today' ? 'até agora' : 'por dia'} color="green" />
        <SummaryCard icon="bolt" label="Maior consumo" value={`${formatNumber(summary.peakKwh)} kWh`} detail={`Em ${summary.peakLabel}`} color="purple" />
      </section>
      <div className="history-insight"><span className="insight-icon"><Icon name="sun" size={19} /></span><span><strong>{formatNumber(summary.solarKwh)} kWh vieram da geração solar</strong><small>Essa energia foi consumida diretamente ou gerada no período selecionado.</small></span><span className="solar-share">{summary.totalKwh ? formatNumber(summary.solarKwh / summary.totalKwh * 100, 0) : '0'}%</span></div>
      <p className="data-disclaimer">Custos apresentados são estimativas calculadas pela tarifa configurada e não incluem todos os encargos, impostos ou ajustes da distribuidora.</p>
    </div>
  );
}

function SummaryCard({ icon, label, value, detail, color }: { icon: string; label: string; value: string; detail: string; color: string }) {
  return <article className="summary-card"><span className={`metric-icon ${color}`}><Icon name={icon} size={17} /></span><span className="summary-label">{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

function AlertsPage({ alerts, onUpdate }: {
  alerts: EnergyAlert[];
  onUpdate: (id: string, status: AlertStatus, reason?: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const filteredAlerts = alerts.filter((alert) => filter === 'all' || alert.status === filter);
  const activeCount = alerts.filter((alert) => alert.status === 'active').length;
  const resolvedCount = alerts.length - activeCount;

  return (
    <div className="page-content">
      <PageHeading eyebrow="ACOMPANHAMENTO" title="Alertas" description="Acompanhe situações que podem merecer uma verificação na sua empresa." />
      <div className="alert-overview">
        <div className="alert-overview-icon"><Icon name="bell" size={19} /></div>
        <span><strong>{activeCount ? `${activeCount} alertas precisam da sua atenção` : 'Tudo em dia por aqui'}</strong><small>Alertas são baseados nas leituras e nos limites configurados.</small></span>
        <span className="alert-overview-count">{activeCount}<small>ativos</small></span>
      </div>
      <section className="panel alerts-list-panel">
        <div className="alerts-toolbar">
          <div className="segmented-control">
            <button className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>Todos <span>{alerts.length}</span></button>
            <button className={filter === 'active' ? 'selected' : ''} onClick={() => setFilter('active')} aria-pressed={filter === 'active'}>Ativos <span>{activeCount}</span></button>
            <button className={filter === 'resolved' ? 'selected' : ''} onClick={() => setFilter('resolved')} aria-pressed={filter === 'resolved'}>Encerrados <span>{resolvedCount}</span></button>
          </div>
          <span className="alerts-sort"><Icon name="clock" size={14} /> Mais recentes</span>
        </div>
        {filteredAlerts.length ? (
          <div className="alert-list">
            {filteredAlerts.map((alert) => (
              <article className={`alert-card ${alert.status}`} key={alert.id}>
                <span className={`alert-icon ${alert.status === 'active' ? 'alert-orange' : 'alert-green'}`}><Icon name={alert.status === 'active' ? 'alert' : 'check'} size={18} /></span>
                <div className="alert-card-body">
                  <div className="alert-card-title"><h2>{alert.title}</h2><span className={`status-pill ${alert.status}`}>{alert.status === 'active' ? 'Ativo' : 'Encerrado'}</span></div>
                  <p>{alert.detail}</p>
                  <div className="alert-card-meta"><span><Icon name="clock" size={13} />{alert.happenedAt}</span><span><Icon name="chart" size={13} />Dado demonstrativo</span></div>
                  {alert.reason && <div className="resolution-note"><Icon name="check" size={14} />Ação registrada: {alert.reason}</div>}
                </div>
                {alert.status === 'active' && (
                  <button className="button button-small button-outline" onClick={() => {
                    const reason = window.prompt('Registre a causa ou ação tomada para este alerta:');
                    if (reason === null) return;
                    onUpdate(alert.id, 'resolved', reason.trim() || 'Verificado pela equipe.');
                  }}><Icon name="check" size={14} /> Encerrar</button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state"><span className="empty-icon"><Icon name="check" size={20} /></span><strong>Nenhum alerta nesta categoria</strong><p>Seus alertas aparecerão aqui quando houver novas ocorrências.</p></div>
        )}
      </section>
      <p className="data-disclaimer">Alertas são informativos. Confirme a situação dos equipamentos antes de tomar qualquer ação.</p>
    </div>
  );
}

function SettingsPage({ settings, isDirty, onChange, onSave }: {
  settings: BusinessSettings;
  isDirty: boolean;
  onChange: (settings: BusinessSettings) => void;
  onSave: () => void;
}) {
  const [newEquipmentName, setNewEquipmentName] = useState('');
  const [newEquipmentPower, setNewEquipmentPower] = useState('');
  const [newEquipmentHours, setNewEquipmentHours] = useState('');
  const [formError, setFormError] = useState('');

  const patch = <K extends keyof BusinessSettings>(key: K, value: BusinessSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const toggleNotification = (key: keyof BusinessSettings['notifications']) => {
    patch('notifications', { ...settings.notifications, [key]: !settings.notifications[key] });
  };

  const addEquipment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const powerKw = Number(newEquipmentPower);
    const hoursPerDay = Number(newEquipmentHours);
    if (!newEquipmentName.trim() || !Number.isFinite(powerKw) || powerKw <= 0 || !Number.isFinite(hoursPerDay) || hoursPerDay <= 0 || hoursPerDay > 24) {
      setFormError('Informe o nome, uma potência maior que zero e até 24 horas de uso por dia.');
      return;
    }
    const equipment: Equipment = {
      id: `equipment-${Date.now()}`,
      name: newEquipmentName.trim(),
      powerKw,
      hoursPerDay,
    };
    patch('equipment', [...settings.equipment, equipment]);
    setNewEquipmentName('');
    setNewEquipmentPower('');
    setNewEquipmentHours('');
    setFormError('');
  };

  const removeEquipment = (id: string) => {
    patch('equipment', settings.equipment.filter((item) => item.id !== id));
  };

  return (
    <div className="page-content settings-page">
      <PageHeading eyebrow="PERSONALIZE SEU MONITORAMENTO" title="Configurações" description="Ajuste os horários, limites e informações da sua unidade." />
      <div className="settings-notice"><span><Icon name="spark" size={17} /></span><p><strong>Configure os dados da sua empresa</strong><br />Essas informações ajudam a contextualizar seus alertas e estimativas. Você pode alterá-las sempre que precisar.</p></div>

      <section className="panel settings-section">
        <SectionTitle title="Horário de funcionamento" detail="Usamos essa informação para identificar consumo fora do expediente." />
        <div className="settings-field-group">
          <span className="field-label">Dias de funcionamento</span>
          <div className="weekday-picker">
            {weekdayNames.map((day, index) => {
              const active = settings.activeDays.includes(index);
              return <button key={day} className={active ? 'selected' : ''} aria-pressed={active} onClick={() => patch('activeDays', active ? settings.activeDays.filter((item) => item !== index) : [...settings.activeDays, index].sort())}>{day}</button>;
            })}
          </div>
        </div>
        <div className="settings-input-grid time-grid">
          <Field label="Abertura" value={settings.openingTime} type="time" onChange={(value) => patch('openingTime', value)} />
          <Field label="Fechamento" value={settings.closingTime} type="time" onChange={(value) => patch('closingTime', value)} />
        </div>
        <ToggleRow label="Possui intervalo de funcionamento" detail="Consumo durante esse período também será identificado separadamente." checked={settings.breakEnabled} onChange={() => patch('breakEnabled', !settings.breakEnabled)} />
        {settings.breakEnabled && <div className="settings-input-grid time-grid break-times"><Field label="Início do intervalo" value={settings.breakStart} type="time" onChange={(value) => patch('breakStart', value)} /><Field label="Fim do intervalo" value={settings.breakEnd} type="time" onChange={(value) => patch('breakEnd', value)} /></div>}
      </section>

      <section className="panel settings-section">
        <SectionTitle title="Limites de consumo" detail="Defina quando você gostaria de ser avisado sobre o consumo." />
        <div className="settings-input-grid three-columns">
          <Field label="Limite instantâneo" unit="kW" value={settings.instantLimitKw} type="number" min={0} step={0.1} onChange={(value) => patch('instantLimitKw', Number(value))} />
          <Field label="Limite diário" unit="kWh" value={settings.dailyLimitKwh} type="number" min={0} step={1} onChange={(value) => patch('dailyLimitKwh', Number(value))} />
          <Field label="Limite mensal" unit="kWh" value={settings.monthlyLimitKwh} type="number" min={0} step={1} onChange={(value) => patch('monthlyLimitKwh', Number(value))} />
        </div>
      </section>

      <section className="panel settings-section">
        <SectionTitle title="Equipamentos" detail="Cadastre aparelhos para estimar seu consumo quando não houver medição individual." />
        <div className="equipment-list">
          {settings.equipment.length ? settings.equipment.map((equipment) => (
            <div className="equipment-row" key={equipment.id}>
              <span className="equipment-icon"><Icon name="bolt" size={16} /></span>
              <span className="equipment-copy"><strong>{equipment.name}</strong><small>{formatNumber(equipment.powerKw, 2)} kW · {formatNumber(equipment.hoursPerDay, 0)} h/dia · consumo estimado</small></span>
              <button className="icon-button remove-button" onClick={() => removeEquipment(equipment.id)} aria-label={`Remover ${equipment.name}`} title="Remover equipamento"><Icon name="trash" size={16} /></button>
            </div>
          )) : <p className="empty-inline">Nenhum equipamento cadastrado.</p>}
        </div>
        <form className="equipment-form" onSubmit={addEquipment}>
          <Field label="Nome do equipamento" value={newEquipmentName} placeholder="Ex.: Forno elétrico" onChange={setNewEquipmentName} />
          <Field label="Potência" unit="kW" value={newEquipmentPower} placeholder="2,0" type="number" min={0} step={0.1} onChange={setNewEquipmentPower} />
          <Field label="Horas de uso" unit="h/dia" value={newEquipmentHours} placeholder="4" type="number" min={0} max={24} step={0.5} onChange={setNewEquipmentHours} />
          <button className="button button-outline add-equipment-button" type="submit"><Icon name="plus" size={16} /> Adicionar</button>
          {formError && <p className="field-error" role="alert">{formError}</p>}
        </form>
        <p className="settings-help">Valores de equipamentos são estimativas e não representam medições individuais.</p>
      </section>

      <section className="panel settings-section">
        <SectionTitle title="Tarifa de energia" detail="Utilizada para calcular uma estimativa de custo do consumo." />
        <div className="tariff-input"><Field label="Valor do kWh" unit="R$/kWh" value={settings.tariffPerKwh} type="number" min={0} step={0.01} onChange={(value) => patch('tariffPerKwh', Number(value))} /></div>
        <p className="settings-help">A estimativa não inclui todos os tributos, encargos, bandeiras ou créditos e não substitui a fatura oficial.</p>
      </section>

      <section className="panel settings-section solar-section">
        <SectionTitle title="Energia solar" detail="Acompanhe a geração e a participação da energia solar no seu consumo." />
        <ToggleRow label="Ativar monitoramento solar" detail="Exibe indicadores solares no painel demonstrativo." checked={settings.solarEnabled} onChange={() => patch('solarEnabled', !settings.solarEnabled)} />
        {settings.solarEnabled && <div className="solar-capacity"><Field label="Capacidade instalada" unit="kWp" value={settings.solarCapacityKwp} type="number" min={0} step={0.1} onChange={(value) => patch('solarCapacityKwp', Number(value))} /><div className="integration-status"><i /> Integração demonstrativa conectada</div></div>}
      </section>

      <section className="panel settings-section">
        <SectionTitle title="Notificações" detail="Escolha quais alertas devem aparecer no seu painel." />
        <div className="toggle-list">
          <ToggleRow label="Consumo acima do limite" checked={settings.notifications.highConsumption} onChange={() => toggleNotification('highConsumption')} />
          <ToggleRow label="Consumo fora do expediente" checked={settings.notifications.afterHours} onChange={() => toggleNotification('afterHours')} />
          <ToggleRow label="Resumo mensal de consumo" checked={settings.notifications.monthlySummary} onChange={() => toggleNotification('monthlySummary')} />
        </div>
      </section>
      <div className="settings-save-bar"><span>{isDirty ? 'As alterações ainda não foram salvas.' : 'Todas as alterações estão salvas neste navegador.'}</span><button className="button button-primary" onClick={onSave}><Icon name="check" size={16} /> Salvar configurações</button></div>
      <p className="settings-disclaimer">Configurações e equipamentos são armazenados apenas neste navegador durante a demonstração. Nenhum dado é enviado para um servidor.</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  unit,
  placeholder,
  min,
  max,
  step,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  unit?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="field-control">
        <input type={type} value={value} placeholder={placeholder} min={min} max={max} step={step} onChange={(event) => onChange(event.target.value)} />
        {unit && <span className="field-unit">{unit}</span>}
      </span>
    </label>
  );
}

function ToggleRow({ label, detail, checked, onChange }: { label: string; detail?: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="toggle-row">
      <span><strong>{label}</strong>{detail && <small>{detail}</small>}</span>
      <button className={`switch ${checked ? 'on' : ''}`} role="switch" aria-checked={checked} aria-label={label} onClick={onChange}><i /></button>
    </div>
  );
}

export default App;
