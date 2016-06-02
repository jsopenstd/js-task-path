#!/usr/bin/env python

from helpers.common import *


def bump():
    print("bump")
    pass


def tag():
    print("tag")
    pass

Arguments.add_case("bump", bump)
Arguments.add_case("tag", tag)
