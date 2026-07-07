import React, {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import detalle from '@site/src/data/fundamentos-detalle.json';

const T = {
  es: {fallback: 'Fundamento', desc: 'Detalle de fundamento', back: '← Volver a fundamentos', notFound: 'Fundamento no encontrado.', backCat: 'Volver al catálogo',
       note: 'Contenido del capítulo disponible en español.'},
  en: {fallback: 'Fundamental', desc: 'Fundamental detail', back: '← Back to fundamentals', notFound: 'Fundamental not found.', backCat: 'Back to the catalog',
       note: 'Chapter content available in Spanish.'},
};

export default function FundamentoDetalle() {
  const {i18n} = useDocusaurusContext();
  const lang = i18n.currentLocale === 'en' ? 'en' : 'es';
  const t = T[lang];
  const loc = useLocation();
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    const p = new URLSearchParams(loc.search);
    setSlug(p.get('slug'));
  }, [loc.search]);

  const f = slug ? detalle[slug] : null;

  return (
    <Layout
      title={f ? f.titulo : t.fallback}
      description={f ? f.titulo : t.desc}>
      <div style={{maxWidth: 860, margin: '0 auto', padding: '32px 20px 80px'}}>
        <div style={{fontSize: 12, opacity: 0.7, marginBottom: 8}}>
          <Link to="/fundamentos">{t.back}</Link>
        </div>
        {!f ? (
          <div style={{padding: 40, textAlign: 'center', opacity: 0.7}}>
            <p>{t.notFound}</p>
            <p><Link to="/fundamentos">{t.backCat}</Link></p>
          </div>
        ) : (
          <>
            {lang === 'en' && (
              <p style={{fontSize: 12, opacity: 0.6, fontStyle: 'italic', margin: '0 0 12px'}}>{t.note}</p>
            )}
            <article
              className="fundamento-body"
              dangerouslySetInnerHTML={{__html: f.html}}
            />
          </>
        )}
      </div>
      <style>{`
        .fundamento-body h1 { font-size: 28px; margin: 8px 0 20px; }
        .fundamento-body h2 { font-size: 22px; margin: 32px 0 12px; padding-top: 8px; border-top: 1px solid var(--ifm-color-emphasis-200); }
        .fundamento-body h3 { font-size: 17px; margin: 24px 0 10px; }
        .fundamento-body p, .fundamento-body li { line-height: 1.6; }
        .fundamento-body code { font-size: 0.92em; }
        .fundamento-body pre { padding: 12px; border-radius: 6px; overflow-x: auto; }
        .fundamento-body table { border-collapse: collapse; margin: 16px 0; }
        .fundamento-body th, .fundamento-body td { border: 1px solid var(--ifm-color-emphasis-300); padding: 6px 10px; text-align: left; }
        .fundamento-body blockquote { border-left: 3px solid var(--ifm-color-primary); padding: 4px 12px; margin: 12px 0; opacity: 0.85; }
        .fundamento-body img { max-width: 100%; height: auto; }
      `}</style>
    </Layout>
  );
}
