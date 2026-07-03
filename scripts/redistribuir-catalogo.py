#!/usr/bin/env python3
"""
Fase 1: redistribuir los 25 archivos del catálogo a subcarpetas de rol.
Añade 5º bloque (Arquitectura de remediación) placeholder.
Elimina secciones "Lab asociado" y "Componentes Solo...".
"""
import os
import re
import shutil
from pathlib import Path

BASE = Path("pieza-0-alfabetizacion/01-casos-de-uso")
CAT = BASE / "catalogo"
POR_ROL = BASE / "por-rol"

MAPEO = {
    "analisis-varianza-pl": "05-finanzas",
    "conciliacion-bancaria": "05-finanzas",
    "apoyo-kyc-onboarding": "06-legal",
    "apoyo-regulatorio": "06-legal",
    "lectura-dora-eba": "06-legal",
    "revision-contratos-redlining": "06-legal",
    "due-diligence": "06-legal",
    "asistente-desarrollador-agents-md": "03-desarrollador",
    "asistente-empleado-politicas": "07-rrhh",
    "voz-empleado": "07-rrhh",
    "asistente-puesto-banca": "13-frontline",
    "atencion-cliente-plan": "10-soporte",
    "kb-soporte": "10-soporte",
    "triage-tickets-soporte": "10-soporte",
    "borrador-campana-guardarrailes": "09-marketing",
    "brief-comercial-pre-reunion": "08-ventas",
    "respuesta-rfp": "08-ventas",
    "diagnostico-incidente-operacional": "04-operador",
    "triage-incidencias-red": "04-operador",
    "cumplimiento-nis2": "11-it-seguridad",
    "triage-phishing-usuario": "11-it-seguridad",
    "triage-soc": "11-it-seguridad",
    "gestion-documental-proyecto": "01-manager",
    "lectura-critica-planes": "01-manager",
    "resumen-reuniones-acciones": "01-manager",
}

BLOQUE_5 = """
## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
"""


def strip_seccion(texto: str, encabezado_regex: str) -> str:
    """Elimina desde una sección ## X hasta la siguiente ## o EOF."""
    pat = re.compile(rf"^{encabezado_regex}\s*\n.*?(?=^## |\Z)", re.DOTALL | re.MULTILINE)
    return pat.sub("", texto)


def limpiar_separadores_finales(texto: str) -> str:
    """Quita separadores `---` finales huérfanos y espacios al final."""
    texto = texto.rstrip()
    while texto.endswith("---"):
        texto = texto[:-3].rstrip()
    return texto + "\n"


def procesar(src: Path, dst: Path):
    contenido = src.read_text(encoding="utf-8")
    contenido = strip_seccion(contenido, r"## Lab asociado")
    contenido = strip_seccion(contenido, r"## Componentes Solo.*")
    # Insertar bloque 5 antes de "## Referencias" si existe; si no, al final
    m = re.search(r"^## Referencias", contenido, re.MULTILINE)
    if m:
        contenido = contenido[:m.start()] + BLOQUE_5 + "\n" + contenido[m.start():]
    else:
        contenido = limpiar_separadores_finales(contenido) + BLOQUE_5

    contenido = limpiar_separadores_finales(contenido)
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(contenido, encoding="utf-8")


def main():
    if not CAT.exists():
        print(f"No existe {CAT}")
        return

    for slug, rol in MAPEO.items():
        src = CAT / f"{slug}.md"
        if not src.exists():
            print(f"MISSING source: {src}")
            continue
        dst = POR_ROL / rol / slug / "README.md"
        procesar(src, dst)
        print(f"OK {src.name} -> {dst.relative_to(BASE)}")

    print(f"\nTotal procesados: {len(MAPEO)}")

if __name__ == "__main__":
    main()
