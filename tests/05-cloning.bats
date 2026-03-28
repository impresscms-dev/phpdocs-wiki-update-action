#!/usr/bin/env bats

load "$BATS_TEST_DIRNAME/helpers.bash"

setup() {
  setup_test_tmp_dir
  setup_fake_bin_path

  export GITHUB_REPOSITORY="impresscms-dev/phpdocs-wiki-update-action"
  export OLD_WIKI_CHECKOUT_PATH="$TEST_TMP_DIR/old-wiki"
  export GIT_CLONE_URL_FILE="$TEST_TMP_DIR/clone-url.txt"

  cat > "$FAKE_BIN_DIR/git" <<'EOF'
#!/usr/bin/env bash
if [ "$1" = "clone" ]; then
  echo "$3" > "$GIT_CLONE_URL_FILE"
  if [ -z "$SKIP_CLONE_DIR_CREATE" ]; then
    mkdir -p "$4"
  fi
  exit 0
fi
exit 1
EOF
  chmod +x "$FAKE_BIN_DIR/git"
}

teardown() {
  teardown_test_tmp_dir
}

@test "cloning uses wiki clone URL and creates checkout folder" {
  run bash "$BATS_TEST_DIRNAME/../bin/cloning.sh" "my-token" "my-user"
  [ "$status" -eq 0 ]
  [ -d "$OLD_WIKI_CHECKOUT_PATH" ]

  run cat "$GIT_CLONE_URL_FILE"
  [ "$status" -eq 0 ]
  [ "$output" = "https://my-user:my-token@github.com/impresscms-dev/phpdocs-wiki-update-action.wiki.git" ]
}

@test "cloning fails when wiki directory was not created" {
  export SKIP_CLONE_DIR_CREATE="1"
  run bash "$BATS_TEST_DIRNAME/../bin/cloning.sh" "my-token" "my-user"
  [ "$status" -eq 1 ]
  [[ "$output" == *"ERROR: wiki directory not created."* ]]
}
