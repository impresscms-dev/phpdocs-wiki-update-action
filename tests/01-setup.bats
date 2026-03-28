#!/usr/bin/env bats

load "$BATS_TEST_DIRNAME/helpers.bash"

setup() {
  setup_test_tmp_dir
  export RUNNER_TEMP="$TEST_TMP_DIR/runner-temp"
  export GITHUB_SHA="abcd1234"
  export GITHUB_RUN_ID="99"
  export GITHUB_RUN_ATTEMPT="3"
  export GITHUB_ACTION_PATH="$BATS_TEST_DIRNAME/.."
  export TEST_WORK_DIR="$TEST_TMP_DIR/workspace"
  export GITHUB_ENV="$TEST_TMP_DIR/github.env"
  mkdir -p "$RUNNER_TEMP" "$TEST_WORK_DIR"
  : > "$GITHUB_ENV"
}

teardown() {
  teardown_test_tmp_dir
}

@test "setup exports variables and falls back to engine php version" {
  run bash -c "cd \"$TEST_WORK_DIR\" && bash \"$BATS_TEST_DIRNAME/../bin/setup.sh\" \"clean/phpdoc-md\""
  [ "$status" -eq 0 ]

  run grep -F "NEEDED_PHP_VERSION=8.1" "$GITHUB_ENV"
  [ "$status" -eq 0 ]

  NEW_WIKI_PATH=$(grep '^NEW_WIKI_CHECKOUT_PATH=' "$GITHUB_ENV" | cut -d'=' -f2-)
  [ -d "$NEW_WIKI_PATH" ]
}

@test "setup uses composer.json php constraint when present" {
  cat > "$TEST_WORK_DIR/composer.json" <<'EOF'
{
  "require": {
    "php": "^8.2"
  }
}
EOF

  run bash -c "cd \"$TEST_WORK_DIR\" && bash \"$BATS_TEST_DIRNAME/../bin/setup.sh\" \"clean/phpdoc-md\""
  [ "$status" -eq 0 ]

  run grep -F "NEEDED_PHP_VERSION=8.2" "$GITHUB_ENV"
  [ "$status" -eq 0 ]
}

@test "setup fails on unknown engine" {
  run bash -c "cd \"$TEST_WORK_DIR\" && bash \"$BATS_TEST_DIRNAME/../bin/setup.sh\" \"unknown/engine\""
  [ "$status" -eq 1 ]
  [[ "$output" == *"ERROR: unknown engine"* ]]
}
