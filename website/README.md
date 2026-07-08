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

## Versionado por path (v1, v2, …) y dominio propio

La web se sirve en el **custom domain `usecases.emea.solo.io`** (raíz del dominio), bajo el path **`/v1/`** — `baseUrl` fijo en `docusaurus.config.js`, sin lógica de versión. `npm run build` ya produce un sitio que apunta a `/v1/`.

Cuando haya una web distinta, será una **v2 independiente** (otro build con `baseUrl` `/v2/`) que se publica **junto** a v1; la v1 ya publicada **no se toca**. Cada versión es una carpeta estática autónoma bajo la rama `gh-pages` (`v1/`, `v2/`, …), servidas por separado.

### DNS (Route53, zona emea.solo.io)

```
usecases.emea.solo.io.  CNAME  antonioberben.github.io.
```

(Subdominio → CNAME al apex de Pages `antonioberben.github.io`, no a la URL del proyecto.)

### Desplegar (preserva otras versiones)

```bash
./publish-pages.sh          # build baseUrl /v1/ + push a gh-pages/v1/ (mantiene CNAME)
```

El script recupera la `gh-pages` existente, reemplaza **solo** la carpeta `v1/`, conserva el resto (p. ej. `v2/`) y reescribe el fichero `CNAME` (`usecases.emea.solo.io`) en la raíz. Activar Pages una vez: Settings → Pages → Source: rama `gh-pages`, carpeta `/` (root); Custom domain: `usecases.emea.solo.io`; Enforce HTTPS. URL: `https://usecases.emea.solo.io/v1/`.

> El workflow `../.github/workflows/deploy.yml` (Actions → `upload-pages-artifact`) **sustituye toda la publicación** en cada push, por lo que NO preserva otras versiones. Para convivencia v1+v2 usa `publish-pages.sh`. Para servir en local/túnel en la raíz: `DOCS_BASEURL=/ npm run build`.

## Pendiente

- Reproductor de escenarios React para los labs (D14, patrón U1/U2 del inventario).
- Refinamiento de marca vía skill `solo-design` (paleta actual es provisional, no copiada del SPA de referencia).
- PDF de marca de las piezas ejecutivas (Piezas 1 y 2) vía skill `solo-whitepaper`.
