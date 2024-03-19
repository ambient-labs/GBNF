#!/usr/bin/env bash
#
# Copyright 2009-2023 Joshua Bronson. All rights reserved.
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# shellcheck disable=SC2086


set -euo pipefail

log() {
  >&2 printf "> %s\n" "$@"
}


main() {
  local -r gitbranch=$(git branch --show-current)
  # if [ "$gitbranch" = "deps" ] || [ "$gitbranch" = "dev" ]; then
  #   log "Already on branch '$gitbranch'"
  # elif [ "$gitbranch" = "main" ]; then
  #   git checkout -b deps main
  # else
  #   log "On unsupported branch '$gitbranch'. Switch to 'main' and try again."
  #   exit 1
  # fi


  log "Upgrading PyPI dependencies..."
  local -r dev_py="python3.12"  # Main version used for development
  # local -r pip_compile="pip-compile --generate-hashes --reuse-hashes --upgrade --allow-unsafe"
  local -r pip_compile="pip-compile --upgrade --allow-unsafe"
  for py in python3.12 python3.11; do
    local manage_deps_env=".venv/deps/$py"
    [ -e "$manage_deps_env" ] || $py -m venv "$manage_deps_env"
    "$manage_deps_env/bin/pip" install --upgrade pip
    "$manage_deps_env/bin/pip" install --upgrade pip-tools
    mkdir -pv "dev-deps/$py"
    $manage_deps_env/bin/$pip_compile dev-deps/test.in -o "dev-deps/$py/test.txt" >/dev/null
    # Compile remaining layers just for our dev interpreter (3.11):
    if [ "$py" = "$dev_py" ]; then
      for i in build lint dev; do
        $manage_deps_env/bin/$pip_compile "dev-deps/$i.in" -o "dev-deps/$py/$i.txt"
      done
    fi
  done
  .venv/dev/bin/pip install --upgrade pip-tools
  .venv/dev/bin/pip-sync dev-deps/$dev_py/{build,lint,test,dev}.txt
  .venv/dev/bin/pip install -e .
  log "Upgrading PyPI dependencies: Done"

  log "Upgrading pre-commit hooks..."
  .venv/dev/bin/pre-commit autoupdate
  log "Upgrading pre-commit hooks: Testing..."
  git add .
  .venv/dev/bin/pre-commit run --all-files

  log "Done."
}

main
