# Website de IA Agéntica (Fundamentos y Casos de uso)

Sitio único (Docusaurus) que publica los fundamentos y el catálogo de casos de uso. Decisión D15 en [`../AGENTS.md`](../AGENTS.md).

## Cómo funciona

El contenido **no vive aquí**: vive en `../catalogo-agentico` y se sirve sin moverlo ni duplicarlo, mediante `plugin-content-docs`:

| Ruta | Origen | Instancia |
|------|--------|-----------|
| `/capacitacion` | `../catalogo-agentico` | plugin `alfabetizacion` |
| `/fundamentos` | `src/pages/fundamentos.jsx` | catálogo |
| `/casos-de-uso` | `src/pages/casos-de-uso.jsx` | catálogo |
| `/casos-de-uso/detalle` | `src/pages/casos-de-uso/detalle.jsx` | reproductor |
| `/` | `src/pages/index.js` | landing |

Documentos internos de tracking (`AGENTS.md`, `inventario-features-referencia.md`) quedan excluidos del sitio público.

## Desarrollo local

```bash
cd website
npm install
npm start          # http://localhost:3000
```

## Build y despliegue

```bash
npm run build      # genera ./build
npm run serve      # sirve el build localmente
```

## Versionado por path (v1, v2, …)

Esta web se sirve bajo **`/agentic-use-cases/v1/`** — `baseUrl` fijo en `docusaurus.config.js`, sin lógica de versión. `npm run build` ya produce un sitio que apunta a `/v1/`.

Cuando haya una web distinta, será una **v2 independiente** (otro build con `baseUrl` `/agentic-use-cases/v2/`) que se publica **junto** a v1; la v1 ya publicada **no se toca**. Cada versión es una carpeta estática autónoma bajo la rama `gh-pages` (`v1/`, `v2/`, …), servidas por separado.

### Desplegar (preserva otras versiones)

```bash
./publish-pages.sh          # build baseUrl /agentic-use-cases/v1/ + push a gh-pages/v1/
```

El script recupera la `gh-pages` existente, reemplaza **solo** la carpeta `v1/` y conserva el resto (p. ej. `v2/`). Activa Pages una vez: Settings → Pages → Source: rama `gh-pages`, carpeta `/` (root). URL: `https://antonioberben.github.io/agentic-use-cases/v1/`.

> El workflow `../.github/workflows/deploy.yml` (Actions → `upload-pages-artifact`) **sustituye toda la publicación** en cada push, por lo que NO preserva otras versiones. Para convivencia v1+v2 usa `publish-pages.sh`. Para servir en local/túnel en la raíz: `DOCS_BASEURL=/ npm run build`.

## Pendiente

- Reproductor de escenarios React para los labs (D14, patrón U1/U2 del inventario).
- Refinamiento de marca vía skill `solo-design` (paleta actual es provisional, no copiada del SPA de referencia).
- PDF de marca de las piezas ejecutivas (Piezas 1 y 2) vía skill `solo-whitepaper`.
