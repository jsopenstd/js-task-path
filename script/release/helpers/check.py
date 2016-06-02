#!/usr/bin/env python

from messages import Messages


class Check:

    checkables = {}

    @classmethod
    def add_checkable(cls, checkable, method):
        if checkable in cls.checkables:
            raise KeyError(Messages.get_error("CHECKABLE_ALREADY_IN_CHECKABLES").format(checkable))

        cls.checkables[checkable] = method

    @classmethod
    def get_checkables(cls):
        return cls.checkables

    @classmethod
    def check_prerequisite_of(cls, case):
        if case in cls.checkables:
            return cls.checkables[case]("check")

        return False

    @classmethod
    def check_prerequisites(cls):
        for case in cls.get_checkables():
            if cls.check_prerequisite_of(case) is False:
                return False

        return True
