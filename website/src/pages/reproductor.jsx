import React from 'react';
import Layout from '@theme/Layout';
import ScenarioPlayer from '@site/src/components/ScenarioPlayer';

export default function ReproductorPage() {
  return (
    <Layout title="Reproductor de casos" description="Reproductor de escenarios de capacitación (5 casos piloto)">
      <main style={{maxWidth: 960, margin: '0 auto', padding: '32px 24px 96px'}}>
        <p style={{fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: '#CC85FF', margin: '0 0 8px'}}>
          Capacitación · Pieza 0
        </p>
        <h1 style={{marginTop: 0}}>Reproductor de casos de uso</h1>
        <p style={{maxWidth: '62ch', opacity: .85, marginBottom: 28}}>
          Diseño Hero + apilado. El reproductor resume cada etapa; pulsa <b>“ir al detalle”</b> para saltar al bloque de texto.
          Cambia de caso y de idioma arriba. Iconos oficiales de kagent, agentgateway y MCP en los nodos.
        </p>
        <ScenarioPlayer />
      </main>
    </Layout>
  );
}
