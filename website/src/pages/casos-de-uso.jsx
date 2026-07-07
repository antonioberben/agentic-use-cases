import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import casos from '@site/src/data/casos.json';
import styles from './casos-de-uso.module.css';

const ROLES = [
  ['manager', 'Manager'],
  ['analista', {es: 'Analista', en: 'Analyst'}],
  ['desarrollador', {es: 'Desarrollador', en: 'Developer'}],
  ['operador', {es: 'Operador', en: 'Operator'}],
  ['finanzas', {es: 'Finanzas', en: 'Finance'}],
  ['legal', 'Legal'],
  ['rrhh', {es: 'RRHH', en: 'HR'}],
  ['ventas', {es: 'Ventas', en: 'Sales'}],
  ['marketing', 'Marketing'],
  ['soporte', {es: 'Soporte', en: 'Support'}],
  ['it-seguridad', {es: 'IT / Seguridad', en: 'IT / Security'}],
  ['ejecutivo', {es: 'Ejecutivo', en: 'Executive'}],
  ['frontline', 'Frontline'],
];

// Técnicas: la clave (id) es el valor del dato en casos.json (español); el label se localiza.
const TECNICAS = [
  ['analítico', {es: 'analítico', en: 'analytical'}],
  ['documentos', {es: 'documentos', en: 'documents'}],
  ['triage', {es: 'triage', en: 'triage'}],
  ['asistencia', {es: 'asistencia', en: 'assistance'}],
  ['código', {es: 'código', en: 'code'}],
  ['operacional', {es: 'operacional', en: 'operational'}],
  ['generación', {es: 'generación', en: 'generation'}],
  ['shadow AI', {es: 'shadow AI', en: 'shadow AI'}],
];

const MADUREZ = ['1+', '3+'];

const ARQUETIPOS = [
  ['A1', {es: 'A1 · Documental + validador', en: 'A1 · Documental + validator'}],
  ['A2', {es: 'A2 · Triage con acción gated', en: 'A2 · Triage with gated action'}],
  ['A3', {es: 'A3 · Analítico write-back gated', en: 'A3 · Analytical gated write-back'}],
  ['A4', {es: 'A4 · Chatbot cara al cliente', en: 'A4 · Customer-facing chatbot'}],
  ['A5', {es: 'A5 · Operacional sobre infra', en: 'A5 · Operational over infra'}],
  ['A6', {es: 'A6 · Investigación + síntesis', en: 'A6 · Research + synthesis'}],
  ['A7', {es: 'A7 · Generación con guardrails', en: 'A7 · Generation with guardrails'}],
  ['A8', {es: 'A8 · Asistente de código', en: 'A8 · Code assistant'}],
];

const CAPACIDADES = [
  ['chain-de-agentes', {es: 'Chain de agentes', en: 'Agent chain'}],
  ['multi-llm-balanceo', {es: 'Multi-LLM / balanceo', en: 'Multi-LLM / balancing'}],
  ['agentevals', 'AgentEvals'],
  ['migracion-semantic-routing', {es: 'Migración / semantic routing', en: 'Migration / semantic routing'}],
  ['judge-llm', 'Judge LLM'],
  ['guardrails-externos', {es: 'Guardrails externos', en: 'External guardrails'}],
  ['llm-gateway-codigo', {es: 'LLM Gateway para código', en: 'LLM Gateway for code'}],
];

const GATEWAYS = ['LLM Gateway', 'MCP Gateway', 'AgentGateway'];

const MODES = [
  {id: 'rol', label: {es: 'Por rol', en: 'By role'}},
  {id: 'tecnica', label: {es: 'Por técnica', en: 'By technique'}},
  {id: 'arquetipo', label: {es: 'Por arquetipo', en: 'By archetype'}},
  {id: 'capacidad', label: {es: 'Por capacidad', en: 'By capability'}},
  {id: 'gateway', label: {es: 'Por gateway', en: 'By gateway'}},
  {id: 'madurez', label: {es: 'Por madurez', en: 'By maturity'}},
];

const T = {
  es: {
    layoutTitle: 'Casos de uso', layoutDesc: 'Catálogo de casos de uso de IA agéntica por rol',
    search: 'Buscar caso, rol o técnica…', all: 'Todos', maturity: 'madurez',
    empty: 'Sin resultados.', readme: 'README ↗', readmeTitle: 'Abrir README en GitHub',
  },
  en: {
    layoutTitle: 'Use cases', layoutDesc: 'Catalog of agentic AI use cases by role',
    search: 'Search case, role or technique…', all: 'All', maturity: 'maturity',
    empty: 'No results.', readme: 'README ↗', readmeTitle: 'Open README on GitHub',
  },
};

