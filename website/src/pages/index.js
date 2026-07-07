import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

const T = {
  es: {
    layoutTitle: 'IA Agéntica · Fundamentos y Casos de uso',
    layoutDesc: 'Fundamentos y catálogo de casos de uso de IA agéntica y generativa.',
    heroTitle: 'IA Agéntica',
    heroSubtitle: 'Fundamentos y catálogo de casos de uso. Empieza por los conceptos base y explora los casos por rol con su reproductor de escenario y su remediación con gobierno de IA.',
    btnFund: 'Fundamentos', btnCat: 'Catálogo de casos',
    secciones: [
      {to: '/fundamentos', titulo: 'Fundamentos', kicker: '9 capítulos',
       desc: 'Los conceptos base para entender IA agéntica: LLM, tokens, MCP, agentgateway, kagent, agentregistry, riesgos y coste.'},
      {to: '/casos-de-uso', titulo: 'Casos de uso', kicker: '126 casos · 13 roles',
       desc: 'Catálogo por rol, técnica y madurez. Cada caso abre un reproductor con las cinco etapas y su remediación con gobierno de IA.'},
    ],
  },
  en: {
    layoutTitle: 'Agentic AI · Fundamentals and Use cases',
    layoutDesc: 'Fundamentals and catalog of agentic and generative AI use cases.',
    heroTitle: 'Agentic AI',
    heroSubtitle: 'Fundamentals and use-case catalog. Start with the base concepts and explore the cases by role with their scenario player and their governed AI remediation.',
    btnFund: 'Fundamentals', btnCat: 'Case catalog',
    secciones: [
      {to: '/fundamentos', titulo: 'Fundamentals', kicker: '9 chapters',
       desc: 'The base concepts to understand agentic AI: LLM, tokens, MCP, agentgateway, kagent, agentregistry, risks and cost.'},
      {to: '/casos-de-uso', titulo: 'Use cases', kicker: '126 cases · 13 roles',
       desc: 'Catalog by role, technique and maturity. Each case opens a player with the five stages and its governed AI remediation.'},
    ],
  },
};

export default function Home() {
  const {i18n} = useDocusaurusContext();
  const t = T[i18n.currentLocale === 'en' ? 'en' : 'es'];
  return (
    <Layout title={t.layoutTitle} description={t.layoutDesc}>
      <header className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{t.heroSubtitle}</p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/fundamentos">
              {t.btnFund}
            </Link>
            <Link className="button button--secondary button--lg" to="/casos-de-uso">
              {t.btnCat}
            </Link>
          </div>
        </div>
      </header>

      <main className="container margin-vert--xl">
        <div className={styles.secciones}>
          {t.secciones.map((s) => (
            <Link key={s.to} to={s.to} className={styles.seccion}>
              <div className={styles.seccionKicker}>{s.kicker}</div>
              <h3>{s.titulo}</h3>
              <p>{s.desc}</p>
            </Link>
          ))}
        </div>

      </main>
    </Layout>
  );
}
