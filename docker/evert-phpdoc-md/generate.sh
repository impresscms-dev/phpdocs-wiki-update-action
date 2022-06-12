#!/usr/bin/env bash

COMPOSER_BIN_PATH=$(composer global config bin-dir --absolute)
PATH=${COMPOSER_BIN_PATH}:${PATH}

rm -rf /tmp/docs
mkdir -p /tmp/docs || true
phpdoc  -d /data -t /tmp/docs/ --template="xml" -v --no-interaction --ansi --extensions=php "$PHPDOC_EXTRA_ARGS"
phpdocmd /tmp/docs/structure.xml /result "$PHPDOCMD_EXTRA_ARGS"
