#!/usr/bin/env bash

# info: https://brendancleary.com/2013/03/08/including-a-github-wiki-in-a-repository-as-a-submodule/

# https://github.com/jsstd/js-task-paths.wiki.git
# git://github.com/jsstd/js-task-paths.git

function add-wiki-repo-as-submodule {
    wiki=$(node -p -e '
        "use strict";

        let url = require("./package.json").repository.url

        url
            .replace(/^git:/g, "https:")
            .replace(/.git$/g, ".wiki.git")
    ')

    # make sure we are ath the right path
    cd /vagrant

    # remove /doc, if it is present
    rm -rf doc

    git submodule add $wiki doc

    git commit -m "Add repository's wiki repo as a submodule in /doc"

    git push

    git submodule init

    git submodule update
}

function pull-wiki-submodul-changes {
    echo
}

function update-wiki-submodule {
    echo
}

function remove-wiki-submodule {
    cd /vagrant

    git rm doc

    rm -rf .git/modules/doc
}

case $1 in
    init)
        add-wiki-repo-as-submodule
        ;;

    pull)
        pull-wiki-submodul-changes
        ;;

    update)
        update-wiki-submodule
        ;;

    remove)
        remove-wiki-submodule
        ;;

    *)
        #npm run gulp -- doc
        ;;
esac
