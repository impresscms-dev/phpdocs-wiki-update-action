#!/usr/bin/env bash

PRIVATE_TOKEN="$1"
GITHUB_USER="$2"

# shellcheck disable=SC2086
git clone -q https://$GITHUB_USER:$PRIVATE_TOKEN@github.com/$GITHUB_REPOSITORY.wiki.git "$OLD_WIKI_CHECKOUT_PATH"

if [ ! -d "$OLD_WIKI_CHECKOUT_PATH" ]; then
  echo "ERROR: wiki directory not created. Perhaps You didn't created at least one web page?"
  exit 1
fi