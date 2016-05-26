#!/usr/bin/env bash

# |---------------------------------------------------------------------------------------------------------------------
# |
# | Distribution Script
# |
# |     - In case of npm authentication error, use "npm login" before running this bash script.
# |
# |---------------------------------------------------------------------------------------------------------------------

function dist-project-init {
    dist-project
}

function dist-project {
    version=$(node -p -e "require('/vagrant/package.json').version")

    git tag -a "v$version" -m "v$version"
    git push --tags

    npm publish
}

case $1 in
    # run it via "npm run dist -- init"
    init)
        dist-project-init
        ;;

    # run it via "npm run dist"
    *)
        dist-project
        ;;
esac
