#!/usr/bin/env bash

COMMIT_MESSAGE="$1"
COMMITER_NAME="$2"
COMMITER_EMAIL="$3"

# shellcheck disable=SC2164
pushd "$NEW_WIKI_CHECKOUT_PATH"

  echo "Adding changes to GIT..."
  git add -A --verbose

  echo "Committing..."
  git commit -m "$COMMIT_MESSAGE"

  echo "Pulling and merging from remote..."
  git pull -s recursive -X ours || true

  echo "Pushing to remote..."
  git push || exit 1

# shellcheck disable=SC2164
popd
