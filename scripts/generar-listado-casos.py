#!/usr/bin/env python3
"""Genera website/src/data/casos.json con el catalogo de casos de uso.

Recorre catalogo-agentico/01-casos-de-uso/<NN-rol>/<slug>/README.md,
extrae rol y titulo (primer heading H1) y asigna heuristicamente
tecnica y nivel de madurez.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CASOS_DIR = ROOT / "catalogo-agentico" / "01-casos-de-uso"
OUT = ROOT / "website" / "src" / "data" / "casos.json"

ROLES = {
    "01-manager": "manager",
    "02-analista": "analista",
    "03-desarrollador": "desarrollador",
    "04-operador": "operador",
    "05-finanzas": "finanzas",
    "06-legal": "legal",
    "07-rrhh": "rrhh",
    "08-ventas": "ventas",
    "09-marketing": "marketing",
    "10-soporte": "soporte",
    "11-it-seguridad": "it-seguridad",
    "12-ejecutivo": "ejecutivo",
    "13-frontline": "frontline",
}

ROLE_LABEL = {
    "manager": "MANAGER",
    "analista": "ANALISTA",
    "desarrollador": "DESARROLLADOR",
    "operador": "OPERADOR",
    "finanzas": "FINANZAS",
    "legal": "LEGAL",
    "rrhh": "RRHH",
    "ventas": "VENTAS",
    "marketing": "MARKETING",
    "soporte": "SOPORTE",
    "it-seguridad": "IT / SEGURIDAD",
    "ejecutivo": "EJECUTIVO",
    "frontline": "FRONTLINE",
}


def tecnica(slug: str, rol: str) -> str:
    s = slug.lower()
    if "shadow" in s:
        return "shadow AI"
    if "triage" in s:
        return "triage"
    if any(k in s for k in ["codigo", "code", "agents-md", "ide", "commit", "pr-"]):
        return "código"
    if any(k in s for k in [
        "documento", "contrato", "redlining", "diligence", "regulator", "kb",
        "conocimiento", "politica", "rfp", "dora", "eba", "kyc", "mica",
        "compliance", "cumplimiento",
    ]):
        return "documentos"
    if any(k in s for k in ["incidente", "operacional", "read-only", "runbook", "post-mortem", "sre"]):
        return "operacional"
    if any(k in s for k in ["borrador", "campana", "campaña", "generacion", "generación", "copy", "creativo"]):
        return "generación"
    if any(k in s for k in [
        "brief", "resumen", "reunion", "comunicacion", "comunicación",
        "asistente", "puesto", "1-1", "onboarding", "presentacion", "presentación",
        "board", "correo", "email",
    ]):
        return "asistencia"
    return "analítico"


HIGH_MADUREZ_KEYS = [
    "shadow", "kyc", "dora", "mica", "eba", "board", "cierre", "diligence",
    "m-a", "mna", "regulator", "contratos", "redlining", "phishing", "soc",
    "incident-response", "consolidacion", "consolidación", "auditoria",
    "auditoría", "mnpi", "compliance", "cumplimiento", "nis2", "sanciones",
    "ir-", "escalac", "escrituras", "privile", "onboarding-", "empleados",
    "salario", "rendimiento", "evaluacion", "evaluación", "hiring",
    "seleccion", "selección",
]


def madurez(slug: str, rol: str) -> str:
    s = slug.lower()
    if any(k in s for k in HIGH_MADUREZ_KEYS):
        return "3+"
    if rol in ("legal", "finanzas", "it-seguridad", "rrhh", "ejecutivo"):
        # roles regulados/criticos: mayoria 3+ salvo tareas ligeras
        light = ["resumen", "brief", "notas", "1-1", "agenda"]
        if any(k in s for k in light):
            return "1+"
        return "3+"
    return "1+"


def titulo(md_path: Path) -> str:
    try:
        for line in md_path.read_text(encoding="utf-8").splitlines():
            m = re.match(r"^#\s+(.+?)\s*$", line)
            if m:
                return m.group(1).strip()
    except Exception:
        pass
    return md_path.parent.name.replace("-", " ").capitalize()


ARQ_LABEL = {
    "A1": "A1 · Documental + validador",
    "A2": "A2 · Triage con acción gated",
    "A3": "A3 · Analítico write-back gated",
    "A4": "A4 · Chatbot cara al cliente",
    "A5": "A5 · Operacional sobre infra",
    "A6": "A6 · Investigación + síntesis",
    "A7": "A7 · Generación con guardrails",
    "A8": "A8 · Asistente de código",
}


def arquetipos(md_path):
    """Extrae los códigos A# de la línea '**Arquetipo:** ...' del bloque 5."""
    import re
    for line in md_path.read_text(encoding="utf-8").splitlines():
        if line.startswith("**Arquetipo:**"):
            codes = re.findall(r"\bA[1-8]\b", line)
            # dedup conservando orden
            seen = []
            for c in codes:
                if c not in seen:
                    seen.append(c)
            return seen
    return []


