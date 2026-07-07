// @ts-check
const {themes} = require('prism-react-renderer');

/**
 * Configuración del website de IA Agéntica (Fundamentos y Casos de uso).
 * El contenido vive en la carpeta ../catalogo-agentico y se sirve sin
 * moverlo mediante plugin-content-docs (ver D15 en AGENTS.md).
 *
 * Ajusta `url`, `baseUrl`, `organizationName` y `projectName` al repo real
 * antes de desplegar en GitHub Pages.
 */

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'IA Agéntica',
  tagline: 'Fundamentos y casos de uso',
  favicon: 'img/favicon.svg',

  url: 'https://antonioberben.github.io',
  // Esta web se sirve bajo /agentic-use-cases/v1/. Una futura web distinta se
  // publicará en /agentic-use-cases/v2/ (build aparte, con su baseUrl); esta v1
  // no se toca. Sin lógica de versión: es solo el path donde vive.
  // Para servir en local/túnel en la raíz: DOCS_BASEURL=/ npm run build|start
  baseUrl: process.env.DOCS_BASEURL || '/agentic-use-cases/v1/',
  organizationName: 'antonioberben',
  projectName: 'agentic-use-cases',
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
        docs: false,
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [],

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
          src: '/img/solo-wordmark-dark.svg',
          srcDark: '/img/solo-wordmark-white.svg',
          height: 26,
        },
        items: [
          {to: '/fundamentos', label: 'Fundamentos', position: 'left'},
          {to: '/casos-de-uso', label: 'Casos de uso', position: 'left'},
          {type: 'localeDropdown', position: 'right'},
        ],
      },
      footer: {
        style: 'dark',
        copyright:
          'IA Agéntica · Activo de campo Solo.io · Borrador v1 (español).',
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};

module.exports = config;
