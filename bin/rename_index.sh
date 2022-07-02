#!/usr/bin/env bash

ENGINE="$1"

# shellcheck disable=SC2164
pushd "$NEW_WIKI_CHECKOUT_PATH"

  if [ "$ENGINE" == "evert/phpdoc-md" ]; then
    mv ApiIndex.md Home.md
  elif [ "$ENGINE" == "clean/phpdoc-md" ]; then
    mv README.md Home.md
  fi

# shellcheck disable=SC2164
popd