#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def run(cmd: list[str], cwd: Path | None = None) -> None:
    print('[RUN]', ' '.join(cmd))
    subprocess.run(cmd, cwd=cwd or ROOT, check=True)


def main() -> int:
    parser = argparse.ArgumentParser(description='Sobe ambiente local do template.')
    parser.add_argument('--client', default=os.getenv('CLIENT_CODE', 'cliente-demo'))
    parser.add_argument('--no-db', action='store_true')
    args = parser.parse_args()

    env = os.environ.copy()
    env.setdefault('CLIENT_CODE', args.client)

    if not args.no_db:
        run(['docker', 'compose', '-f', 'infra/local/docker-compose.yml', 'up', '-d', 'postgres'])

    print('\nProximos comandos em terminais separados:')
    print('  API: cd apps/api && uvicorn src.main:app --reload --host 127.0.0.1 --port 8000')
    print('  WEB: cd apps/web && npm run dev -- --port 5173')
    print('\nDica: mantenha estes comandos simples no template; cada projeto pode adicionar automacao depois.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
