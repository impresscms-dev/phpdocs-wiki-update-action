#!/usr/bin/env bats

load "$BATS_TEST_DIRNAME/helpers.bash"

setup() {
  setup_test_tmp_dir
  export OLD_WIKI_CHECKOUT_PATH="$TEST_TMP_DIR/old-wiki"
  export NEW_WIKI_CHECKOUT_PATH="$TEST_TMP_DIR/new-wiki"
  export TMP_BRANCH_MAP_FILE="$TEST_TMP_DIR/branches-map.yml"
  mkdir -p "$OLD_WIKI_CHECKOUT_PATH" "$NEW_WIKI_CHECKOUT_PATH"
  printf "main: master\n" > "$TMP_BRANCH_MAP_FILE"
}

teardown() {
  teardown_test_tmp_dir
}

@test "clear_tmp_data removes temp files and directories" {
  run bash "$BATS_TEST_DIRNAME/../bin/clear_tmp_data.sh"
  [ "$status" -eq 0 ]
  [ ! -e "$OLD_WIKI_CHECKOUT_PATH" ]
  [ ! -e "$NEW_WIKI_CHECKOUT_PATH" ]
  [ ! -e "$TMP_BRANCH_MAP_FILE" ]
}
