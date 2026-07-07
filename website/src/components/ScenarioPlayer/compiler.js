// Compilador de casos: transforma una "ficha" declarativa (spec) en
// {layout, steps, viewBox, n} listos para el ScenarioPlayer.
//
// Modelo:
//   spec.actors: [{ id, kind, role?, label, sub, ap, gate? }]
//     kind ∈ user | agent | llm | mcp | remote | external | gw | shadow | registry | trace
//     role (solo si kind==='agent') ∈ primary | sub | validator
//   spec.stages: [{ kind, on, danger, edges, badge, hitl, gw }] x 5
//     `on`, `danger` y los ids de `edges` aceptan comodines:
//       agent:* · sub:* · mcp:* · remote:* · external:* · llm:* · shadow:* · user:*
//
// Zonas (una sola plantilla paramétrica; las columnas crecen verticalmente):
//   col 0: user
//   col 1: agent (primary)
//   col 2: agent (sub/validator)
//   col 3: gw
//   col 4: backend stack — llm, mcp, remote, external (subgrupos apilados)
//   banda inferior: registry (col 0), shadow (col 2), trace (col 3)
//
// El viewBox se calcula a partir de las columnas reales y de la columna más alta.

export const NW = 150;
export const NH = 54;

const MARGIN_X = 30;
const MARGIN_TOP = 20;
const COL_GAP = 30;
const ROW_GAP = 14;
const SUBGROUP_GAP = 12; // hueco extra entre subgrupos del backend
const BAND_GAP = 40;     // separación entre banda principal e inferior

const COL = { user: 0, agent: 1, sub: 2, gw: 3, backend: 4 };
const BOTTOM_COL = { registry: 0, shadow: 2, trace: 3 };

function colX(idx) { return MARGIN_X + idx * (NW + COL_GAP); }

function isAgentSub(a) { return a.kind === 'agent' && (a.role === 'sub' || a.role === 'validator'); }

function classify(actors) {
  const g = { user: [], agentMain: [], agentSub: [], gw: [], llm: [], mcp: [], remote: [], external: [], registry: [], shadow: [], trace: [] };
  actors.forEach((a) => {
    if (a.kind === 'agent') (isAgentSub(a) ? g.agentSub : g.agentMain).push(a);
    else if (g[a.kind]) g[a.kind].push(a);
  });
  return g;
}

// Coloca un array vertical centrado alrededor de centerY.
function stack(arr, x, centerY, extraGaps = null) {
  const rowH = NH + ROW_GAP;
  const gaps = extraGaps || arr.map(() => 0);
  const totalH = arr.length * rowH - ROW_GAP + (gaps.length ? gaps[gaps.length - 1] : 0);
  const startY = centerY - totalH / 2;
  return arr.map((a, i) => ({ actor: a, x, y: startY + i * rowH + gaps[i] }));
}

function buildBackendGaps(arr) {
  // Añade SUBGROUP_GAP cumulativo cada vez que cambia el subgrupo (llm|mcp|remote|external).
  const gaps = [];
  let cum = 0, last = null;
  arr.forEach((a) => {
    if (last && a.kind !== last) cum += SUBGROUP_GAP;
    gaps.push(cum);
    last = a.kind;
  });
  return gaps;
}

