#!/usr/bin/env python

import getpass

from config import Config
from run import Run
from env import Env


def npm(command=None, **kwargs):
    cwd = kwargs.get("cwd", Config.get("working_directory"))

    kwargs.update(cwd=cwd)

    if command == "check":
        observant = Run.observe("npm whoami")

        if observant.stderr is None:
            return True

        return False

    elif command == "adduser":
        path = Config.get("files.helpers.npm_adduser_sh")
        username = Env.get("npm.username")
        email = Env.get("npm.email")
        password = None

        if username is None:
            username = raw_input("Username: ")

        if email is None:
            email = raw_input("Email: ")

        if password is None:
            password = getpass.getpass("Password: ")

        return Run.call("{} {} {} {}".format(path, username, password, email))

    elif command == "whoami":
        return Run.call("npm whoami")

    elif command == "logout":
        return Run.call("npm logout")

    elif command == "publish":
        print("tunnel -- npm publish")
        pass

    else:
        if command is None:
            return Run.call("npm run gulp")
        else:
            return Run.call("npm run {}".format(command), **kwargs)


def git(command=None, **kwargs):
    cwd = kwargs.get("cwd", Config.get("working_directory"))

    kwargs.update(cwd=cwd)

    if command == "check":
        obs_name = Run.observe("git config --global user.name")
        obs_email = Run.observe("git config --global user.email")

        name = obs_name.stdout
        email = obs_email.stdout

        if not name or not email:
            return False

        return True

    elif command == "set-identity":
        name = Env.get("git.name")
        email = Env.get("git.email")

        if name is None:
            name = raw_input("Name: ")

        if email is None:
            email = raw_input("Email: ")

        Run.call('git config --global user.name "{}"'.format(name))
        Run.call("git config --global user.email {}".format(email))

    elif command == "whoami":
        obs_name = Run.observe("git config --global user.name")
        obs_email = Run.observe("git config --global user.email")

        name = obs_name.stdout
        email = obs_email.stdout

        print("git user.name: {}".format(name))
        print("git user.email: {}".format(email))

        return name is not None and email is not None

    elif command == "push":
        print("tunnel -- git push")
        pass

    else:
        if command is None:
            return Run.call("git status")
        else:
            return Run.call("git {}".format(command), **kwargs)


def get_checkables():
    return [npm, git]
