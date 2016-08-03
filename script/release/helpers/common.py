#!/usr/bin/env python

from arguments import Arguments
from config import Config
from file import File
from messages import Messages
from package import Package
from env import Env
from check import Check


def amongst_of(list_to_pick_from, list_to_compare_against):
    for compare in list_to_compare_against:
        for pick in list_to_pick_from:
            if compare == pick:
                return True

    return False
