#!/usr/bin/env bash

# |---------------------------------------------------------------------------------------------------------------------
# |
# | Environment Data Handler Script
# |
# |     - put data into .env.yml
# |
# |---------------------------------------------------------------------------------------------------------------------

source /vagrant/script/bash/common.sh

exists() {
    if [ "$1" == "undefined" ]; then
        echo false
    else
        echo true
    fi
}

env-file-exists() {
    if [ -f /vagrant/.env.yml ]; then
        echo true
    else
        echo false
    fi
}

has-git-data() {
    if $(exists $(get-value $(npm run query -- get .env git))); then
        echo true
    else
        echo false
    fi
}

has-npm-data() {
    if $(exists $(get-value $(npm run query -- get .env npm))); then
        echo true
    else
        echo false
    fi
}

add-git-env-data() {
    name=$(get-value $(npm run query -- get .env git.name))
    email=$(get-value $(npm run query -- get .env git.email))

    if $(exists $(get-value $name)); then
        git config --global user.name "$name"
    fi

    if $(exists $(get-value $email)); then
        git config --global user.email "$email"
    fi
}

add-npm-env-data() {
    name=$(get-value $(npm run query -- get .env npm.name))
    email=$(get-value $(npm run query -- get .env npm.email))

    echo "NPM needs a password too in order to add a user"
    printf "password: "
    read -s pw

    export NPM_USERNAME=$name
    export NPM_PASSWORD=$pw
    export NPM_EMAIL=$email

    npm adduser <<!
$NPM_USERNAME
$NPM_PASSWORD
$NPM_EMAIL
!
}

case $1 in
    init)
        if $(env-file-exists); then

            if ! $(has-git-data); then
                add-git-env-data
            fi

            if ! $(has-npm-data); then
                add-npm-env-data
            fi
        fi
        ;;
esac
