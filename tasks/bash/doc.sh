#!/usr/bin/env bash

# |---------------------------------------------------------------------------------------------------------------------
# |
# | Documentation Manager Script
# |
# |     - Before you make **any** changes, in order to understand the means, when using GitHub's repository wiki
# |       as a git submodule serving as the project's documentation in the project's /doc folder,
# |       **read thoroughly and understand the following article**:
# |       https://brendancleary.com/2013/03/08/including-a-github-wiki-in-a-repository-as-a-submodule/
# |
# |---------------------------------------------------------------------------------------------------------------------


function add-wiki-repo-as-submodule {

    # check **Setup – Clone submodule into existing repo** section on
    # https://brendancleary.com/2013/03/08/including-a-github-wiki-in-a-repository-as-a-submodule/

    # filter the wiki's repository url
    wiki=$(node -p -e '
        "use strict";

        let url = require("./package.json").repository.url

        url
            .replace(/^git:/g, "https:")
            .replace(/.git$/g, ".wiki.git")
    ')

    # make sure we are at the right path
    cd /vagrant

    # remove /doc, if it is present
    rm -rf doc

    # add the wiki's repository as a git submodule
    git submodule add $wiki doc

    # it is necessary to commit and then push the modified git repository
    # after a submodule was added to the project's repository
    git commit -m "Add the project's wiki repository as a git submodule into /doc"
    git push

    # with this way, pull the submodule's content for the first time
    git submodule init
    git submodule update
}

function pull-wiki-submodule-changes {

    # check **Update the docs Submodule** section on
    # https://brendancleary.com/2013/03/08/including-a-github-wiki-in-a-repository-as-a-submodule/

    cd /vagrant

    # pull and merge changes to the submodule in order to properly update the submodule's contents
    git pull
    git merge origin/master
    git submodule update
}

function commit+push-wiki-submodule {
    name=$(node -p -e "require('./package.json').name")

    # check **Make changes to the docs submodule** section on
    # https://brendancleary.com/2013/03/08/including-a-github-wiki-in-a-repository-as-a-submodule/

    cd /vagrant/doc

    git checkout master
    git commit -am "Update $name API documentation"
    git push
}

function commit+push-project {
    name=$(node -p -e "require('./package.json').name")

    # check **Make changes to the docs submodule** section on
    # https://brendancleary.com/2013/03/08/including-a-github-wiki-in-a-repository-as-a-submodule/

    cd /vagrant
    git commit -am "Update $name API documentation"
    git push
}

function wiki-submodule-status {
    cd /vagrant/doc
    git status
}

case $1 in
    # run it via "npm run doc -- init-submodule"
    init-submodule|init)
        add-wiki-repo-as-submodule
        ;;

    # run it via "npm run doc -- pull-submodule"
    pull-submodule|pull)
        pull-wiki-submodule-changes
        ;;

    # run it via "npm run doc -- push-submodule"
    push-submodule|push|update)
        commit+push-wiki-submodule
        ;;

    # run it via "npm run doc -- status-submodule"
    status-submodule|status)
        wiki-submodule-status
        ;;

    # run it via "npm run doc -- push-submodule-then-push-project"
    push-submodule-push-project)
        commit+push-wiki-submodule
        commit+push-project
        ;;

    # run it via "npm run doc"
    *)
        npm run gulp -- doc
        ;;
esac
