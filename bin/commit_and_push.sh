#!/usr/bin/env bash

COMMIT_MESSAGE="$1"

# shellcheck disable=SC2164
pushd "$NEW_WIKI_CHECKOUT_PATH"

  # idea from https://stackoverflow.com/a/10135446/1762839
  git ls-files --modified | grep '\.md$' | xargs git add
  git ls-files . --exclude-standard --others | grep '\.md$' | xargs git add
  git ls-files --deleted | grep '\.md$' | xargs git add

  git commit -m "$COMMIT_MESSAGE"

  git push --set-upstream origin "$GITHUB_REF_NAME"

# shellcheck disable=SC2164
popd