setup_test_tmp_dir() {
  TEST_TMP_DIR="$(mktemp -d)"
}

teardown_test_tmp_dir() {
  rm -rf "$TEST_TMP_DIR"
}

setup_fake_bin_path() {
  FAKE_BIN_DIR="$TEST_TMP_DIR/fake-bin"
  mkdir -p "$FAKE_BIN_DIR"
  export PATH="$FAKE_BIN_DIR:$PATH"
}
