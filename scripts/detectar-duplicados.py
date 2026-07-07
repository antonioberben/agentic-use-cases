#!/usr/bin/env python3
"""Detecta pares de casos casi-duplicados dentro del mismo rol."""
import re
import unicodedata
from pathlib import Path

POR_ROL = Path("catalogo-agentico/01-casos-de-uso/por-rol")

# Slugs conocidos de Fase 1 (venían del catálogo)
FASE1_SLUGS = {
    "analisis-varianza-pl", "conciliacion-bancaria", "apoyo-kyc-onboarding",
    "apoyo-regulatorio", "lectura-dora-eba", "revision-contratos-redlining",
    "due-diligence", "asistente-desarrollador-agents-md",
    "asistente-empleado-politicas", "voz-empleado", "asistente-puesto-banca",
    "atencion-cliente-plan", "kb-soporte", "triage-tickets-soporte",
    "borrador-campana-guardarrailes", "brief-comercial-pre-reunion",
    "respuesta-rfp", "diagnostico-incidente-operacional",
    "triage-incidencias-red", "cumplimiento-nis2", "triage-phishing-usuario",
    "triage-soc", "gestion-documental-proyecto", "lectura-critica-planes",
    "resumen-reuniones-acciones",
}


def leer_titulo(readme: Path) -> str:
    for line in readme.read_text(encoding="utf-8").splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return readme.parent.name


def normalizar(texto: str) -> set:
    """Devuelve palabras significativas del título."""
    nfd = unicodedata.normalize("NFD", texto.lower())
    sin_acentos = "".join(c for c in nfd if unicodedata.category(c) != "Mn")
    palabras = re.findall(r"[a-z0-9]+", sin_acentos)
    # Filtrar stopwords cortas
    stop = {"de", "la", "el", "en", "y", "un", "una", "para", "del", "al", "por", "con", "los", "las", "a", "o", "e"}
    return {p for p in palabras if p not in stop and len(p) > 2}


def similitud(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / min(len(a), len(b))


def main():
    total_pares = 0
    for rol_dir in sorted(POR_ROL.iterdir()):
        if not rol_dir.is_dir():
            continue
        casos = sorted([p for p in rol_dir.iterdir() if p.is_dir()])
        titulos = {c.name: leer_titulo(c / "README.md") for c in casos if (c / "README.md").exists()}
        keywords = {slug: normalizar(t) for slug, t in titulos.items()}

        pares = []
        slugs = list(keywords.keys())
        for i, a in enumerate(slugs):
            for b in slugs[i+1:]:
                sim = similitud(keywords[a], keywords[b])
                if sim >= 0.5:
                    fase_a = "F1" if a in FASE1_SLUGS else "F2"
                    fase_b = "F1" if b in FASE1_SLUGS else "F2"
                    pares.append((sim, a, fase_a, titulos[a], b, fase_b, titulos[b]))

        if pares:
            print(f"\n=== {rol_dir.name} ===")
            for sim, a, fa, ta, b, fb, tb in sorted(pares, key=lambda x: -x[0]):
                print(f"  sim={sim:.2f}  {fa} {a!r}  <->  {fb} {b!r}")
                print(f"         {ta!r}")
                print(f"         {tb!r}")
                total_pares += 1

    print(f"\nTotal pares detectados: {total_pares}")


if __name__ == "__main__":
    main()
