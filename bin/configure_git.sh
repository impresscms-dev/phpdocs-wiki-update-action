COMMITER_NAME="$1"
COMMITER_EMAIL="$2"

# shellcheck disable=SC2164
pushd "$OLD_WIKI_CHECKOUT_PATH"

  if [ "$COMMITER_NAME" == "" ]; then
    echo "ERROR: 'wiki_github_update_user' not set"
    exit 3
  fi;

  git config user.email "$COMMITER_EMAIL" || exit 1
  git config user.name "$COMMITER_NAME" || exit 2
  git config advice.addEmptyPathspec false
  git config pull.rebase false
  git config advice.skippedCherryPicks false
  git config advice.setUpstreamFailure false

# shellcheck disable=SC2164
popd