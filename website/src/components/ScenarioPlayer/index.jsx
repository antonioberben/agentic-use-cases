import React, {useState, useEffect} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import {CASES, LAYOUT, STEP_META, UI, stageN, accents, kindLbl, NW, NH, PILOT_MAP, buildGenericCase} from './casos';
import {withSpec} from './compiler';
import detalle from '@site/src/data/casos-detalle.json';
import './styles.css';

// `pos` se recomputa por caso (cada caso puede tener su propio LAYOUT).
let pos = {};
function buildPos(layout) {
  pos = {};
  layout.forEach((n) => {pos[n.id] = {x: n.x, y: n.y, cx: n.x + NW / 2, cy: n.y + NH / 2};});
}
buildPos(LAYOUT);

const GLYPH = {
  user: '<circle cx="9" cy="6" r="3.1"/><path d="M2.5 16 C2.5 11,15.5 11,15.5 16"/>',
  agent: '<rect x="3" y="5.5" width="12" height="9.5" rx="2.4"/><circle cx="7" cy="10.2" r="1" fill="currentColor" stroke="none"/><circle cx="11" cy="10.2" r="1" fill="currentColor" stroke="none"/><path d="M9 2.4 V5.5"/>',
  llm: '<rect x="3" y="4" width="12" height="11" rx="2"/><path d="M6 8 H12 M6 11 H10"/>',
  mcp: '<path d="M6.5 3 V6.5 M11.5 3 V6.5"/><rect x="4" y="6.5" width="10" height="5" rx="1.4"/><path d="M9 11.5 V15"/>',
  gw: '<path d="M9 2.2 L15 5 V9.6 C15 13.6,9 15.8,9 15.8 C9 15.8,3 13.6,3 9.6 V5 Z"/><path d="M6.5 9 L8.3 10.8 L11.6 7.2"/>',
  external: '<circle cx="9" cy="9" r="6.4"/><path d="M2.6 9 H15.4"/><path d="M9 2.6 C5.5 5,5.5 13,9 15.4 C12.5 13,12.5 5,9 2.6"/>',
  trace: '<path d="M2 9 C5 4.2,13 4.2,16 9 C13 13.8,5 13.8,2 9 Z"/><circle cx="9" cy="9" r="2" fill="currentColor" stroke="none"/>',
};
const GCOLOR = {user: 'var(--sp-sub)', agent: 'var(--sp-purple-light)', llm: '#9db8ff', mcp: 'var(--sp-mcp)', external: 'var(--sp-red)', gw: 'var(--sp-purple-light)', trace: 'var(--sp-trace)'};

// Lado de la caja A por el que sale/entra la flecha hacia B (según la dirección dominante).
function sideOf(A, B) {
  const dx = B.cx - A.cx, dy = B.cy - A.cy;
  return Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'bottom' : 'top');
}
// Punto sobre un lado, a la fracción t (0..1) del ancho/alto de la caja.
function anchorOnSide(id, side, t) {
  const n = pos[id];
  if (side === 'right') return {x: n.x + NW, y: n.y + NH * t};
  if (side === 'left') return {x: n.x, y: n.y + NH * t};
  if (side === 'top') return {x: n.x + NW * t, y: n.y};
  return {x: n.x + NW * t, y: n.y + NH};
}
// Punto de control: sale perpendicular al lado.
function ctrl(x, y, side, k) {
  if (side === 'right') return {x: x + k, y};
  if (side === 'left') return {x: x - k, y};
  if (side === 'top') return {x, y: y - k};
  return {x, y: y + k};
}
// Reparte los puntos de conexión de cada caja a lo largo del lado (1 flecha → centro; varias → distribuidas).
function computeAnchors(edges) {
  const ports = {}; const meta = edges.map(() => ({}));
  const add = (nid, side, o) => { ports[nid] = ports[nid] || {}; ports[nid][side] = ports[nid][side] || []; ports[nid][side].push(o); };
  edges.forEach((e, i) => {
    const A = pos[e[0]], B = pos[e[1]];
    const sS = sideOf(A, B), eS = sideOf(B, A);
    meta[i].sSide = sS; meta[i].eSide = eS;
    add(e[0], sS, {i, end: 's', ocx: B.cx, ocy: B.cy});
    add(e[1], eS, {i, end: 'e', ocx: A.cx, ocy: A.cy});
  });
  Object.keys(ports).forEach((nid) => Object.keys(ports[nid]).forEach((side) => {
    const list = ports[nid][side];
    list.sort((p, q) => (side === 'left' || side === 'right') ? p.ocy - q.ocy : p.ocx - q.ocx);
    const n = list.length;
    list.forEach((p, idx) => {
      const pt = anchorOnSide(nid, side, (idx + 1) / (n + 1));
      if (p.end === 's') { meta[p.i].sx = pt.x; meta[p.i].sy = pt.y; }
      else { meta[p.i].ex = pt.x; meta[p.i].ey = pt.y; }
    });
  }));
  return meta;
}
function pathFrom(m) {
  const k = 46;
  const c1 = ctrl(m.sx, m.sy, m.sSide, k);
  const c2 = ctrl(m.ex, m.ey, m.eSide, k);
  return `M${m.sx} ${m.sy} C${c1.x} ${c1.y},${c2.x} ${c2.y},${m.ex} ${m.ey}`;
}

