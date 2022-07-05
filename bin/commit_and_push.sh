#!/usr/bin/env bash

COMMIT_MESSAGE="$1"
COMMITER_NAME="$2"
COMMITER_EMAIL="$3"

# shellcheck disable=SC2164
pushd "$NEW_WIKI_CHECKOUT_PATH"

  echo "Configuring GIT..."
  git config user.email "$COMMITER_EMAIL" || exit 1
  git config user.name "$COMMITER_NAME" || exit 2
  git config advice.addEmptyPathspec false
  git config pull.rebase false
  git config advice.skippedCherryPicks false
  git config advice.setUpstreamFailure false

  # idea from https://stackoverflow.com/a/10135446/1762839
  echo "Adding changes to GIT..."
  git ls-files --modified | grep '\.md$' | xargs git add
  git ls-files . --exclude-standard --others | grep '\.md$' | xargs git add
  git ls-files --deleted | grep '\.md$' | xargs git add

  echo "Commiting..."
  git commit -m "$COMMIT_MESSAGE"

  echo "Pulling and merging from remote..."
  git branch --set-upstream-to=origin/$GITHUB_REF_NAME "$GITHUB_REF_NAME" || true
  git pull -s recursive -X ours || true

  echo "Pushing to remote..."
  git push --set-upstream origin "$GITHUB_REF_NAME" || exit 3

# shellcheck disable=SC2164
popd
