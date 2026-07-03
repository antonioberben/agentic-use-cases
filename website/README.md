# Website del Plan Director de IA Agéntica

Sitio único (Docusaurus) que publica todo el kit modular del Plan Director. Decisión D15 en [`../AGENTS.md`](../AGENTS.md).

## Cómo funciona

El contenido **no vive aquí**: vive en las carpetas `../pieza-*` y se sirve sin moverlo ni duplicarlo, mediante instancias de `plugin-content-docs`:

| Ruta | Origen | Instancia |
|------|--------|-----------|
| `/capacitacion` | `../pieza-0-alfabetizacion` | plugin `alfabetizacion` |
| `/plan-director` | `../pieza-2-plan-director` | preset docs `plan` |
| `/` | `src/pages/index.js` | landing |

Documentos internos de tracking (`AGENTS.md`, `inventario-features-referencia.md`) quedan excluidos del sitio público.

Piezas pendientes de añadir como nuevas instancias cuando se redacten: Pieza 1 (resumen ejecutivo), Pieza 3 (scorecard, como página React interactiva), Pieza 4 (anexos).

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

Despliegue automático a GitHub Pages vía `../.github/workflows/deploy.yml` al hacer push a `main`. **Antes de desplegar**, ajusta en `docusaurus.config.js`: `url`, `baseUrl`, `organizationName`, `projectName`, y habilita Pages (Settings → Pages → Source: GitHub Actions) en el repo.

## Pendiente

- Reproductor de escenarios React para los labs (D14, patrón U1/U2 del inventario).
- Refinamiento de marca vía skill `solo-design` (paleta actual es provisional, no copiada del SPA de referencia).
- PDF de marca de las piezas ejecutivas (Piezas 1 y 2) vía skill `solo-whitepaper`.
