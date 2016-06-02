#!/usr/bin/env python

import jmespath

from helpers.file import File
from helpers.config import Config


class Messages:
    messages = None

    @classmethod
    def _filter_entries(cls, path):
        entries = File.get_yml_file(path)

        for entry in entries:
            # if the last char of the string is a \n, strip it
            if entries[entry][-1:] == "\n":
                entries[entry] = entries[entry][:-1]

        return entries

    @classmethod
    def _get_messages(cls):
        if cls.messages is None:
            cls.messages = {}

            if Config.has("files.messages"):
                for entry in Config.get("files.messages"):
                    path = Config.get("files.messages." + entry)
                    key = entry[:-4]

                    if File.file_exists(path):
                        cls.messages[key] = cls._filter_entries(path)

        return cls.messages

    @classmethod
    def get(cls, query):
        return jmespath.search(query, cls._get_messages())

    @classmethod
    def has(cls, query):
        if jmespath.search(query, cls._get_messages()) is not None:
            return True

        return False

    @classmethod
    def get_error(cls, query):
        return jmespath.search("errors." + query, cls._get_messages())

    @classmethod
    def get_warning(cls, query):
        return jmespath.search("warnings." + query, cls._get_messages())

    @classmethod
    def get_all(cls):
        return cls._get_messages()
