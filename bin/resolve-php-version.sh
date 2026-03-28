#!/usr/bin/env bash

ENGINE="$1"

has_node() {
  command -v node > /dev/null 2>&1
}

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
  if [ ! -f "composer.json" ] || ! has_node; then
    return 0
  fi

  node -e "
const fs = require('fs');
try {
  const data = JSON.parse(fs.readFileSync('composer.json', 'utf8'));
  const requirePhp = data?.require?.php;
  if (typeof requirePhp === 'string' && requirePhp.trim() !== '') {
    process.stdout.write(requirePhp.trim());
    process.exit(0);
  }
  const platformPhp = data?.config?.platform?.php;
  if (typeof platformPhp === 'string' && platformPhp.trim() !== '') {
    process.stdout.write(platformPhp.trim());
  }
} catch (_) {}
"
}

get_constraint_from_composer_lock() {
  if [ ! -f "composer.lock" ] || ! has_node; then
    return 0
  fi

  node -e "
const fs = require('fs');
try {
  const data = JSON.parse(fs.readFileSync('composer.lock', 'utf8'));
  const platformPhp = data?.platform?.php;
  if (typeof platformPhp === 'string' && platformPhp.trim() !== '') {
    process.stdout.write(platformPhp.trim());
    process.exit(0);
  }
  const overriddenPhp = data?.['platform-overrides']?.php;
  if (typeof overriddenPhp === 'string' && overriddenPhp.trim() !== '') {
    process.stdout.write(overriddenPhp.trim());
  }
} catch (_) {}
"
}

normalize_constraint_to_version() {
  local php_constraint
  php_constraint="$1"

  if [[ "$php_constraint" =~ ([0-9]+)\.([0-9]+) ]]; then
    local major
    local minor
    major="${BASH_REMATCH[1]}"
    minor="${BASH_REMATCH[2]}"
    echo "$((10#$major)).$((10#$minor))"
  fi
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
