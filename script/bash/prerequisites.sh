#!/usr/bin/env bash

# |---------------------------------------------------------------------------------------------------------------------
# |
# | Prerequisite Handler Script (check/set)
# |
# |---------------------------------------------------------------------------------------------------------------------

source /vagrant/script/bash/common.sh

check-git-prerequisites() {
    userName=$(git config --global user.name)
    userEmail=$(git config --global user.email)

    if [ -z $userName ] || [ -z $userEmail ]; then
        cat << EOF

Prerequisite error:
    no default account identity.
    no user.name/user.email was specified

    specify necessary global git user data by:

        git config --global user.name "User Name"
        git config --global user.email my@email.com

    or omit --global to set the identity only in this repository:

        git config user.name "User Name"
        git config user.email my@email.com

EOF

    exit 1
    fi
}

check-npm-prerequisites() {
    exec 3>&2
    exec 2> /dev/null

    if ! npm whoami; then
        cat << EOF

Prerequisite error:
    no npm user was added

    add npm user by:

        npm adduser

EOF
    exit 1
    fi

    exec 2>&3
}

case $1 in
    # run it via "npm run prereq -- git"
    check-git|git)
        check-git-prerequisites
        ;;

    # run it via "npm run prereq -- npm"
    check-npm|npm)
        check-npm-prerequisites
        ;;

    # run it via "npm run prereq"
    *)
        check-git-prerequisites
        check-npm-prerequisites
        ;;
esac

exit 0
