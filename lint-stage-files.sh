#!/usr/bin/env bash

files=$(git status -s | awk '{print $2}' | grep '\(config\|lib\|server\|src\|test\)/.*\.jsx\?$')

if [[ $files = "" ]] ; then
 exit 0
fi

failed=0
for file in ${files}; do
  prettier --write $file
  eslint --fix $file
  if [[ $? != 0 ]] ; then
    failed=1
  fi
done;

if [[ $failed != 0 ]] ; then
  echo "eslint check failed"
  exit $failed
fi
