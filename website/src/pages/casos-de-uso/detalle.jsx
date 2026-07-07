import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ScenarioPlayer from '@site/src/components/ScenarioPlayer';

const T = {
  es: {
    layoutTitle: 'Detalle de caso de uso',
    layoutDesc: 'Reproductor de escenarios con las cinco etapas (contexto, solución, impacto, riesgo, remediación) y su gobierno con la plataforma Solo.io.',
    kicker: 'Catálogo · caso de uso',
    h1: 'Detalle del caso',
    intro: <>Cinco etapas: contexto, solución, impacto, riesgo y remediación con gobierno. Pulsa <b>“ir al detalle”</b> para saltar al bloque de texto completo.</>,
    back: '← Volver al catálogo',
  },
  en: {
    layoutTitle: 'Use case detail',
    layoutDesc: 'Scenario player with the five stages (context, solution, impact, risk, remediation) and its governance with the Solo.io platform.',
    kicker: 'Catalog · use case',
    h1: 'Case detail',
    intro: <>Five stages: context, solution, impact, risk and governed remediation. Click <b>“go to detail”</b> to jump to the full text block.</>,
    back: '← Back to the catalog',
  },
};

export default function DetalleCasoPage() {
  const {i18n} = useDocusaurusContext();
  const t = T[i18n.currentLocale === 'en' ? 'en' : 'es'];
  return (
    <Layout title={t.layoutTitle} description={t.layoutDesc}>
      <main style={{maxWidth: 960, margin: '0 auto', padding: '32px 24px 96px'}}>
        <p style={{fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: '#CC85FF', margin: '0 0 8px'}}>
          {t.kicker}
        </p>
        <h1 style={{marginTop: 0}}>{t.h1}</h1>
        <p style={{maxWidth: '62ch', opacity: .85, marginBottom: 12}}>
          {t.intro}
        </p>
        <p style={{marginBottom: 28}}>
          <Link to="/casos-de-uso">{t.back}</Link>
        </p>
        <ScenarioPlayer />
      </main>
    </Layout>
  );
}
