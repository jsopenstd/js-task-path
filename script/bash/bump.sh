#!/usr/bin/env bash

# |---------------------------------------------------------------------------------------------------------------------
# |
# | Bump Script
# |
# |     - **NOTE**: the default case, when calling this bump script via "npm run bump" is bump-patch
# |
# |---------------------------------------------------------------------------------------------------------------------

function bump-major {
    npm run gulp -- bump::major
}

function bump-minor {
    npm run gulp -- bump::minor
}

function bump-patch {
    npm run gulp -- bump::patch
}

case $1 in
    # run it via "npm run bump -- major"
    major)
        bump-major
        ;;

    # run it via "npm run bump -- minor"
    minor)
        bump-minor
        ;;

    # run it via "npm run bump -- patch"
    patch)
        bump-patch
        ;;

    # run it via "npm run bump"
    *)
        bump-patch
        ;;
esac
