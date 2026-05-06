import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from .settings import get_settings

ROOT_DIR = Path(__file__).resolve().parents[6]
CLIENT_CONFIG_DIR = ROOT_DIR / 'config' / 'clients'


def _load_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding='utf-8'))


@lru_cache
def get_client_config() -> dict[str, Any]:
    code = get_settings().client_code
    base_dir = CLIENT_CONFIG_DIR / 'default'
    client_dir = CLIENT_CONFIG_DIR / code
    merged: dict[str, Any] = {}
    for name in ['client', 'branding', 'features', 'permissions', 'copy']:
        merged[name] = _load_json(base_dir / f'{name}.json') | _load_json(client_dir / f'{name}.json')
    return merged
