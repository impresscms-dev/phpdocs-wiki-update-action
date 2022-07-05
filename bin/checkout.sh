#!/usr/bin/env bash

PRIVATE_TOKEN="$1"
GITHUB_USER="$2"

# shellcheck disable=SC2086
git clone -q https://$GITHUB_USER:$PRIVATE_TOKEN@github.com/$GITHUB_REPOSITORY.wiki.git "$OLD_WIKI_CHECKOUT_PATH"

if [ ! -d "$OLD_WIKI_CHECKOUT_PATH" ]; then
  echo "ERROR: wiki directory not created. Perhaps You didn't created at least one web page?"
  exit 1
fi

# shellcheck disable=SC2164
pushd "$OLD_WIKI_CHECKOUT_PATH"

  git config advice.setUpstreamFailure false

  if git show-ref -q --heads "$GITHUB_REF_NAME"; then
    echo "Remote $GITHUB_REF_NAME found."
    git checkout "$GITHUB_REF_NAME"
  else
    echo "Remote $GITHUB_REF_NAME not found. Creating."
    git checkout -b "$GITHUB_REF_NAME"
    git branch --set-upstream-to=origin/$GITHUB_REF_NAME "$GITHUB_REF_NAME"
  fi;

# shellcheck disable=SC2164
popd