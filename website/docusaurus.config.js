// @ts-check
const {themes} = require('prism-react-renderer');

/**
 * Configuración del website del Plan Director de IA Agéntica.
 * El contenido vive en las carpetas ../pieza-* y se sirve sin moverlo
 * mediante instancias de plugin-content-docs (ver D15 en AGENTS.md).
 *
 * Ajusta `url`, `baseUrl`, `organizationName` y `projectName` al repo real
 * antes de desplegar en GitHub Pages.
 */

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Plan Director de IA Agéntica',
  tagline: 'Marco de Adopción y Gobierno de IA',
  favicon: 'img/favicon.svg',

  url: 'https://antonioberben.github.io',
  // Sitio de proyecto en GitHub Pages: se sirve bajo /casos-de-uso/.
  // Para servir en local/túnel en la raíz: DOCS_BASEURL=/ npm run build|start
  baseUrl: process.env.DOCS_BASEURL || '/casos-de-uso/',
  organizationName: 'antonioberben',
  projectName: 'casos-de-uso',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  themes: ['@docusaurus/theme-mermaid'],

  // .md se parsea como CommonMark (prosa robusta, admite autolinks <url>);
  // .mdx se reserva para páginas con componentes React (reproductor de escenarios).
  markdown: {
    format: 'detect',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    localeConfigs: {
      es: {label: 'Español', htmlLang: 'es'},
      en: {label: 'English', htmlLang: 'en'},
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          id: 'plan',
          path: '../pieza-2-plan-director',
          routeBasePath: 'plan-director',
          sidebarPath: require.resolve('./sidebars-plan.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'alfabetizacion',
        path: '../pieza-0-alfabetizacion',
        routeBasePath: 'capacitacion',
        sidebarPath: require.resolve('./sidebars-alfabetizacion.js'),
        // Documentos internos fuera del sitio público (D15).
        exclude: [
          '**/inventario-features-referencia.md',
          '**/labs/**',
          '**/guia-estandares/**',
          '**/02-fundamentos/00-capitulo-puente-original.md',
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: '',
        logo: {
          alt: 'solo.io',
          src: 'img/solo-wordmark-dark.svg',
          srcDark: 'img/solo-wordmark-white.svg',
          height: 26,
        },
        items: [
          {to: '/capacitacion', label: 'Capacitación', position: 'left'},
          {to: '/reproductor', label: 'Reproductor', position: 'left'},
          {to: '/plan-director/parte-1-contexto-y-necesidad', label: 'Plan Director', position: 'left'},
          {type: 'localeDropdown', position: 'right'},
        ],
      },
      footer: {
        style: 'dark',
        copyright:
          'Plan Director de IA Agéntica · Activo de campo Solo.io · Borrador v1 (español).',
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};

module.exports = config;
