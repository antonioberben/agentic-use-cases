#!/usr/bin/env bash
# Levanta docusaurus en modo dev (hot reload) y un tunnel ngrok,
# respawneandolo si cae. URL ngrok cambia entre reinicios salvo que
# uses un dominio reservado (NGROK_DOMAIN=...).
#
# Uso:
#   ./dev-tunnel.sh
#   NGROK_DOMAIN=mi-sub.ngrok-free.app ./dev-tunnel.sh   # dominio reservado
#
# Detener: Ctrl-C (mata ambos procesos) o `pkill -f dev-tunnel.sh`.

set -u

PORT="${PORT:-3000}"
NGROK_DOMAIN="${NGROK_DOMAIN:-}"

cd "$(dirname "$0")"

cleanup() {
  echo
  echo "[dev-tunnel] cerrando..."
  [[ -n "${DOCS_PID:-}" ]] && kill "$DOCS_PID" 2>/dev/null || true
  [[ -n "${TUNNEL_PID:-}" ]] && kill "$TUNNEL_PID" 2>/dev/null || true
  pkill -P $$ 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

MODE="${MODE:-start}"
if [[ "$MODE" == "serve" ]]; then
  echo "[dev-tunnel] sirviendo build/ en :$PORT (multi-idioma es+en; sin hot reload)..."
  npx --yes docusaurus serve --port "$PORT" --host 0.0.0.0 --no-open &
else
  echo "[dev-tunnel] arrancando docusaurus en :$PORT (hot reload, solo idioma por defecto)..."
  npx --yes docusaurus start --port "$PORT" --host 0.0.0.0 --no-open &
fi
DOCS_PID=$!

for i in {1..40}; do
  if curl -sf "http://localhost:$PORT" >/dev/null 2>&1; then break; fi
  sleep 1
done

NGROK_ARGS=(http "$PORT" --log=stdout --log-format=logfmt)
if [[ -n "$NGROK_DOMAIN" ]]; then
  NGROK_ARGS+=(--domain "$NGROK_DOMAIN")
fi

LOG="/tmp/ngrok-dev-tunnel.log"
: > "$LOG"

echo "[dev-tunnel] arrancando ngrok..."
(
  while true; do
    ngrok "${NGROK_ARGS[@]}" >> "$LOG" 2>&1
    echo "[dev-tunnel] ngrok caido, reintento en 3s..." | tee -a "$LOG"
    sleep 3
  done
) &
TUNNEL_PID=$!

# Espera a que ngrok publique la URL
URL=""
for i in {1..30}; do
  URL=$(curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null \
        | grep -oE 'https://[a-zA-Z0-9.-]+\.ngrok[a-zA-Z0-9.-]+' | head -1)
  [[ -n "$URL" ]] && break
  sleep 1
done

if [[ -n "$URL" ]]; then
  echo "[dev-tunnel] URL: $URL"
else
  echo "[dev-tunnel] no he podido leer la URL de ngrok; mira $LOG"
fi
echo "[dev-tunnel] panel local: http://127.0.0.1:4040"
echo "[dev-tunnel] Ctrl-C para detener."

wait "$DOCS_PID"
cleanup
