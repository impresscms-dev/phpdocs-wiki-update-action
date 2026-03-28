#!/usr/bin/env bats

load "$BATS_TEST_DIRNAME/helpers.bash"

setup() {
  setup_test_tmp_dir
  setup_fake_bin_path

  export NEW_WIKI_CHECKOUT_PATH="$TEST_TMP_DIR/new-wiki"
  export GIT_CALLS_FILE="$TEST_TMP_DIR/git-calls.log"
  mkdir -p "$NEW_WIKI_CHECKOUT_PATH"
  : > "$GIT_CALLS_FILE"

  cat > "$FAKE_BIN_DIR/git" <<'EOF'
#!/usr/bin/env bash
echo "$*" >> "$GIT_CALLS_FILE"
case "$1" in
  pull)
    exit "${GIT_PULL_EXIT_CODE:-0}"
    ;;
  push)
    exit "${GIT_PUSH_EXIT_CODE:-0}"
    ;;
  *)
    exit 0
    ;;
esac
EOF
  chmod +x "$FAKE_BIN_DIR/git"
}

teardown() {
  teardown_test_tmp_dir
}

@test "commit_and_push continues when pull fails and still pushes" {
  export GIT_PULL_EXIT_CODE="1"

  run bash "$BATS_TEST_DIRNAME/../bin/commit_and_push.sh" "Update wiki docs"
  [ "$status" -eq 0 ]

  run grep -F "pull -s recursive -X ours" "$GIT_CALLS_FILE"
  [ "$status" -eq 0 ]

  run grep -F "push" "$GIT_CALLS_FILE"
  [ "$status" -eq 0 ]
}

@test "commit_and_push fails when push fails" {
  export GIT_PUSH_EXIT_CODE="1"

  run bash "$BATS_TEST_DIRNAME/../bin/commit_and_push.sh" "Update wiki docs"
  [ "$status" -eq 1 ]
}
