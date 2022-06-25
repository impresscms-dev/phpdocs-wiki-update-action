#!/usr/bin/env bash

COMMIT_MESSAGE="$1"
COMMITER_NAME="$2"
COMMITER_EMAIL="$3"

# shellcheck disable=SC2164
pushd "$NEW_WIKI_CHECKOUT_PATH"

  git config user.email "$COMMITER_EMAIL" || exit 1
  git config user.name "$COMMITER_NAME" || exit 2
  git config advice.addEmptyPathspec false

  git pull

  # idea from https://stackoverflow.com/a/10135446/1762839
  git ls-files --modified | grep '\.md$' | xargs git add
  git ls-files . --exclude-standard --others | grep '\.md$' | xargs git add
  git ls-files --deleted | grep '\.md$' | xargs git add

  git commit -m "$COMMIT_MESSAGE"

  git push --force --set-upstream origin "$GITHUB_REF_NAME" || exit 3

# shellcheck disable=SC2164
popd