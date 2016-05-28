#!/usr/bin/env bash

# |---------------------------------------------------------------------------------------------------------------------
# |
# | Bump Script (also handles tag, when needed)
# |
# |     - In order to tag the previous commit during development (e.g.: multiple, consequent patches and fixes)
# |       without the actual release of the project, use the "tag" feature of this script
# |
# |---------------------------------------------------------------------------------------------------------------------

source /vagrant/script/bash/common.sh

bump-major() {
    npm run gulp -- bump::major
}

bump-minor() {
    npm run gulp -- bump::minor
}

bump-patch() {
    npm run gulp -- bump::patch
}

tag-project() {
    version=$(get-value $(npm run query -- get package version))

    if npm run prereq -- git; then

        git tag -a "v$version" -m "v$version"
    fi
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

    # run it via "npm run bump -- tag"
    tag)
        tag-project
        ;;
esac
