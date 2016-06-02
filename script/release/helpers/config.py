#!/usr/bin/env python

import jmespath


class Config:
    conf = {}

    @classmethod
    def get(cls, query):
        return jmespath.search(query, cls.conf)

    @classmethod
    def set(cls, query, value):
        prev = cls.conf
        parts = query.split(".")
        bound = len(parts) - 1
        i = 0

        for part in parts:
            if i != bound:
                if part not in prev:
                    prev[part] = {}

            # last part
            else:
                prev[part] = value

            prev = prev[part]
            i += 1

    @classmethod
    def has(cls, query):
        if jmespath.search(query, cls.conf) is not None:
            return True

        return False

    @classmethod
    def get_all(cls):
        return cls.conf
