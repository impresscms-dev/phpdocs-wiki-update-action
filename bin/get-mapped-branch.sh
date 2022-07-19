#!/usr/bin/env bash

# shellcheck disable=SC2002
MAPPED_BRANCH=$(cat "$TMP_BRANCH_MAP_FILE" | yq ".\"$GITHUB_REF_NAME\"")
if [ "$MAPPED_BRANCH" == "null" ]; then
  echo "$GITHUB_REF_NAME"
else
  echo "$MAPPED_BRANCH"
fi