#!/usr/bin/env bash

# |---------------------------------------------------------------------------------------------------------------------
# |
# | Distribution Script
# |
# |     - In case of npm authentication error, use "npm login" before running this bash script.
# |
# |---------------------------------------------------------------------------------------------------------------------

function distribute-project-initial {
    distribute-project
}

function distribute-doc-initial {
    cd /vagrant/doc

    # git config --global user.name "<Your Name>"
    # git config --global user.email "<your@email.com>"

    git pull

    git add .
    git status
    git commit -m "Initial /doc distribution commit"

    git push

    distribute-doc
}

function distribute-project {
    version=$(node -p -e "require('./package.json').version")

    git tag -a "v$version" -m "v$version"
    git push --tags

    npm publish
}

function distribute-doc {
    name=$(node -p -e "require('./package.json').name")

    cd /vagrant/doc

    git pull

    git add .
    git status
    git commit -m "Update $name API documentation"

    git push
}

case $1 in
    # |-----------------------------------------------------------------------------------------------------------------
    # |
    # | Initial distribution cases
    # |
    # |-----------------------------------------------------------------------------------------------------------------

    # run it via "npm run distribute -- project-initial"
    project-initial)
        distribute-project-initial
        ;;

    # run it via "npm run distribute -- doc-initial"
    doc-initial)
        distribute-doc-initial
        ;;

    # |-----------------------------------------------------------------------------------------------------------------
    # |
    # | General distribution cases
    # |
    # |-----------------------------------------------------------------------------------------------------------------

    # run it via "npm run distribute -- project"
    project)
        distribute-project
        ;;

    # run it via "npm run distribute -- doc"
    doc)
        distribute-doc
        ;;

    *)
        echo "Unknown distribution case"
        ;;
esac
