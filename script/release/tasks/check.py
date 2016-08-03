#!/usr/bin/env python
# -*- coding: utf-8 -*-

from helpers.common import *
from helpers.tunnels import *

__task_name__ = "check"


def check_prerequisites__():
    print("{}└─ check all prerequisites".format(" "))

    for case in Check.get_checkables():
        print('   └─ Check prerequisites for "{}":'.format(case))

        if not Check.check_prerequisite_of(case):
            print('     └─ Prerequisites of "{}" **not fulfilled**\n'.format(case))
        else:
            print('     └─ Prerequisites of "{}" fulfilled successfully\n'.format(case))


def check_case():
    print(" ■ task-{}\n".format(__task_name__))

    if Arguments.has_sub_arguments():
        subs = Arguments.get_sub_arguments()

    else:
        check_prerequisites__()


Arguments.add_case(__task_name__, check_case)
