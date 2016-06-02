#!/usr/bin/env python

import jmespath

from helpers.common import *


class Env:

    content = None

    @classmethod
    def _get_package_yml_content(cls):
        if cls.content is None:
            path = Config.get("files.env_yml")

            if File.file_exists(path):
                cls.content = File.get_yml_file(path)
            else:
                cls.content = {}

        return cls.content

    @classmethod
    def get(cls, query):
        return jmespath.search(query, cls._get_package_yml_content())

    @classmethod
    def has(cls, query):
        result = jmespath.search(query, cls._get_package_yml_content())

        if result is not None:
            return True

        return False

    @classmethod
    def get_all(cls):
        return cls._get_package_yml_content()
