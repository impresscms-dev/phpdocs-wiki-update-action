#!/usr/bin/env bats

load "$BATS_TEST_DIRNAME/helpers.bash"

setup() {
  setup_test_tmp_dir
  export OLD_WIKI_CHECKOUT_PATH="$TEST_TMP_DIR/old-wiki"
  mkdir -p "$OLD_WIKI_CHECKOUT_PATH"
  git init "$OLD_WIKI_CHECKOUT_PATH" > /dev/null
}

teardown() {
  teardown_test_tmp_dir
}

@test "configure_git sets git identity and defaults" {
  run bash "$BATS_TEST_DIRNAME/../bin/configure_git.sh" "impressbot" "bot@example.com"
  [ "$status" -eq 0 ]

  run git -C "$OLD_WIKI_CHECKOUT_PATH" config user.name
  [ "$status" -eq 0 ]
  [ "$output" = "impressbot" ]

  run git -C "$OLD_WIKI_CHECKOUT_PATH" config user.email
  [ "$status" -eq 0 ]
  [ "$output" = "bot@example.com" ]
}

@test "configure_git fails when wiki_github_update_user is empty" {
  run bash "$BATS_TEST_DIRNAME/../bin/configure_git.sh" "" "bot@example.com"
  [ "$status" -eq 3 ]
  [[ "$output" == *"ERROR: 'wiki_github_update_user' not set"* ]]
}
