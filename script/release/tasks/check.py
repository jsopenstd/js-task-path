#!/usr/bin/env python
# -*- coding: utf-8 -*-

from helpers.common import *
from helpers.tunnels import *


def check():
    print(" ■ task-{}\n".format("check"))

    if Arguments.has_sub_arguments():
        subs = Arguments.get_sub_arguments()

    else:
        print("{}└─ check all prerequisites".format(" "))

        for case in Check.get_checkables():
            print('   └─ Check prerequisites for "{}":'.format(case))

            if not Check.check_prerequisite_of(case):
                print('     └─ Prerequisites of "{}" **not fulfilled**\n'.format(case))
            else:
                print('     └─ Prerequisites of "{}" fulfilled successfully\n'.format(case))


Arguments.add_case("check", check)