export function compileCase(spec) {
  const actors = spec.actors || [];
  const g = classify(actors);

  // Backend en orden: llm → mcp → remote → external
  const backend = [...g.llm, ...g.mcp, ...g.remote, ...g.external];

  const cols = {
    user: g.user,
    agent: g.agentMain,
    sub: g.agentSub,
    gw: g.gw,
    backend,
  };

  const rowH = NH + ROW_GAP;
  const backendGaps = buildBackendGaps(backend);
  const backendExtra = backendGaps.length ? backendGaps[backendGaps.length - 1] : 0;

  // Alto de la banda principal = max(altura de cada columna)
  const heights = {
    user: g.user.length * rowH - ROW_GAP,
    agent: g.agentMain.length * rowH - ROW_GAP,
    sub: g.agentSub.length * rowH - ROW_GAP,
    gw: g.gw.length * rowH - ROW_GAP,
    backend: backend.length * rowH - ROW_GAP + backendExtra,
  };
  const mainHeight = Math.max(NH, ...Object.values(heights));
  const centerY = MARGIN_TOP + mainHeight / 2;

  // Coloca cada columna
  const placed = [
    ...stack(cols.user, colX(COL.user), centerY),
    ...stack(cols.agent, colX(COL.agent), centerY),
    ...stack(cols.sub, colX(COL.sub), centerY),
    ...stack(cols.gw, colX(COL.gw), centerY),
    ...stack(cols.backend, colX(COL.backend), centerY, backendGaps),
  ];

  // Banda inferior
  const bottomY = MARGIN_TOP + mainHeight + BAND_GAP;
  ['registry', 'shadow', 'trace'].forEach((k) => {
    const arr = g[k];
    if (!arr.length) return;
    const baseX = colX(BOTTOM_COL[k]);
    arr.forEach((a, i) => placed.push({ actor: a, x: baseX + i * (NW + 12), y: bottomY }));
  });

  // Kind de render (shadow se pinta como mcp; remote se pinta como external)
  const renderKind = (a) => (a.kind === 'shadow' ? 'mcp' : a.kind === 'remote' ? 'external' : a.kind);

  const layout = placed.map(({ actor, x, y }) => ({
    id: actor.id,
    kind: renderKind(actor),
    x, y,
    ap: actor.ap != null ? actor.ap : 0,
  }));

  const n = {};
  placed.forEach(({ actor }) => {
    if (actor.label != null || actor.sub != null) n[actor.id] = { l: actor.label, s: actor.sub };
  });

  // viewBox: columnas realmente usadas
  const usedCols = [
    cols.user.length && COL.user,
    cols.agent.length && COL.agent,
    cols.sub.length && COL.sub,
    cols.gw.length && COL.gw,
    cols.backend.length && COL.backend,
  ].filter((v) => v !== false && v != null);
  const maxCol = usedCols.length ? Math.max(...usedCols) : 4;
  const hasBottom = g.registry.length + g.shadow.length + g.trace.length > 0;
  const vbW = MARGIN_X + (maxCol + 1) * NW + maxCol * COL_GAP + MARGIN_X;
  const vbH = hasBottom ? bottomY + NH + MARGIN_TOP : MARGIN_TOP + mainHeight + MARGIN_TOP;

  // Comodines para expandir on / danger / edges
  const wild = {
    'agent:*': [...g.agentMain, ...g.agentSub].map((a) => a.id),
    'sub:*': g.agentSub.map((a) => a.id),
    'mcp:*': g.mcp.map((a) => a.id),
    'remote:*': g.remote.map((a) => a.id),
    'external:*': g.external.map((a) => a.id),
    'llm:*': g.llm.map((a) => a.id),
    'shadow:*': g.shadow.map((a) => a.id),
    'user:*': g.user.map((a) => a.id),
  };
  const expandOne = (id) => (wild[id] ? wild[id] : [id]);
  const expandList = (list) => (list || []).flatMap(expandOne);
  const expandEdges = (edges) => (edges || []).flatMap(([from, to, state]) => {
    const out = [];
    expandOne(from).forEach((f) => expandOne(to).forEach((t) => { if (f !== t) out.push([f, t, state]); }));
    return out;
  });

  const steps = (spec.stages || []).map((st, i) => ({
    stage: i,
    kind: st.kind,
    on: expandList(st.on),
    danger: expandList(st.danger),
    edges: expandEdges(st.edges),
    badge: st.badge,
    hitl: st.hitl,
    gw: st.gw,
  }));

  return { layout, steps, n, viewBox: { w: vbW, h: vbH } };
}

// Helper: fusiona un caso base con la compilación de su spec.
// El caso base puede seguir declarando: role, title, caps, blocks, hitl, hitlEdge, comps, etc.
export function withSpec(base) {
  if (!base.spec) return base;
  const c = compileCase(base.spec);
  return {
    ...base,
    layout: c.layout,
    steps: c.steps,
    viewBox: c.viewBox,
    n: { ...(c.n || {}), ...(base.n || {}) }, // labels explícitos ganan
  };
}
