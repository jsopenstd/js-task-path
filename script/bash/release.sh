#!/usr/bin/env bash

# |---------------------------------------------------------------------------------------------------------------------
# |
# | Release Script (publish/distribute)
# |
# |     - In case of npm authentication error, use "npm login" before running this bash script.
# |
# |---------------------------------------------------------------------------------------------------------------------

source /vagrant/script/bash/common.sh

echo-help() {
    cat << EOF

General flow of a release:

    - development
    - version bump (npm run bump -- <version-type>)
    - npm run build
    - npm run doc

    npm run prereq

	-- git global data needed

	npm run doc -- push

	-- actual commit --

	-- npm login needed

	npm run release -- init # -- init only the first time, omit otherwise

EOF
}

release-project-init() {
    release-project
}

release-project() {
    if npm run prereq; then

        npm run tag

        git push --tags

        npm publish
    fi
}

case $1 in
    # run it via "npm run release -- help"
    help|h)
        echo-help
        ;;

    # run it via "npm run release -- init"
    init)
        release-project-init
        ;;

    # run it via "npm run release"
    *)
        release-project
        ;;
esac
