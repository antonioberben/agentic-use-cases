#!/usr/bin/env node
/**
 * Pre-genera src/data/fundamentos-detalle.json con {slug: {titulo, html}}
 * a partir de los .md de ../catalogo-agentico/02-fundamentos/.
 * Corre en pre-build. Reemplaza el uso de plugin-content-docs para fundamentos.
 */
const fs = require('fs');
const path = require('path');
const {marked} = require('marked');

const SRC = path.resolve(__dirname, '..', '..', 'catalogo-agentico', '02-fundamentos');
const DST = path.resolve(__dirname, '..', 'src', 'data', 'fundamentos-detalle.json');

const FILES = [
  {slug: 'que-es-un-llm', file: '01-que-es-un-llm.md'},
  {slug: 'tokens-y-contexto', file: '02-tokens-y-contexto.md'},
  {slug: 'del-chat-al-agente', file: '03-del-chat-al-agente.md'},
  {slug: 'agents-md', file: '04-agents-md.md'},
  {slug: 'mcp', file: '05-mcp.md'},
  {slug: 'agentgateway', file: '06-agentgateway.md'},
  {slug: 'kagent', file: '07-kagent.md'},
  {slug: 'agentregistry', file: '08-agentregistry.md'},
  {slug: 'riesgos-y-coste', file: '09-riesgos-y-coste.md'},
];

marked.setOptions({gfm: true, breaks: false, headerIds: false, mangle: false});

function stripFrontmatter(md) {
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3);
    if (end >= 0) return md.slice(end + 4).replace(/^\s*\n/, '');
  }
  return md;
}

// Fuente .md autoritativa tras el reenfoque; sin reescritura en build.
function sanitize(s) {
  return s;
}

function extractTitle(md) {
  const m = md.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : '';
}

function stripFirstH1(md) {
  return md.replace(/^#\s+.+?\n+/, '');
}

const out = {};
for (const {slug, file} of FILES) {
  const p = path.join(SRC, file);
  if (!fs.existsSync(p)) {
    console.warn(`[build-fundamentos] missing ${file}`);
    continue;
  }
  const raw = sanitize(stripFrontmatter(fs.readFileSync(p, 'utf8')));
  const titulo = extractTitle(raw);
  const body = stripFirstH1(raw);
  out[slug] = {titulo, html: marked.parse(body)};
}
fs.writeFileSync(DST, JSON.stringify(out, null, 0));
console.log(`[build-fundamentos] ${Object.keys(out).length} fundamentos → ${path.relative(process.cwd(), DST)}`);
