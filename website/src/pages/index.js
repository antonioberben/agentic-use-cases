import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const NIVELES = [
  {n: '0', titulo: 'Ad hoc', estado: 'Uso individual disperso, shadow AI', mitad: 'Adopción'},
  {n: '1', titulo: 'Piloto', estado: 'POCs sueltos, medir ROI', mitad: 'Adopción'},
  {n: '2', titulo: 'Escalado', estado: 'Varios equipos, empieza el caos', mitad: 'Bisagra'},
  {n: '3', titulo: 'Gobernado', estado: 'Uso transversal, Plan Director', mitad: 'Gobierno'},
  {n: '4', titulo: 'Optimizado', estado: 'IA como infraestructura crítica', mitad: 'Gobierno'},
];

const SECCIONES = [
  {
    to: '/capacitacion',
    titulo: 'Capacitación',
    desc: 'Cómo usar la IA agéntica antes de gobernarla: manual por rol, estándares operativos, catálogo de casos y labs.',
  },
  {
    to: '/plan-director/parte-1-contexto-y-necesidad',
    titulo: 'Plan Director',
    desc: 'El marco de gobierno: identidad de agentes, seguridad, control de MCP, observabilidad, coste y cumplimiento.',
  },
];

export default function Home() {
  return (
    <Layout
      title="Plan Director de IA Agéntica"
      description="Marco de Adopción y Gobierno de IA agéntica y generativa.">
      <header className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Plan Director de IA Agéntica</h1>
          <p className={styles.heroSubtitle}>
            Marco de Adopción y Gobierno de IA. Te llevamos del nivel 0 al 4: la
            adopción te da el valor, el plan director evita que ese valor se
            convierta en riesgo y coste.
          </p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/capacitacion">
              Empezar por capacitación
            </Link>
            <Link className="button button--secondary button--lg" to="/plan-director/parte-1-contexto-y-necesidad">
              Ir al Plan Director
            </Link>
          </div>
        </div>
      </header>

      <main className="container margin-vert--xl">
        <h2>Modelo de madurez</h2>
        <div className={styles.niveles}>
          {NIVELES.map((nv) => (
            <div key={nv.n} className={styles.nivel}>
              <div className={styles.nivelNum}>{nv.n}</div>
              <div>
                <strong>{nv.titulo}</strong>
                <div className={styles.nivelEstado}>{nv.estado}</div>
                <span className={styles.mitad}>{nv.mitad}</span>
              </div>
            </div>
          ))}
        </div>

        <h2 className="margin-top--xl">Secciones</h2>
        <div className={styles.secciones}>
          {SECCIONES.map((s) => (
            <Link key={s.to} to={s.to} className={styles.seccion}>
              <h3>{s.titulo}</h3>
              <p>{s.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
