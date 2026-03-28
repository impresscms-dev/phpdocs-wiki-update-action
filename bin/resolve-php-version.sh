#!/usr/bin/env bash

ENGINE="$1"

get_default_version() {
  case "$1" in
    "evert/phpdoc-md")
      echo "7.4"
      ;;
    "clean/phpdoc-md")
      echo "8.1"
      ;;
    *)
      echo "ERROR: unknown engine" >&2
      return 1
      ;;
  esac
}

get_constraint_from_composer_json() {
  if [ ! -f "composer.json" ]; then
    return 0
  fi

  python3 - <<'PY'
import json

try:
    with open("composer.json", "r", encoding="utf-8") as file:
        data = json.load(file)
except Exception:
    raise SystemExit(0)

require = data.get("require", {})
if isinstance(require, dict):
    php_constraint = require.get("php")
    if isinstance(php_constraint, str) and php_constraint.strip():
        print(php_constraint.strip())
        raise SystemExit(0)

config = data.get("config", {})
if isinstance(config, dict):
    platform = config.get("platform", {})
    if isinstance(platform, dict):
        php_constraint = platform.get("php")
        if isinstance(php_constraint, str) and php_constraint.strip():
            print(php_constraint.strip())
PY
}

get_constraint_from_composer_lock() {
  if [ ! -f "composer.lock" ]; then
    return 0
  fi

  python3 - <<'PY'
import json

try:
    with open("composer.lock", "r", encoding="utf-8") as file:
        data = json.load(file)
except Exception:
    raise SystemExit(0)

for key in ("platform", "platform-overrides"):
    values = data.get(key, {})
    if isinstance(values, dict):
        php_constraint = values.get("php")
        if isinstance(php_constraint, str) and php_constraint.strip():
            print(php_constraint.strip())
            raise SystemExit(0)
PY
}

normalize_constraint_to_version() {
  local php_constraint
  php_constraint="$1"

  python3 - "$php_constraint" <<'PY'
import re
import sys

constraint = sys.argv[1]
match = re.search(r'(\d+)\.(\d+)', constraint)
if match:
    print(f"{int(match.group(1))}.{int(match.group(2))}")
PY
}

DEFAULT_VERSION=$(get_default_version "$ENGINE") || exit 1
DETECTED_CONSTRAINT=$(get_constraint_from_composer_json)

if [ -z "$DETECTED_CONSTRAINT" ]; then
  DETECTED_CONSTRAINT=$(get_constraint_from_composer_lock)
fi

if [ -n "$DETECTED_CONSTRAINT" ]; then
  DETECTED_VERSION=$(normalize_constraint_to_version "$DETECTED_CONSTRAINT")
fi

if [ -n "$DETECTED_VERSION" ]; then
  echo "$DETECTED_VERSION"
else
  echo "$DEFAULT_VERSION"
fi
