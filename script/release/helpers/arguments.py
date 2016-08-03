#!/usr/bin/env python

import sys
from messages import Messages


class Arguments:
    args = None
    cases = {}

    @classmethod
    def get_args(cls):
        if cls.args is None:
            cls.args = sys.argv[1:]

            if len(cls.args) > 0:
                # if a "--" (dash-dash) was passed before the actual arguments, strip it
                if cls.args[0] == "--":
                    cls.args = cls.args[1:]

            else:
                cls.args = []

        return cls.args

    @classmethod
    def has_arguments(cls):
        return cls.has_main_argument() or cls.has_sub_arguments()

    @classmethod
    def has_main_argument(cls):
        if len(cls.get_args()) > 0:
            return True

        return False

    @classmethod
    def has_sub_arguments(cls):
        if len(cls.get_sub_arguments()) > 0:
            return True

        return False

    @classmethod
    def get_main_argument(cls):
        return cls.get_args()[0]

    @classmethod
    def get_sub_arguments(cls):
        return cls.get_args()[1:]

    @classmethod
    def has_case(cls, case):
        return case in cls.cases

    @classmethod
    def add_case(cls, case, handler):
        if cls.has_case(case):
            raise KeyError(Messages.get_error("CASE_ALREADY_IN_ARGUMENT_CASES").format(case))

        cls.cases[case] = handler

    @classmethod
    def handle_case(cls, arg):
        cls.cases[arg]()

    @classmethod
    def print_available_cases(cls):
        for case in cls.cases:
            print("    -- {}".format(case))
