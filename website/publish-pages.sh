#!/usr/bin/env bash
# Publica ESTA web bajo la subcarpeta v1/ de la rama gh-pages, SIN tocar el
# resto de carpetas ya publicadas (p. ej. una futura v2/). Solo sube el sitio
# estático, no el código fuente.
#
# Convivencia de versiones (sencillo, sin lógica):
#   - Esta web vive en /agentic-use-cases/v1/  (baseUrl fijo en docusaurus.config.js).
#   - Cuando exista una v2, será OTRO build con baseUrl /agentic-use-cases/v2/ y su
#     propio script; se publicará en la carpeta v2/ y esta v1/ NO se toca.
#
# Requisitos: git autenticado para push a github.com/<REPO> (gh auth setup-git o PAT).
# Uso:
#   ./publish-pages.sh                      # repo por defecto: antonioberben/agentic-use-cases
#   ./publish-pages.sh usuario/otro-repo
#
# Tras el primer push: en el repo → Settings → Pages → Source: rama gh-pages, carpeta / (root).
# URL: https://<usuario>.github.io/<repo>/v1/
set -euo pipefail

REPO="${1:-antonioberben/agentic-use-cases}"
VERSION="v1"
cd "$(dirname "$0")"

echo "[publish] build del sitio (baseUrl /agentic-use-cases/${VERSION}/) → build-pages/"
DOCS_BASEURL="/agentic-use-cases/${VERSION}/" npx --yes docusaurus build --out-dir build-pages

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "[publish] recuperando gh-pages existente de $REPO (si existe) para preservar otras versiones"
if git clone --quiet --branch gh-pages --depth 1 "https://github.com/${REPO}.git" "$WORK/site" 2>/dev/null; then
  rm -rf "$WORK/site/.git"
else
  echo "[publish] no hay gh-pages todavía; se crea desde cero"
  mkdir -p "$WORK/site"
fi

echo "[publish] reemplazando SOLO la carpeta ${VERSION}/ (el resto se conserva)"
rm -rf "$WORK/site/${VERSION}"
mkdir -p "$WORK/site/${VERSION}"
cp -R build-pages/. "$WORK/site/${VERSION}/"
touch "$WORK/site/.nojekyll"

echo "[publish] push a $REPO (rama gh-pages)"
cd "$WORK/site"
git init -q -b gh-pages
git add -A
git -c user.email="antonio.berben@solo.io" -c user.name="Antonio Berben" commit -qm "Publish ${VERSION}"
git push -f "https://github.com/${REPO}.git" gh-pages

echo "[publish] hecho. Activa Pages: Settings → Pages → Source: gh-pages / (root)."
echo "[publish] URL: https://$(echo "$REPO" | cut -d/ -f1).github.io/$(echo "$REPO" | cut -d/ -f2)/${VERSION}/"
