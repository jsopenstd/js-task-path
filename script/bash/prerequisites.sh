#!/usr/bin/env bash

# |---------------------------------------------------------------------------------------------------------------------
# |
# | Prerequisite Handler Script (check/set)
# |
# |---------------------------------------------------------------------------------------------------------------------

function check-git-prerequisites {
    userName=$(git config --global user.name)
    userEmail=$(git config --global user.email)

    if [ -z $userName ] || [ -z $userEmail ]; then
        cat << EOF

Prerequisite error:
    no user.name/user.email was specified

    specify necessary git user data by:

        git config --global user.name "User Name"
        git config --global user.email my@email.com

EOF
    fi
}

function check-npm-prerequisites {
    exec 3>&2
    exec 2> /dev/null

    if ! npm whoami; then
        cat << EOF

Prerequisite error:
    no npm user was added

    add npm user by:

        npm adduser

EOF
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

