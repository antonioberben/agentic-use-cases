#!/usr/bin/env node
/**
 * Extrae los 5 bloques de cada README de caso de uso y emite
 * src/data/casos-detalle.json con { [id]: { titulo, rol, rolLabel, tecnica,
 * madurez, blocks:[html×5], caps:[texto×5], risk } }.
 *
 * Corre en pre-build (ver package.json). Sin coste en runtime cliente.
 */

const fs = require('fs');
const path = require('path');
const {marked} = require('marked');

const root = path.resolve(__dirname, '..');
const casos = JSON.parse(fs.readFileSync(path.join(root, 'src/data/casos.json'), 'utf8'));

marked.setOptions({gfm: true, breaks: false, headerIds: false, mangle: false});

const HEADING_RE = /^##\s+\d+\.\s+.*$/m;

function splitBlocks(md) {
  // Devuelve los 5 bloques por posición 1..5. Falla → bloque vacío.
  const parts = md.split(/^##\s+(\d)\.\s+.*$/m); // groups por número de bloque
  // parts es [prefacio, '1', body1, '2', body2, ...]
  const out = {1: '', 2: '', 3: '', 4: '', 5: ''};
  for (let i = 1; i < parts.length; i += 2) {
    const num = parseInt(parts[i], 10);
    const body = (parts[i + 1] || '').trim();
    if (num >= 1 && num <= 5) out[num] = body;
  }
  return [out[1], out[2], out[3], out[4], out[5]];
}

function stripFrontmatter(md) {
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3);
    if (end >= 0) return md.slice(end + 4).replace(/^\s*\n/, '');
  }
  return md;
}

function summary(md, max = 180) {
  // Extrae primera línea de párrafo real, sin blockquote ni tabla.
  const lines = md.split('\n').map(s => s.trim()).filter(Boolean);
  const first = lines.find(l => !l.startsWith('>') && !l.startsWith('|') && !l.startsWith('#') && !l.startsWith('*') && !l.startsWith('-'));
  const s = first || lines[0] || '';
  const plain = s.replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');
  return plain.length > max ? plain.slice(0, max - 1).trimEnd() + '…' : plain;
}

function riskSummary(md) {
  // Primer <li> del bloque 4, o resumen corto.
  const li = md.match(/^[-*]\s+(.+)$/m);
  if (li) return summary(li[1], 140);
  return summary(md, 140);
}

const EMPTY = '<p><em>Sección no disponible.</em></p>';

// Los READMEs fuente son ahora la única verdad (reenfoque 2026-07-06: sin
// taxonomía de kit ni "Plan Director"). Sin reescritura en build; se publica
// el contenido tal cual. Se conserva el punto de extensión por si hiciera falta.
function sanitize(s) {
  return s;
}

// Nombres de clientes conocidos (case-insensitive, startsWith).
// Todo lo demás con formato **X.** en el bloque 2 se considera apéndice común.
const CLIENT_KEYWORDS = [
  'local', 'copilot', 'claude', 'chatgpt', 'gemini', 'cursor', 'cody',
  'ollama', 'amazon q', 'aws q', 'open code', 'opencode', 'windsurf',
  'codeium', 'continue', 'aider', 'llamacpp', 'mistral', 'lmstudio',
];

function isClientName(name) {
  const n = name.toLowerCase().trim();
  return CLIENT_KEYWORDS.some(k => n === k || n.startsWith(k + ' ') || n.startsWith(k + ' (') || n.startsWith(k + ','));
}

// Parte el bloque "Cómo resolverlo" por sub-secciones **Nombre.** al inicio de línea.
// Devuelve {tabs:[{name, html}], appendix:html} o null si <2 clientes.
function extractClientTabs(md) {
  if (!md) return null;
  const lines = md.split('\n');
  const sections = [];
  let cur = null;
  const flush = () => { if (cur) sections.push({name: cur.name, md: cur.md.join('\n').trim()}); };
  for (const line of lines) {
    // Cabecera markdown "#### Nombre".
    const mh = line.match(/^#{2,4}\s+(.+?)\s*$/);
    // Negrita con punto o dos puntos DENTRO: **Nombre.** o **Nombre:**.
    const mb = line.match(/^\*\*([^*]+?)[.:]\*\*\s*(.*)$/);
    // Ídem tras marcador de lista: "- **Nombre.**" / "* **Nombre:**".
    const ml = line.match(/^[-*]\s+\*\*([^*]+?)[.:]\*\*\s*(.*)$/);
    if (mh) {
      flush();
      cur = {name: mh[1].replace(/[*_`]/g, '').trim(), md: []};
    } else if (ml) {
      flush();
      cur = {name: ml[1].trim(), md: [ml[2] || '']};
    } else if (mb) {
      flush();
      cur = {name: mb[1].trim(), md: [mb[2] || '']};
    } else if (cur) {
      cur.md.push(line);
    } else {
      cur = {name: '__preamble__', md: [line]};
    }
  }
  flush();
  const clients = sections.filter(s => isClientName(s.name));
  const rest = sections.filter(s => !isClientName(s.name));
  if (clients.length < 2) return null;
  const appendixMd = rest.map(s => (s.name === '__preamble__' ? s.md : `#### ${s.name}\n\n${s.md}`)).join('\n\n').trim();
  return {
    tabs: clients.map(c => ({name: c.name, html: marked.parse(c.md)})),
    appendix: appendixMd ? marked.parse(appendixMd) : '',
  };
}

function build() {
  const out = {};
  let ok = 0, missing = 0;
  for (const cs of casos) {
    const p = path.join(root, '..', cs.path);
    if (!fs.existsSync(p)) { missing++; continue; }
    const raw = stripFrontmatter(fs.readFileSync(p, 'utf8'));
    const blocks = splitBlocks(raw).map(b => sanitize(b));
    const html = blocks.map(b => b ? marked.parse(b) : EMPTY);
    const caps = blocks.map(b => b ? summary(b) : '');
    const tabs2 = extractClientTabs(blocks[1]);
    if (tabs2) {
      tabs2.tabs = tabs2.tabs.map(t => ({...t, html: sanitize(t.html)}));
      tabs2.appendix = sanitize(tabs2.appendix);
    }
    out[cs.id] = {
      titulo: sanitize(cs.titulo),
      rol: cs.rol,
      rolLabel: cs.rolLabel,
      tecnica: cs.tecnica,
      madurez: cs.madurez,
      blocks: html,
      caps,
      risk: sanitize(blocks[3] ? riskSummary(blocks[3]) : 'Riesgo no documentado.'),
      tabs2,
    };
    ok++;
  }
  const dst = path.join(root, 'src/data/casos-detalle.json');
  fs.writeFileSync(dst, JSON.stringify(out, null, 0));
  console.log(`[build-cases] ${ok} casos → ${path.relative(root, dst)} (missing: ${missing})`);
}

build();
