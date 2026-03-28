#!/usr/bin/env bats

load "$BATS_TEST_DIRNAME/helpers.bash"

setup() {
  setup_test_tmp_dir
  export RESOLVER_SCRIPT="$BATS_TEST_DIRNAME/../bin/resolve-php-version.sh"
}

teardown() {
  teardown_test_tmp_dir
}

@test "resolve-php-version uses engine defaults when composer files are missing" {
  run bash -c "cd \"$TEST_TMP_DIR\" && bash \"$RESOLVER_SCRIPT\" \"clean/phpdoc-md\""
  [ "$status" -eq 0 ]
  [ "$output" = "8.1" ]

  run bash -c "cd \"$TEST_TMP_DIR\" && bash \"$RESOLVER_SCRIPT\" \"evert/phpdoc-md\""
  [ "$status" -eq 0 ]
  [ "$output" = "7.4" ]
}

@test "resolve-php-version reads composer.json require.php first" {
  cat > "$TEST_TMP_DIR/composer.json" <<'EOF'
{
  "require": {
    "php": "^8.3 || ^8.4"
  }
}
EOF

  run bash -c "cd \"$TEST_TMP_DIR\" && bash \"$RESOLVER_SCRIPT\" \"clean/phpdoc-md\""
  [ "$status" -eq 0 ]
  [ "$output" = "8.3" ]
}

@test "resolve-php-version reads composer.lock when composer.json has no php requirement" {
  cat > "$TEST_TMP_DIR/composer.json" <<'EOF'
{
  "require": {
    "monolog/monolog": "^3.0"
  }
}
EOF

  cat > "$TEST_TMP_DIR/composer.lock" <<'EOF'
{
  "platform": {
    "php": ">=8.2"
  }
}
EOF

  run bash -c "cd \"$TEST_TMP_DIR\" && bash \"$RESOLVER_SCRIPT\" \"clean/phpdoc-md\""
  [ "$status" -eq 0 ]
  [ "$output" = "8.2" ]
}

@test "resolve-php-version fails for unknown engine" {
  run bash -c "cd \"$TEST_TMP_DIR\" && bash \"$RESOLVER_SCRIPT\" \"unknown/engine\""
  [ "$status" -eq 1 ]
  [[ "$output" == *"ERROR: unknown engine"* ]]
}
