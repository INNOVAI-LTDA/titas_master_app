#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

REQUIRED = [
    "APP_ENV",
    "DEPLOY_TARGET",
    "CLIENT_CODE",
    "WEB_BASE_URL",
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
]


def parse_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        raise SystemExit(f"Arquivo de ambiente não encontrado: {path}")
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--env-file", default=".env")
    args = parser.parse_args()
    values = parse_env(Path(args.env_file))
    missing = [key for key in REQUIRED if not values.get(key)]
    if missing:
        raise SystemExit("Variáveis ausentes: " + ", ".join(missing))
    print("Ambiente OK.")


if __name__ == "__main__":
    main()
