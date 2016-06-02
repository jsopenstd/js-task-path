#!/usr/bin/env python

import os
import json
import yaml


class File:

    @classmethod
    def file_exists(cls, path):
        return os.path.isfile(path)

    @classmethod
    def get_file_contents(cls, path):
        with open(path, "r") as file:
            data = file.read()

        return data

    @classmethod
    def get_json_file(cls, path):
        return json.loads(cls.get_file_contents(path))

    @classmethod
    def get_yml_file(cls, path):
        return yaml.load(cls.get_file_contents(path))
