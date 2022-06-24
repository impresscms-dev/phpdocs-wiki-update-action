#!/usr/bin/env bash

rm -rf "$OLD_WIKI_CHECKOUT_PATH" || true
rm -rf "$NEW_WIKI_CHECKOUT_PATH" || true

mkdir -p "$NEW_WIKI_CHECKOUT_PATH"