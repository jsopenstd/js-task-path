#!/usr/bin/env python
# -*- coding: utf-8 -*-

from time import strftime

_IND_START = 1
_IND_END = 3

# ┐ └ ├ ─ │

class Task:
    tasks = {}

    @classmethod
    def _get_time(cls):
        return strftime("%H:%M:%S")

    @classmethod
    def add_task(cls, task):
        cls.tasks[task.get_name()] = task

    @classmethod
    def get_task(cls, task_name):
        return cls.tasks[task_name]

    @classmethod
    def get_tasks(cls):
        return cls.tasks

    @classmethod
    def has_tasks(cls):
        if cls.get_tasks():
            return True

        return False

    def _get_level(self):
        return self._level

    def _get_indentation_string(self, **kwargs):
        ind_type = kwargs.get("ind_type", _IND_START)
        ind = "    " * self._level

        if len(ind) > 0:
            if ind_type == _IND_START:
                ind = ind[:-2] + "┌─"

            elif ind_type == _IND_END:
                ind = ind[:-2] + "└─"

        return ind

    def _increase_level(self, prev_level):
        self._level = prev_level + 1

    def _decrease_level(self, prev_level):
        self._level = prev_level - 1

        if self._level < 0:
            self._level = 0

    def _run(self, task):
        print("{indentation}[{time}] Starting '{name}'...".format(indentation=self._get_indentation_string(),
                                                                  time=Task._get_time(),
                                                                  name=self.get_name()))

        if self.has_deps():
            for dep in self.get_deps():
                task = Task.get_task(dep)
                task._increase_level(self._level)
                task._run(task)
                task._decrease_level(self._level)

        self._handler(task)

        print("{indentation}[{time}] Finished '{name}'...".format(indentation=self._get_indentation_string(ind_type=_IND_END),
                                                                  time=Task._get_time(),
                                                                  name=self.get_name()))

    def __init__(self, name, **kwargs):
        self._name = name
        self._deps = kwargs.get("deps", None)
        self._handler = kwargs.get("handler", None)
        self._level = 0

        if kwargs.get("add_task", True):
            Task.add_task(self)

    def run(self):
        self._run(self)

    def get_name(self):
        return self._name

    def get_deps(self):
        return self._deps

    def has_deps(self):
        if self._deps is not None:
            return True

        return False

    def echo(self, msg):
        level = self._get_level()
        ind = "  "

        while level > 0:
            ind += "    "
            level -= 1

        print(ind + msg)


def t_default(task):
    #print("default")
    task.echo("default")


def t_a(task):
    #print("a")
    task.echo("a")


def t_b(task):
    #print("b")
    task.echo("b")


def t_c(task):
    #print("C")
    task.echo("C")


def t_d(task):
    #print("D")
    task.echo("D")

task_c = Task("C", handler=t_c)
task_d = Task("D", handler=t_d)

task_a = Task("a", handler=t_a)
task_b = Task("b", deps=["C", "D"], handler=t_b)

task_default = Task("default", deps=["a", "b"], handler=t_default)

print(Task.get_tasks())
print("")

task_default.run()
