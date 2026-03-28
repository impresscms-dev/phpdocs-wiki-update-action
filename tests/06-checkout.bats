#!/usr/bin/env bats

load "$BATS_TEST_DIRNAME/helpers.bash"

setup() {
  setup_test_tmp_dir
  setup_fake_bin_path

  export OLD_WIKI_CHECKOUT_PATH="$TEST_TMP_DIR/old-wiki"
  export ACTION_BIN_PATH="$TEST_TMP_DIR/action-bin"
  export GIT_CALLS_FILE="$TEST_TMP_DIR/git-calls.log"
  mkdir -p "$OLD_WIKI_CHECKOUT_PATH" "$ACTION_BIN_PATH"
  : > "$GIT_CALLS_FILE"

  cat > "$ACTION_BIN_PATH/get-mapped-branch.sh" <<'EOF'
#!/usr/bin/env bash
echo "wiki-main"
EOF
  chmod +x "$ACTION_BIN_PATH/get-mapped-branch.sh"

  cat > "$FAKE_BIN_DIR/git" <<'EOF'
#!/usr/bin/env bash
echo "$*" >> "$GIT_CALLS_FILE"
case "$1" in
  ls-remote)
    exit "${GIT_LS_REMOTE_EXIT_CODE:-1}"
    ;;
  show-ref)
    exit "${GIT_SHOW_REF_EXIT_CODE:-1}"
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

@test "checkout takes existing-branch path when remote or local checks fail" {
  export GIT_LS_REMOTE_EXIT_CODE="1"
  export GIT_SHOW_REF_EXIT_CODE="1"

  run bash "$BATS_TEST_DIRNAME/../bin/checkout.sh"
  [ "$status" -eq 0 ]
  [[ "$output" == *"Remote 'wiki-main' found."* ]]

  run grep -F "checkout wiki-main" "$GIT_CALLS_FILE"
  [ "$status" -eq 0 ]
}

@test "checkout creates and pushes branch when both checks succeed" {
  export GIT_LS_REMOTE_EXIT_CODE="0"
  export GIT_SHOW_REF_EXIT_CODE="0"

  run bash "$BATS_TEST_DIRNAME/../bin/checkout.sh"
  [ "$status" -eq 0 ]
  [[ "$output" == *"Remote 'wiki-main' not found. Creating."* ]]

  run grep -F "checkout -b wiki-main" "$GIT_CALLS_FILE"
  [ "$status" -eq 0 ]

  run grep -F "push --set-upstream origin wiki-main" "$GIT_CALLS_FILE"
  [ "$status" -eq 0 ]
}
