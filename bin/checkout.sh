#!/usr/bin/env bash

PRIVATE_TOKEN="$1"
GITHUB_USER="$2"

# shellcheck disable=SC2086
git clone -q https://$GITHUB_USER:$PRIVATE_TOKEN@github.com/$GITHUB_REPOSITORY.wiki.git "$OLD_WIKI_CHECKOUT_PATH"

# shellcheck disable=SC2164
pushd "$OLD_WIKI_CHECKOUT_PATH"

  if git show-ref -q --heads "$GITHUB_REF_NAME"; then
    git checkout "$GITHUB_REF_NAME"
  else
    git checkout -b "$GITHUB_REF_NAME"
  fi;

  git branch --set-upstream-to=origin/$GITHUB_REF_NAME "$GITHUB_REF_NAME"

# shellcheck disable=SC2164
popd