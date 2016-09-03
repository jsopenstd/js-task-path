#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import shlex
import subprocess
import collections
import os.path
import json
import getpass


def exec_command(command, **kwargs):
    shell = kwargs.get("shell", False)
    stdin = kwargs.get("stdin", None)
    stdout = kwargs.get("stdout", None)
    stderr = kwargs.get("stderr", None)

    kwargs.update(shell=shell)
    kwargs.update(stdin=stdin)
    kwargs.update(stdout=stdout)
    kwargs.update(stderr=stderr)

    if not isinstance(command, list):
        command = shlex.split(command)

    return subprocess.call(command, **kwargs)


def observe_command(command, **kwargs):
    shell = kwargs.get("shell", False)
    stdin = kwargs.get("stdin", subprocess.PIPE)
    stdout = kwargs.get("stdout", subprocess.PIPE)
    stderr = kwargs.get("stderr", subprocess.PIPE)

    kwargs.update(shell=shell)
    kwargs.update(stdin=stdin)
    kwargs.update(stdout=stdout)
    kwargs.update(stderr=stderr)

    if not isinstance(command, list):
        command = shlex.split(command)

    proc = subprocess.Popen(command, **kwargs)

    try:
        _stdin = proc.stdin.read()
    except IOError:
        _stdin = None

    try:
        _stdout = proc.stdout.read()
    except IOError:
        _stdout = None

    try:
        _stderr = proc.stderr.read()
    except IOError:
        _stderr = None

    if not _stdin:
        _stdin = None

    if not _stdout:
        _stdout = None

    if not _stderr:
        _stderr = None

    Result = collections.namedtuple("result", "stdin, stdout, stderr")

    return Result(stdin=_stdin, stdout=_stdout, stderr=_stderr)


def file_exists(path):
    return os.path.isfile(path)


def get_json_data(path):
    with open(path) as data_file:
        data = json.load(data_file)

    return data


def data_exists(json_data, key):
    return get_data(json_data, key) is not None


def get_data(json_data, key):
    parts = key.split(".")
    value = None

    for part in parts:

        if part in json_data:
            json_data = json_data[part]
            value = json_data

        else:
            value = None
            break

    return value


def git_data_exists(json_data):
    if (data_exists(json_data, "git") and
        data_exists(json_data, "git.name") and
        data_exists(json_data, "git.email")):

        return True

    return False


def npm_data_exists(json_data):
    if (data_exists(json_data, "npm") and
        data_exists(json_data, "npm.username") and
        data_exists(json_data, "npm.email")):

        return True

    return False


def git_prerequisites_exist():
    output = observe_command("git config --global user.name")

    if output.stdout is None:
        return False

    output = observe_command("git config --global user.email")

    if output.stdout is None:
        return False

    return True


def npm_prerequisites_exist():
    output = observe_command("npm whoami")

    if output.stderr is not None:
        return False

    return True


def git_set_prerequisites(json_data):
    name = get_data(json_data, "git.name")
    email = get_data(json_data, "git.email")

    exec_command("git config --global user.name \"{}\"".format(name))
    exec_command("git config --global user.email \"{}\"".format(email))


def npm_set_prerequisites(npm_adduser_path, json_data):
    username = get_data(json_data, "npm.username")
    email = get_data(json_data, "npm.email")

    password = getpass.getpass("NPM Password: ")

    exec_command("{} {} {} {}".format(npm_adduser_path, username, password, email))


def bump_project(bump_type):
    bump = "tasks/bump-project-{}"

    if (bump_type == "major" or
        bump_type == "minor" or
        bump_type == "patch"):

        bump = bump.format(bump_type)

    else:
        # "patch" is the default bump_type
        bump = bump.format("patch")

    run_gulp(bump)


def bump_project_files(bump_type):
    bump = "tasks/bump-{}"

    if (bump_type == "major" or
        bump_type == "minor" or
        bump_type == "patch"):

        bump = bump.format(bump_type)

    else:
        # "patch" is the default bump_type
        bump = bump.format("patch")

    run_gulp(bump)


def git_publish():
    data = get_json_data(package_json)
    version = get_data(data, 'version')

    # stage files
    exec_command(["git add --all"], shell=True)

    # commit
    exec_command(["git commit -m \"{}\"".format(version)], shell=True)

    # tag
    exec_command(["git tag {}".format(version)], shell=True)

    # push
    exec_command(["git push origin master --tags"], shell=True)


def npm_publish():
    exec_command("npm publish")


def run_gulp(task=None):
    if task is None:
        task = ""

    exec_command(gulp.format(task))


# necessary paths
publish_json = "/vagrant/.publish.json"
package_json = "/vagrant/package.json"
npm_adduser_sh = "/vagrant/scripts/tasks/npm-adduser.sh"

# gulp path
gulp = "gulp --gulpfile /vagrant/scripts/gulp/main.js {}"

args = sys.argv[1:]

if len(args) > 0:
    main_task = args[0]
    sub_task = None

    if len(args) > 1:
        sub_task = args[1]

    # process according to main_task
    if main_task == "test":
        run_gulp("tasks/test")

    elif main_task == "bump":
        bump_project(sub_task)

    elif main_task == "build":
        run_gulp("tasks/build")

    elif main_task == "publish":
        if not file_exists(publish_json):
            raise FileNotFoundError(".publish.json doesn't exist on: \"{}\"".format(publish_json))

        data = get_json_data(publish_json)

        # check necessary data presence
        if not git_data_exists(data):
            raise ValueError("git data not found in .publish.json")

        if not npm_data_exists(data):
            raise ValueError("npm data not found in .publish.json")

        # check prerequisites
        if not git_prerequisites_exist():
            git_set_prerequisites(data)

        if not npm_prerequisites_exist():
            npm_set_prerequisites(npm_adduser_sh, data)

        # bump file versions according to sub_task
        bump_project_files(sub_task)

        # build files
        run_gulp("tasks/build")

        # commit and push files
        git_publish()

        # publish on NPM
        npm_publish()

    else:
        run_gulp(main_task)

else:
    run_gulp()
