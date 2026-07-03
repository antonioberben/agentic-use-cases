#!/usr/bin/env bash
# Publica SOLO el website compilado en la rama gh-pages del repo indicado.
# No sube el código fuente; solo el sitio estático (build-pages/).
#
# Requisitos: git autenticado para push a github.com/<REPO> (gh auth setup-git o un PAT).
# Uso:
#   ./publish-pages.sh                      # repo por defecto: antonioberben/casos-de-uso
#   ./publish-pages.sh usuario/otro-repo
#
# Tras el primer push: en el repo → Settings → Pages → Source: rama gh-pages, carpeta / (root).
set -euo pipefail

REPO="${1:-antonioberben/agentic-use-cases}"
cd "$(dirname "$0")"

echo "[publish] build del sitio (baseUrl /agentic-use-cases/) → build-pages/"
DOCS_BASEURL="/agentic-use-cases/" npx --yes docusaurus build --out-dir build-pages
touch build-pages/.nojekyll

echo "[publish] push del sitio a $REPO (rama gh-pages, historial limpio)"
cd build-pages
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.email="antonio.berben@solo.io" -c user.name="Antonio Berben" commit -qm "Publish website"
git push -f "https://github.com/${REPO}.git" gh-pages

echo "[publish] hecho. Activa Pages: Settings → Pages → Source: gh-pages / (root)."
echo "[publish] URL: https://$(echo "$REPO" | cut -d/ -f1).github.io/$(echo "$REPO" | cut -d/ -f2)/"
