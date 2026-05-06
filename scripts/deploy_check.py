#!/usr/bin/env python3
from __future__ import annotations

import subprocess
import sys


def main() -> int:
    checks = [
        [sys.executable, 'scripts/env_check.py', '--env-file', '.env'],
    ]
    for cmd in checks:
        result = subprocess.run(cmd)
        if result.returncode != 0:
            return result.returncode
    print('[ OK ] deploy preflight passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
