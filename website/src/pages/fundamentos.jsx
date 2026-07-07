import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './casos-de-uso.module.css';

// Fundamentos = 9 capítulos. Contenido pre-renderizado en build a
// src/data/fundamentos-detalle.json (ver scripts/build-fundamentos-data.js).
// El CUERPO de cada capítulo es solo español (contenido largo); aquí se
// localizan la ficha (título/desc/tag) y el chrome de la página.
const FUNDAMENTOS = [
  {n: '01', slug: 'que-es-un-llm', titulo: {es: 'Qué es un LLM', en: 'What is an LLM'},
   desc: {es: 'Modelo generativo probabilístico: qué hace, qué no hace, y por qué alucina.', en: 'Probabilistic generative model: what it does, what it does not, and why it hallucinates.'},
   tag: 'modelo'},
  {n: '02', slug: 'tokens-y-contexto', titulo: {es: 'Tokens y contexto', en: 'Tokens and context'},
   desc: {es: 'Ventana de contexto, coste por token, límites prácticos en producción.', en: 'Context window, cost per token, practical limits in production.'},
   tag: 'modelo'},
  {n: '03', slug: 'del-chat-al-agente', titulo: {es: 'Del chat al agente', en: 'From chat to agent'},
   desc: {es: 'Diferencia entre asistente conversacional y agente autónomo con herramientas.', en: 'Difference between a conversational assistant and an autonomous agent with tools.'},
   tag: 'agente'},
  {n: '04', slug: 'agents-md', titulo: 'AGENTS.md',
   desc: {es: 'Contrato de comportamiento del agente: reglas, prohibiciones, formato de salida.', en: 'Agent behavior contract: rules, prohibitions, output format.'},
   tag: 'agente'},
  {n: '05', slug: 'mcp', titulo: 'MCP — Model Context Protocol',
   desc: {es: 'Cómo el agente accede a herramientas y datos externos con scopes explícitos.', en: 'How the agent accesses external tools and data with explicit scopes.'},
   tag: 'protocolo'},
  {n: '06', slug: 'agentgateway', titulo: 'agentgateway',
   desc: {es: 'LLM + MCP gateway: identidad, allowlist, prompt guard, rate-limit, traza.', en: 'LLM + MCP gateway: identity, allowlist, prompt guard, rate-limit, trace.'},
   tag: 'plataforma'},
  {n: '07', slug: 'kagent', titulo: 'kagent',
   desc: {es: 'Ejecución de agentes con identidad propia (SPIFFE) y política aplicada.', en: 'Running agents with their own identity (SPIFFE) and enforced policy.'},
   tag: 'plataforma'},
  {n: '08', slug: 'agentregistry', titulo: 'agentregistry',
   desc: {es: 'Inventario transversal de agentes y MCPs; lo no registrado queda fuera.', en: 'Cross-cutting inventory of agents and MCPs; anything unregistered stays out.'},
   tag: 'plataforma'},
  {n: '09', slug: 'riesgos-y-coste', titulo: {es: 'Riesgos y coste', en: 'Risks and cost'},
   desc: {es: 'Prompt injection, shadow AI, exfiltración, MNPI y control de coste por agente.', en: 'Prompt injection, shadow AI, exfiltration, MNPI and per-agent cost control.'},
   tag: 'riesgo'},
];

const GRUPOS = [
  {id: 'todos', label: {es: 'Todos', en: 'All'}},
  {id: 'modelo', label: {es: 'Modelo', en: 'Model'}},
  {id: 'agente', label: {es: 'Agente', en: 'Agent'}},
  {id: 'protocolo', label: {es: 'Protocolo', en: 'Protocol'}},
  {id: 'plataforma', label: {es: 'Plataforma', en: 'Platform'}},
  {id: 'riesgo', label: {es: 'Riesgo', en: 'Risk'}},
];

const TAG_LBL = {
  modelo: {es: 'modelo', en: 'model'},
  agente: {es: 'agente', en: 'agent'},
  protocolo: {es: 'protocolo', en: 'protocol'},
  plataforma: {es: 'plataforma', en: 'platform'},
  riesgo: {es: 'riesgo', en: 'risk'},
};

const T = {
  es: {
    layoutTitle: 'Fundamentos', layoutDesc: '9 capítulos base de IA agéntica: LLM, tokens, MCP, agentgateway, kagent, agentregistry, riesgos y coste.',
    search: 'Buscar fundamento…', chapter: 'Cap.', empty: 'Sin resultados.',
  },
  en: {
    layoutTitle: 'Fundamentals', layoutDesc: '9 base chapters of agentic AI: LLM, tokens, MCP, agentgateway, kagent, agentregistry, risks and cost.',
    search: 'Search a fundamental…', chapter: 'Ch.', empty: 'No results.',
  },
};

export default function FundamentosPage() {
  const {i18n} = useDocusaurusContext();
  const lang = i18n.currentLocale === 'en' ? 'en' : 'es';
  const P = (v) => (v && typeof v === 'object' && ('es' in v || 'en' in v)) ? v[lang] : v;
  const t = T[lang];

  const [filter, setFilter] = useState('todos');
  const [q, setQ] = useState('');

  const visibles = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return FUNDAMENTOS.filter(f => {
      if (filter !== 'todos' && f.tag !== filter) return false;
      if (!needle) return true;
      return P(f.titulo).toLowerCase().includes(needle) || P(f.desc).toLowerCase().includes(needle);
    });
  }, [q, filter, lang]);

  return (
    <Layout title={t.layoutTitle} description={t.layoutDesc}>
      <div className={styles.page}>
        <div className={styles.window}>
          <div className={styles.titlebar}>
            <span className={styles.dot} style={{background: '#ff5f56'}} />
            <span className={styles.dot} style={{background: '#ffbd2e'}} />
            <span className={styles.dot} style={{background: '#27c93f'}} />
            <span className={styles.crumb}>training-ia / fundamentos</span>
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
          </div>

          <div className={styles.chips}>
            {GRUPOS.map(g => (
              <button
                key={g.id}
                className={filter === g.id ? styles.chipActive : styles.chip}
                onClick={() => setFilter(g.id)}
              >
                {P(g.label)}
                {g.id !== 'todos' && (
                  <span className={styles.chipCount}>
                    {FUNDAMENTOS.filter(f => f.tag === g.id).length}
                  </span>
                )}
                {g.id === 'todos' && <span className={styles.chipCount}>{FUNDAMENTOS.length}</span>}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {visibles.map(f => (
              <Link
                key={f.slug}
                className={styles.card}
                to={`/fundamentos/detalle?slug=${f.slug}`}
              >
                <div className={styles.roleLabel}>{t.chapter} {f.n}</div>
                <div className={styles.cardTitle}>{P(f.titulo)}</div>
                <div className={styles.tags}>
                  <span className={styles.tag}>{P(TAG_LBL[f.tag]) || f.tag}</span>
                </div>
                <p style={{margin: '10px 0 0', fontSize: 13, opacity: 0.75, lineHeight: 1.45}}>
                  {P(f.desc)}
                </p>
              </Link>
            ))}
            {visibles.length === 0 && <div className={styles.empty}>{t.empty}</div>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
