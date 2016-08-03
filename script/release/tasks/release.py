#!/usr/bin/env python
# -*- coding: utf-8 -*-

from helpers.common import *

from tasks import check

__task_name__ = "release"


def _release():
    # check prerequisites

    print("check prerequisites")
    print(Check.get_checkables())
    print(Check.check_prerequisites())

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


def release_case():
    print(" ■ task-{}\n |".format(__task_name__))

    if Arguments.has_sub_arguments():
        subs = Arguments.get_sub_arguments()

        if amongst_of(["major", "minor", "patch"], subs):
            print("bump")

    Arguments.handle_case("check")

Arguments.add_case(__task_name__, release_case)
