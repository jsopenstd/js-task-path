#!/usr/bin/env python

from helpers.common import *


def prerequisites():
    print("prerequisites")

    subs = Arguments.get_sub_arguments()

    if "check" in subs:
        print("check prerequisites")


Arguments.add_case("prerequisites", prerequisites)
