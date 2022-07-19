#!/usr/bin/env bash

# shellcheck disable=SC2164
pushd "$OLD_WIKI_CHECKOUT_PATH"

  WIKI_BRANCH=$("$ACTION_BIN_PATH"/get-mapped-branch.sh)

  git ls-remote -q --heads --exit-code origin "$WIKI_BRANCH" > /dev/null
  REMOTE_CHECK_EXIT_CODE=$?

  git show-ref -q --heads "$WIKI_BRANCH" > /dev/null
  LOCAL_CHECK_EXIT_CODE=$?

  if [ "$REMOTE_CHECK_EXIT_CODE" -gt 0 ] || [ "$LOCAL_CHECK_EXIT_CODE" -gt 0 ]; then
    echo "Remote '$WIKI_BRANCH' found."
    git checkout "$WIKI_BRANCH"
  else
    echo "Remote '$WIKI_BRANCH' not found. Creating."
    git checkout -b "$WIKI_BRANCH"
    git push --set-upstream origin "$WIKI_BRANCH"
  fi;

# shellcheck disable=SC2164
popd