export default function CasosDeUsoPage() {
  const {i18n} = useDocusaurusContext();
  const lang = i18n.currentLocale === 'en' ? 'en' : 'es';
  const P = (v) => (v && typeof v === 'object' && ('es' in v || 'en' in v)) ? v[lang] : v;
  const t = T[lang];
  // Mapas id→label localizado, para tarjetas.
  const ROLE_LBL = useMemo(() => Object.fromEntries(ROLES.map(([id, l]) => [id, P(l)])), [lang]);
  const TEC_LBL = useMemo(() => Object.fromEntries(TECNICAS.map(([id, l]) => [id, P(l)])), [lang]);

  const [mode, setMode] = useState('rol');
  const [filter, setFilter] = useState('todos');
  const [q, setQ] = useState('');

  const groups = useMemo(() => {
    if (mode === 'rol') return ROLES.map(([id, label]) => ({id, label: P(label)}));
    if (mode === 'tecnica') return TECNICAS.map(([id, label]) => ({id, label: P(label)}));
    if (mode === 'arquetipo') return ARQUETIPOS.map(([id, label]) => ({id, label: P(label)}));
    if (mode === 'capacidad') return CAPACIDADES.map(([id, label]) => ({id, label: P(label)}));
    if (mode === 'gateway') return GATEWAYS.map(id => ({id, label: id}));
    return MADUREZ.map(id => ({id, label: `${t.maturity} ${id}`}));
  }, [mode, lang]);

  const counts = useMemo(() => {
    const c = {};
    for (const cs of casos) {
      if (mode === 'arquetipo') {
        for (const a of cs.arquetipos || []) c[a] = (c[a] || 0) + 1;
      } else if (mode === 'capacidad') {
        for (const cap of cs.capacidades || []) c[cap] = (c[cap] || 0) + 1;
      } else if (mode === 'gateway') {
        for (const g of cs.gateways || []) c[g] = (c[g] || 0) + 1;
      } else {
        const key = mode === 'rol' ? cs.rol : mode === 'tecnica' ? cs.tecnica : cs.madurez;
        c[key] = (c[key] || 0) + 1;
      }
    }
    return c;
  }, [mode]);

  const visibles = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return casos.filter(cs => {
      if (filter !== 'todos') {
        if (mode === 'arquetipo') {
          if (!(cs.arquetipos || []).includes(filter)) return false;
        } else if (mode === 'capacidad') {
          if (!(cs.capacidades || []).includes(filter)) return false;
        } else if (mode === 'gateway') {
          if (!(cs.gateways || []).includes(filter)) return false;
        } else {
          const key = mode === 'rol' ? cs.rol : mode === 'tecnica' ? cs.tecnica : cs.madurez;
          if (key !== filter) return false;
        }
      }
      if (!needle) return true;
      return (
        cs.titulo.toLowerCase().includes(needle) ||
        cs.rol.includes(needle) ||
        cs.tecnica.toLowerCase().includes(needle) ||
        (cs.arquetipos || []).join(' ').toLowerCase().includes(needle) ||
        (cs.capacidadesLabel || []).join(' ').toLowerCase().includes(needle) ||
        (cs.gateways || []).join(' ').toLowerCase().includes(needle)
      );
    });
  }, [q, filter, mode]);

  const switchMode = (m) => { setMode(m); setFilter('todos'); };
  // Etiqueta localizada de capacidad por id (casos.json trae capacidadesLabel en ES).
  const CAP_LBL = useMemo(() => Object.fromEntries(CAPACIDADES.map(([id, l]) => [id, P(l)])), [lang]);

  return (
    <Layout title={t.layoutTitle} description={t.layoutDesc}>
      <div className={styles.page}>
        <div className={styles.window}>
          <div className={styles.titlebar}>
            <span className={styles.dot} style={{background: '#ff5f56'}} />
            <span className={styles.dot} style={{background: '#ffbd2e'}} />
            <span className={styles.dot} style={{background: '#27c93f'}} />
            <span className={styles.crumb}>training-ia / use-cases</span>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>⌕</span>
              <input
                className={styles.search}
                placeholder={t.search}
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
            <div className={styles.modeToggle}>
              {MODES.map(m => (
                <button
                  key={m.id}
                  className={mode === m.id ? styles.modeActive : styles.modeBtn}
                  onClick={() => switchMode(m.id)}
                >
                  {P(m.label)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.chips}>
            <button
              className={filter === 'todos' ? styles.chipActive : styles.chip}
              onClick={() => setFilter('todos')}
            >
              {t.all} <span className={styles.chipCount}>{casos.length}</span>
            </button>
            {groups.map(g => (
              <button
                key={g.id}
                className={filter === g.id ? styles.chipActive : styles.chip}
                onClick={() => setFilter(g.id)}
              >
                {g.label} <span className={styles.chipCount}>{counts[g.id] || 0}</span>
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {visibles.map(cs => {
              const isShadow = cs.tecnica === 'shadow AI';
              return (
                <Link
                  key={cs.id}
                  className={isShadow ? styles.cardDanger : styles.card}
                  to={`/casos-de-uso/detalle?case=${encodeURIComponent(cs.id)}`}
                >
                  <div className={isShadow ? styles.roleLabelDanger : styles.roleLabel}>
                    {(ROLE_LBL[cs.rol] || cs.rolLabel || cs.rol).toUpperCase()}
                  </div>
                  <div className={styles.cardTitle}>{P(cs.tituloI18n) || cs.titulo}</div>
                  <div className={styles.tags}>
                    <span className={isShadow ? styles.tagDanger : styles.tag}>{TEC_LBL[cs.tecnica] || cs.tecnica}</span>
                    {(cs.arquetipos || []).map(a => (
                      <span key={a} className={styles.tagArq}>{a}</span>
                    ))}
                    {(cs.capacidades || []).map(cap => (
                      <span key={cap} className={styles.tagCap}>{CAP_LBL[cap] || cap}</span>
                    ))}
                    <span className={styles.tagMadurez}>{t.maturity} {cs.madurez}</span>
                  </div>
                  <span
                    role="button"
                    title={t.readmeTitle}
                    style={{position: 'absolute', top: 10, right: 12, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', opacity: 0.55, padding: '2px 6px', border: '1px solid currentColor', borderRadius: 4, cursor: 'pointer'}}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(`https://github.com/antonioberben/agentic-use-cases/blob/main/${cs.path}`, '_blank', 'noopener,noreferrer');
                    }}
                  >{t.readme}</span>
                </Link>
              );
            })}
            {visibles.length === 0 && (
              <div className={styles.empty}>{t.empty}</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
