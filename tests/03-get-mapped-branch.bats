#!/usr/bin/env bats

load "$BATS_TEST_DIRNAME/helpers.bash"

setup() {
  setup_test_tmp_dir
  setup_fake_bin_path

  export TMP_BRANCH_MAP_FILE="$TEST_TMP_DIR/branches.yml"
  export GITHUB_REF_NAME="main"
  printf "main: wiki-main\n" > "$TMP_BRANCH_MAP_FILE"

  cat > "$FAKE_BIN_DIR/yq" <<'EOF'
#!/usr/bin/env bash
if [ -n "$YQ_OUTPUT_OVERRIDE" ]; then
  echo "$YQ_OUTPUT_OVERRIDE"
else
  echo "wiki-main"
fi
EOF
  chmod +x "$FAKE_BIN_DIR/yq"
}

teardown() {
  teardown_test_tmp_dir
}

@test "get-mapped-branch returns mapped branch when mapping exists" {
  run bash "$BATS_TEST_DIRNAME/../bin/get-mapped-branch.sh"
  [ "$status" -eq 0 ]
  [ "$output" = "wiki-main" ]
}

@test "get-mapped-branch falls back to GITHUB_REF_NAME when map is null" {
  export YQ_OUTPUT_OVERRIDE="null"
  run bash "$BATS_TEST_DIRNAME/../bin/get-mapped-branch.sh"
  [ "$status" -eq 0 ]
  [ "$output" = "main" ]
}
