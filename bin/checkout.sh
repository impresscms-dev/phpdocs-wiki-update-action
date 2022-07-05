#!/usr/bin/env bash

# shellcheck disable=SC2164
pushd "$OLD_WIKI_CHECKOUT_PATH"

  git ls-remote -q --heads --exit-code origin "$GITHUB_REF_NAME" > /dev/null
  REMOTE_CHECK_EXIT_CODE=$?

  git show-ref -q --heads "$GITHUB_REF_NAME" > /dev/null
  LOCAL_CHECK_EXIT_CODE=$?

  if [ "$REMOTE_CHECK_EXIT_CODE" -gt 0 ] || [ "$LOCAL_CHECK_EXIT_CODE" -gt 0 ]; then
    echo "Remote '$GITHUB_REF_NAME' found."
    git checkout "$GITHUB_REF_NAME"
  else
    echo "Remote '$GITHUB_REF_NAME' not found. Creating."
    git checkout -b "$GITHUB_REF_NAME"
    git push --set-upstream origin "$GITHUB_REF_NAME"
  fi;

# shellcheck disable=SC2164
popd