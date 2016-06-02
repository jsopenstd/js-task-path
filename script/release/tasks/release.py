#!/usr/bin/env python

from helpers.common import *


def _release():
    # check prerequisites

    # bump version

    # build project
    # generate docs

    # push docs

    # commit project
    # tag project

    # git push --tags
    # npm publish

    pass


def publish():
    # git push --tags
    # npm publish
    pass


def release():
    print("release")

    subs = Arguments.get_sub_arguments()

    if "check" in subs:
        print("check prerequisites")

    elif "major" in subs:
        print("major")


Arguments.add_case("release", release)
