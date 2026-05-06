#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sys
from pathlib import Path

REQUIRED = [
    'APP_ENV',
    'DEPLOY_TARGET',
    'CLIENT_CODE',
    'DATABASE_URL',
    'API_BASE_URL',
    'WEB_BASE_URL',
    'CORS_ALLOWED_ORIGINS',
    'JWT_SECRET',
    'STORAGE_BACKEND',
]


def parse_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for raw in path.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        values[key.strip()] = value.strip()
    return values


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--env-file', default='.env')
    args = parser.parse_args()
    path = Path(args.env_file)
    if not path.exists():
        print(f'[ERR] env file not found: {path}')
        return 1
    values = parse_env(path)
    missing = [key for key in REQUIRED if not values.get(key)]
    if missing:
        print('[ERR] missing required env vars:')
        for key in missing:
            print(f'  - {key}')
        return 2
    if values.get('APP_ENV') == 'production' and values.get('JWT_SECRET') == 'change-me-local':
        print('[ERR] production cannot use local JWT_SECRET')
        return 3
    print('[ OK ] environment contract valid')
    print(f"       APP_ENV={values.get('APP_ENV')} DEPLOY_TARGET={values.get('DEPLOY_TARGET')} CLIENT_CODE={values.get('CLIENT_CODE')}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
