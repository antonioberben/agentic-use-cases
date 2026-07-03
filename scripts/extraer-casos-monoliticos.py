#!/usr/bin/env python3
"""
Fase 2: extrae los casos de los archivos _todo-NN-rol.md a subcarpetas individuales
con los 5 bloques. Si la subcarpeta ya existe (Fase 1), NO sobrescribe.
"""
import re
import unicodedata
from pathlib import Path

POR_ROL = Path("pieza-0-alfabetizacion/01-casos-de-uso/por-rol")

BLOQUE_5 = """
## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
"""


def slugify(texto: str) -> str:
    # Quitar acentos
    nfd = unicodedata.normalize("NFD", texto)
    sin_acentos = "".join(c for c in nfd if unicodedata.category(c) != "Mn")
    # Solo alfanum y guiones, en minúsculas
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", sin_acentos).strip("-").lower()
    # Limitar longitud
    palabras = slug.split("-")
    if len(palabras) > 6:
        slug = "-".join(palabras[:6])
    return slug


def procesar_todo(path: Path):
    contenido = path.read_text(encoding="utf-8")
    # Extraer nombre de rol del archivo: _todo-05-finanzas.md -> 05-finanzas
    rol_slug = path.stem.replace("_todo-", "")
    rol_dir = POR_ROL / rol_slug

    # Localizar todas las secciones `### N.M Título` con su contenido
    # Regex: ^### seguido de números.dígitos, titulo, hasta el próximo ### o EOF
    pat = re.compile(r"^### ([0-9]+\.[0-9]+)\s+(.+?)\n(.*?)(?=^### [0-9]|\Z)", re.DOTALL | re.MULTILINE)

    creados = 0
    existentes = 0
    for m in pat.finditer(contenido):
        numero = m.group(1)
        titulo = m.group(2).strip()
        cuerpo = m.group(3).rstrip()
        slug = slugify(titulo)
        destino_dir = rol_dir / slug
        if destino_dir.exists():
            existentes += 1
            continue

        # Normalizar headings internos:
        # #### 1) Caso de uso -> ## 1. Caso de uso
        # #### 2) Cómo resolverlo -> ## 2. Cómo resolverlo
        # etc.
        cuerpo_norm = re.sub(r"^#### (\d+)\)\s+", r"## \1. ", cuerpo, flags=re.MULTILINE)
        # Bajar cualquier resto de #### a ###
        cuerpo_norm = re.sub(r"^#####\s+", r"#### ", cuerpo_norm, flags=re.MULTILINE)

        contenido_final = f"# {titulo}\n\n> **Rol:** {rol_slug.split('-', 1)[1]} · **Caso {numero}** (extraído del archivo monolítico en Fase 2).\n{cuerpo_norm}\n{BLOQUE_5}"

        destino_dir.mkdir(parents=True, exist_ok=True)
        (destino_dir / "README.md").write_text(contenido_final, encoding="utf-8")
        creados += 1

    print(f"{rol_slug}: {creados} nuevos, {existentes} ya existían (Fase 1)")


def main():
    for todo in sorted(POR_ROL.glob("_todo-*.md")):
        procesar_todo(todo)


if __name__ == "__main__":
    main()
