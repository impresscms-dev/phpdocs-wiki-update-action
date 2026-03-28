#!/usr/bin/env bats

load "$BATS_TEST_DIRNAME/helpers.bash"

setup() {
  setup_test_tmp_dir
  export NEW_WIKI_CHECKOUT_PATH="$TEST_TMP_DIR/new-wiki"
  mkdir -p "$NEW_WIKI_CHECKOUT_PATH"
}

teardown() {
  teardown_test_tmp_dir
}

@test "rename_index renames README.md for clean engine" {
  touch "$NEW_WIKI_CHECKOUT_PATH/README.md"

  run bash "$BATS_TEST_DIRNAME/../bin/rename_index.sh" "clean/phpdoc-md"
  [ "$status" -eq 0 ]
  [ -f "$NEW_WIKI_CHECKOUT_PATH/Home.md" ]
  [ ! -f "$NEW_WIKI_CHECKOUT_PATH/README.md" ]
}

@test "rename_index renames ApiIndex.md for evert engine" {
  touch "$NEW_WIKI_CHECKOUT_PATH/ApiIndex.md"

  run bash "$BATS_TEST_DIRNAME/../bin/rename_index.sh" "evert/phpdoc-md"
  [ "$status" -eq 0 ]
  [ -f "$NEW_WIKI_CHECKOUT_PATH/Home.md" ]
  [ ! -f "$NEW_WIKI_CHECKOUT_PATH/ApiIndex.md" ]
}