const EDGE_STATES = [
  ['base', 'var(--sp-border)'], ['active', 'var(--sp-info)'], ['pass', 'var(--sp-green)'],
  ['mcp', 'var(--sp-mcp)'], ['block', 'var(--sp-red)'], ['adv', 'var(--sp-orange)'], ['trace', 'var(--sp-trace)'],
  ['gate', 'var(--sp-amber)'],
];

function ClientTabs({data}) {
  const [i, setI] = useState(0);
  if (!data || !data.tabs || data.tabs.length === 0) return null;
  return (
    <div className="sp-tabs">
      <div className="sp-tab-strip" role="tablist">
        {data.tabs.map((t, idx) => (
          <button key={idx} role="tab" aria-selected={i === idx}
            className={'sp-tab' + (i === idx ? ' on' : '')} onClick={() => setI(idx)}>
            {t.name}
          </button>
        ))}
      </div>
      <div className="sp-tab-body" dangerouslySetInnerHTML={{__html: data.tabs[i].html}} />
      {data.appendix ? (
        <div className="sp-tab-appendix" dangerouslySetInnerHTML={{__html: data.appendix}} />
      ) : null}
    </div>
  );
}

export default function ScenarioPlayer() {
  const {i18n} = useDocusaurusContext();
  const lang = i18n.currentLocale === 'en' ? 'en' : 'es'; // sigue el idioma del sitio
  const location = useLocation();
  const [ci, setCi] = useState(0);
  const [genericCase, setGenericCase] = useState(null);
  const [cur, setCur] = useState(0);
  const [idResolved, setIdResolved] = useState(false);
  const [decision, setDecision] = useState('pending'); // HITL: pending | approved | denied

  // Iconos oficiales por tipo de nodo (kagent / agentgateway / MCP).
  const ICON = {
    agent: useBaseUrl('/img/kagent.png'),
    gw: useBaseUrl('/img/agw-favicon.svg'),
    mcp: useBaseUrl('/img/mcp.svg'),
    registry: useBaseUrl('/img/agentregistry.png'),
  };

  // Iconos oficiales por componente Solo en la tira de remediación (bloque 5).
  const COMP_ICON = {
    agentgateway: useBaseUrl('/img/agw-favicon.svg'),
    kagent: useBaseUrl('/img/kagent.png'),
    agentregistry: useBaseUrl('/img/agentregistry.png'),
  };
  const compIcon = (cn) => {
    const key = String(cn || '').toLowerCase();
    for (const k of Object.keys(COMP_ICON)) if (key.includes(k)) return COMP_ICON[k];
    return null;
  };

  const t = UI[lang];
  // Si el caso trae `spec`, compilamos zonas → layout+steps+viewBox dinámicos.
  const c = withSpec(genericCase || CASES[ci]);
  // Un caso puede sobreescribir la topología (LAYOUT) y la coreografía (STEP_META).
  const activeLayout = c.layout || LAYOUT;
  const activeSteps = c.steps || STEP_META;
  const vb = c.viewBox || {w: 940, h: 400};
  buildPos(activeLayout);
  const step = activeSteps[cur];
  const P = (v) => (v && typeof v === 'object' && ('es' in v || 'en' in v)) ? v[lang] : v;

  useEffect(() => {
    setIdResolved(false);
    setDecision('pending');
    if (step.badge === 'id') {
      const timer = setTimeout(() => setIdResolved(true), 900);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [ci, cur, lang, step.badge]);

  // Deep-link por caso: ?case=<id>. Acepta:
  //  · id piloto corto ("legal") o largo ("legal/revision-de-contratos-redlining")
  //  · id de catálogo ("rol/slug"): construye caso genérico desde el README parseado.
  useEffect(() => {
    const id = new URLSearchParams(location.search).get('case');
    if (!id) return;
    // 1) piloto directo por id de CASES
    const idxDirect = CASES.findIndex((c) => c.id === id);
    if (idxDirect >= 0) { setGenericCase(null); setCi(idxDirect); setCur(0); return; }
    // 2) alias piloto (PILOT_MAP)
    if (PILOT_MAP[id] != null) { setGenericCase(null); setCi(PILOT_MAP[id]); setCur(0); return; }
    // 3) genérico: id de catálogo → detalle parseado
    if (detalle[id]) { setGenericCase(buildGenericCase(id, detalle[id])); setCur(0); return; }
    // fallback: primer piloto
    setGenericCase(null); setCi(0); setCur(0);
  }, [location.search]);

  const vis = (id) => {
    const nd = activeLayout.find((n) => n.id === id);
    return nd && cur >= nd.ap;
  };
  const goto = (i) => setCur(i);
  const scrollTo = (id) => {
    if (typeof document === 'undefined') return;
    const elx = document.getElementById(id);
    if (elx) elx.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  // ---- badge ----
  let badge = null;
  if (step.hitl) {
    badge = decision === 'approved' ? {cls: 'ok', icon: '✓', cap: t.apOk}
      : decision === 'denied' ? {cls: 'danger', icon: '✕', cap: t.dnOk}
      : {cls: 'pending', icon: '⏳', cap: t.awaiting};
  } else if (step.badge === 'id') badge = idResolved ? {cls: 'ok', icon: '✓', cap: t.identOk} : {cls: 'pending', icon: '?', cap: t.identQ};
  else if (step.badge === 'risk') badge = {cls: 'danger', icon: '!', cap: P(c.risk)};
  else if (step.badge === 'ok') badge = {cls: 'ok', icon: '✓', cap: t.okCap};

  // ---- edges (HITL: la acción sensible refleja la decisión) ----
  // Por caso se puede sobreescribir la arista del gate con c.hitlEdge = ['from', 'to'].
  const hEdge = c.hitlEdge || ['gw', 'mcpB'];
  const renderEdges = step.hitl
    ? (step.edges || []).map((e) => (e[0] === hEdge[0] && e[1] === hEdge[1])
        ? [hEdge[0], hEdge[1], decision === 'pending' ? 'gate' : decision === 'approved' ? 'pass' : 'block']
        : e)
    : (step.edges || []);
  const visEdges = renderEdges.filter((e) => vis(e[0]) && vis(e[1]));
  const anchors = computeAnchors(visEdges);

  // ---- node label/sub ----
  const nodeText = (nd) => {
    if (nd.id === 'gw') return {l: 'agentgateway', s: lang === 'es' ? 'identidad · política' : 'identity · policy'};
    if (nd.id === 'registry') return {l: 'agentregistry', s: lang === 'es' ? 'inventario' : 'registry'};
    if (nd.id === 'trace') return {l: lang === 'es' ? 'observabilidad' : 'observability', s: 'OTel'};
    const d = c.n[nd.id] || {};
    return {l: P(d.l != null ? d.l : nd.id), s: d.s != null ? P(d.s) : ''};
  };

  const on = step.on || [];
  const danger = step.danger || [];

  return (
    <div className="spwrap">

      <div className="caseline">
        <span className="role">{P(c.role)}</span>
        <h1>{P(c.title)}</h1>
        <span className="chip">{P(c.pat)}</span>
        {c.gw.map((x) => <span key={x} className="chip gw">{x}</span>)}
      </div>

      <div className="player" id="sp-player">
        <div className="player-head">
          <div className="t">{P(c.scTitle)}</div>
          <div className="s">{P(c.scSub)}</div>
        </div>

        <div className="stepper">
          {stageN.map((st, idx) => (
            <button key={idx} className={'step' + (idx < cur ? ' done' : '') + (idx === cur ? ' active' : '')} onClick={() => goto(idx)}>
              <div className="lbl">{'0' + (idx + 1) + ' ' + P(st)}</div>
              <div className="bar" />
            </button>
          ))}
        </div>

        <div className="annobar">
          {!badge && !step.hitl && <span className="hint">{t.hint}</span>}
          {badge && (
            <div className={'ov ' + badge.cls}>
              <div className="dmd"><span>{badge.icon}</span></div>
              <div className="cap">{badge.cap}</div>
            </div>
          )}
          {step.hitl && (
            <div className="hitl">
              <span className="q">{P(c.hitl)}</span>
              {decision === 'pending' ? (
                <>
                  <button className="b ap" onClick={() => setDecision('approved')}>{t.hitlAp}</button>
                  <button className="b dn" onClick={() => setDecision('denied')}>{t.hitlDn}</button>
                </>
              ) : (
                <button className="b again" onClick={() => setDecision('pending')}>{t.decideAgain}</button>
              )}
            </div>
          )}
        </div>

        <div className="scene-wrap">
          <svg className="scene" viewBox={`0 0 ${vb.w} ${vb.h}`} role="img" aria-label="Scenario">
            <defs>
              {EDGE_STATES.map(([st, color]) => (
                <marker key={st} id={'sp-arrow-' + st} viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                  <path d="M0 1 L9 5 L0 9 Z" fill={color} />
                </marker>
              ))}
            </defs>
            <g>
              {visEdges.map((e, i) => (
                <path key={i} className={'ed ' + e[2]} d={pathFrom(anchors[i])} markerEnd={`url(#sp-arrow-${e[2]})`} />
              ))}
            </g>
            <g>
              {activeLayout.filter((nd) => vis(nd.id)).map((nd) => {
                const isOn = on.indexOf(nd.id) >= 0;
                const isDanger = danger.indexOf(nd.id) >= 0 || nd.id === 'shadow';
                let cls = 'nb';
                if (nd.kind === 'mcp') cls += ' mcp';
                if (nd.kind === 'gw' || nd.kind === 'registry') cls = 'nb gw';
                if (nd.kind === 'trace') cls += ' trace';
                if (isDanger) cls = 'nb danger';
                if (isOn) cls += ' on';
                const gcolor = isDanger ? 'var(--sp-red)' : (GCOLOR[nd.kind] || 'var(--sp-sub)');
                const dim = cur === 4 && !isOn;
                const cx = nd.x + NW / 2;
                const {l, s} = nodeText(nd);
                const icon = ICON[nd.kind];
                return (
                  <g key={nd.id} className={dim ? 'dim' : undefined}>
                    <rect className={cls} x={nd.x} y={nd.y} width={NW} height={NH} rx="11" />
                    {icon ? (
                      <image href={icon} x={cx - 11} y={nd.y + 5} width="22" height="22" />
                    ) : (
                      <g className="nglyph" transform={`translate(${cx - 9},${nd.y + 8})`} stroke={gcolor}
                        dangerouslySetInnerHTML={{__html: GLYPH[nd.kind] || ''}} />
                    )}
                    <text className="nl" x={cx} y={nd.y + 40} textAnchor="middle">{l}</text>
                    {s ? <text className="ns" x={cx} y={nd.y + 50} textAnchor="middle">{s}</text> : null}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <div className="caption">
          <span className={'kind ' + (step.kind === 'block' ? 'block' : step.kind === 'pass' ? 'pass' : '')}>{P(kindLbl[step.kind])}</span>
          <div className="cbody">
            <div className="txt">{P(c.caps[cur])}</div>
            {step.hitl && (
              <div className={'hitl-outcome ' + decision}>
                {decision === 'approved' ? t.approvedCap : decision === 'denied' ? t.deniedCap : t.awaitingCap}
              </div>
            )}
          </div>
        </div>

        {step.gw && c.comps && c.comps.length > 0 && (
          <div className="comps">
            {c.comps.map((co) => {
              const ic = compIcon(co.cn);
              return (
                <div key={co.cn} className="comp">
                  <div className="cn">{ic ? <img className="cn-ic" src={ic} alt="" aria-hidden="true" /> : null}{co.cn}</div>
                  <div className="cd">{P(co.cd)}</div>
                </div>
              );
            })}
          </div>
        )}

        <div className="controls">
          <span className="count">{(lang === 'es' ? 'Paso ' : 'Step ') + (cur + 1) + ' / 5'}</span>
          <button className="btn" disabled={cur === 0} onClick={() => cur > 0 && goto(cur - 1)}>{t.prev}</button>
          <button className="btn primary" disabled={cur === 4} onClick={() => cur < 4 && goto(cur + 1)}>{t.next}</button>
        </div>

        <a className={'sp-detail-cta' + (cur === 4 ? ' emphasis' : '')}
           onClick={() => scrollTo('sp-block-0')}>
          {cur === 4
            ? (lang === 'es' ? 'Has recorrido las 5 etapas · leer el detalle completo ↓' : 'You have covered the 5 stages · read the full detail ↓')
            : (lang === 'es' ? '¿Quieres profundizar? Ver los 5 bloques completos ↓' : 'Want to dig deeper? See the 5 full blocks ↓')}
        </a>
      </div>

      <div className="blocks">
        {c.blocks.map((b, idx) => (
          <div key={idx} className="block" id={'sp-block-' + idx} style={{'--sp-acc': accents[idx]}}>
            <div className="bk-top">
              <span className="bk-eyebrow">{t.bloque + ' ' + (idx + 1) + ' · ' + P(stageN[idx])}</span>
              <a className="backlink" onClick={() => scrollTo('sp-player')}>{t.back}</a>
            </div>
            <h3>{P(b.h)}</h3>
            {b.tabs
              ? <ClientTabs data={P(b.tabs)} />
              : <div dangerouslySetInnerHTML={{__html: P(b.body)}} />}
            {idx === 2 && <div className="sp-kpinote" dangerouslySetInnerHTML={{__html: t.kpiNote}} />}
          </div>
        ))}
      </div>
    </div>
  );
}
