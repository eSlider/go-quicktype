#!/usr/bin/env bash

if [[ $PUBLISH == true ]]; then
  echo 'HAS PUBLISH, exit'
  exit 0
fi

if [[ $CI && ! $WEB_BUILD ]]; then
	if [[ "$OSTYPE" == "darwin"* ]]; then
		grep -rl 'from "./\$fetch"' src | xargs sed -i '' -e 's|from "./$fetch"|from "./$fetch.ci"|g'
	else
		grep -rl 'from "./\$fetch"' src | xargs sed -i -e 's|from "./$fetch"|from "./$fetch.ci"|g'
	fi
fi