CAP_LABEL = {
    "chain-de-agentes": "Chain de agentes",
    "multi-llm-balanceo": "Multi-LLM / balanceo",
    "agentevals": "AgentEvals",
    "migracion-semantic-routing": "Migración / semantic routing",
    "judge-llm": "Judge LLM",
    "guardrails-externos": "Guardrails externos",
    "llm-gateway-codigo": "LLM Gateway para código",
}


def capacidades(md_path):
    """Extrae capacidades destacadas del marcador '<!-- capacidad: X -->'."""
    import re
    caps = []
    for line in md_path.read_text(encoding="utf-8").splitlines():
        m = re.search(r"<!--\s*capacidad:\s*([a-z0-9\-]+)\s*-->", line)
        if m and m.group(1) not in caps:
            caps.append(m.group(1))
    return caps


CASOS_JS = ROOT / "website" / "src" / "components" / "ScenarioPlayer" / "casos.js"


def gateway_map():
    """Mapea id de caso → roles de gateway leyendo el campo `gw:[...]` de casos.js.

    En casos.js cada objeto declara en una línea `id: '<rol>/<slug>', ... gw: ['LLM Gateway', ...]`.
    El rol de gateway vive solo en el objeto del reproductor; se refleja aquí como eje de filtro.
    """
    import re
    out = {}
    if not CASOS_JS.exists():
        return out
    id_re = re.compile(r"^\s*id:\s*'([^']+)'")
    gw_re = re.compile(r"\bgw:\s*\[([^\]]*)\]")
    item_re = re.compile(r"'([^']+)'")
    current = None  # id del objeto en curso, hasta encontrar su gw
    for line in CASOS_JS.read_text(encoding="utf-8").splitlines():
        mid = id_re.search(line)
        if mid:
            current = mid.group(1)  # nuevo objeto; su gw puede venir en esta o próximas líneas
        mgw = gw_re.search(line)
        if mgw and current is not None:
            roles = item_re.findall(mgw.group(1))
            if roles:
                out[current] = roles
            current = None  # ya asignado; evita capturar gw de sub-estructuras
    return out


def title_i18n_map():
    """Mapea id de caso → {es, en} leyendo la línea `title: {es: '...', en: '...'}` de casos.js.

    Permite mostrar el título del catálogo en el idioma del sitio (el objeto del
    reproductor es la fuente bilingüe; el README es solo español).
    """
    import re
    out = {}
    if not CASOS_JS.exists():
        return out
    id_re = re.compile(r"^\s*id:\s*'([^']+)'")
    title_re = re.compile(r"title:\s*\{\s*es:\s*'((?:[^'\\]|\\.)*)'\s*,\s*en:\s*'((?:[^'\\]|\\.)*)'\s*\}")
    current = None
    for line in CASOS_JS.read_text(encoding="utf-8").splitlines():
        mid = id_re.search(line)
        if mid:
            current = mid.group(1)
        mt = title_re.search(line)
        if mt and current is not None:
            unescape = lambda s: s.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")
            out[current] = {"es": unescape(mt.group(1)), "en": unescape(mt.group(2))}
            current = None
    return out


def build():
    gwmap = gateway_map()
    titlemap = title_i18n_map()
    casos = []
    for role_dir_name, role_slug in ROLES.items():
        role_dir = CASOS_DIR / role_dir_name
        if not role_dir.is_dir():
            continue
        for sub in sorted(role_dir.iterdir()):
            if not sub.is_dir():
                continue
            readme = sub / "README.md"
            if not readme.exists():
                continue
            slug = sub.name
            t = titulo(readme)
            arqs = arquetipos(readme)
            caps = capacidades(readme)
            casos.append({
                "id": f"{role_slug}/{slug}",
                "rol": role_slug,
                "rolLabel": ROLE_LABEL[role_slug],
                "titulo": t,
                "slug": slug,
                "tecnica": tecnica(slug, role_slug),
                "madurez": madurez(slug, role_slug),
                "arquetipos": arqs,
                "arquetiposLabel": [ARQ_LABEL.get(a, a) for a in arqs],
                "capacidades": caps,
                "capacidadesLabel": [CAP_LABEL.get(c, c) for c in caps],
                "gateways": gwmap.get(f"{role_slug}/{slug}", []),
                "tituloI18n": titlemap.get(f"{role_slug}/{slug}"),
                "path": f"catalogo-agentico/01-casos-de-uso/{role_dir_name}/{slug}/README.md",
            })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(casos, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Escritos {len(casos)} casos en {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    build()
