#!/usr/bin/env python3
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--client", default="titas-master")
    parser.add_argument("--package-manager", default="npm", choices=["npm", "pnpm", "bun"])
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    web = root / "apps" / "web"
    if args.package_manager == "bun":
        cmd = ["bun", "run", "dev"]
    elif args.package_manager == "pnpm":
        cmd = ["pnpm", "dev"]
    else:
        cmd = ["npm", "run", "dev"]
    print(f"Iniciando {args.client} em {web} com {args.package_manager}...")
    return subprocess.call(cmd, cwd=web)


if __name__ == "__main__":
    raise SystemExit(main())
