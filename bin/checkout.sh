#!/usr/bin/env bash

PRIVATE_TOKEN="$1"

# shellcheck disable=SC2086
git clone -q https://$PRIVATE_TOKEN@github.com/$GITHUB_REPOSITORY.wiki.git "$OLD_WIKI_CHECKOUT_PATH"

# shellcheck disable=SC2164
pushd "$OLD_WIKI_CHECKOUT_PATH"

  if git show-ref -q --heads "$GITHUB_REF_NAME"; then
    git checkout --force "$GITHUB_REF_NAME";
  else
    git checkout -b "$GITHUB_REF_NAME";
  fi;

# shellcheck disable=SC2164
popd