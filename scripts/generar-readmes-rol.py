#!/usr/bin/env python3
"""Genera README.md por rol listando los casos redistribuidos."""
from pathlib import Path

POR_ROL = Path("pieza-0-alfabetizacion/01-casos-de-uso/por-rol")

ROLES = {
    "01-manager": "Manager",
    "02-analista": "Analista",
    "03-desarrollador": "Desarrollador",
    "04-operador": "Operador (SRE/DevOps)",
    "05-finanzas": "Finanzas",
    "06-legal": "Legal",
    "07-rrhh": "RRHH",
    "08-ventas": "Ventas",
    "09-marketing": "Marketing",
    "10-soporte": "Soporte",
    "11-it-seguridad": "IT / Seguridad",
    "12-ejecutivo": "Ejecutivo",
    "13-frontline": "Frontline",
}


def titulo_caso(readme: Path) -> str:
    for line in readme.read_text(encoding="utf-8").splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return readme.parent.name

def main():
    for slug, nombre in ROLES.items():
        rol_dir = POR_ROL / slug
        rol_dir.mkdir(exist_ok=True)
        # Listar subcarpetas de caso (excluye README.md)
        casos = sorted([p for p in rol_dir.iterdir() if p.is_dir()])
        lineas = [f"# {nombre}", "", f"Casos de uso del rol **{nombre}**. Cada caso vive en su propia subcarpeta con los 5 bloques (caso, cómo, KPIs, riesgos, arquitectura de remediación).", ""]
        if casos:
            lineas.append("| Caso | Descripción |")
            lineas.append("|------|-------------|")
            for c in casos:
                readme = c / "README.md"
                if readme.exists():
                    t = titulo_caso(readme)
                    lineas.append(f"| [{c.name}](./{c.name}/README.md) | {t} |")
        else:
            lineas.append("> Casos pendientes de redactar. Ver `_todo-*.md` para el borrador monolítico previo.")
        lineas.append("")
        (rol_dir / "README.md").write_text("\n".join(lineas), encoding="utf-8")
        print(f"OK {slug}/README.md ({len(casos)} casos)")

if __name__ == "__main__":
    main()
