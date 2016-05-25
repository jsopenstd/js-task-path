#!/usr/bin/env bash

# =====================================================================================================================
#
# in case you are start using this script from vagrant for the first time
# use "npm login" to prevent npm authentication error
#
# =====================================================================================================================

version=$(node -p -e "require('./package.json').version")

# for initial distribution, run it via "npm run distribute -- initial"
if [ "$1" == "initial" ]; then
    name=$(node -p -e "require('./package.json').name")
    repo=$(node -p -e "require('./package.json').repository.url")

    git tag -a "v$version" -m "v$version"
    git push --tags
    npm publish
    bower register "$name" "$repo"

else
    git tag -a "v$version" -m "v$version"
    git push --tags
    npm publish
fi
