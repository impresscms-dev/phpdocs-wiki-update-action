#!/usr/bin/env bash

ENGINE="$1"

if [ "$ENGINE" == "evert/phpdoc-md" ]; then
  echo "7.4"
else
  echo "8.1"
fi;