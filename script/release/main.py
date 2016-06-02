#!/usr/bin/env python

import os
from helpers.common import *

# set main configuration values
_wd = "/vagrant"
_res = "/vagrant/script/deploy"

Config.set("working_directory", _wd)
Config.set("doc_directory", _wd + "/doc")

Config.set("files.package_json", _wd + "/package.json")
Config.set("files.env_yml", _wd + "/.env.yml")
Config.set("files.helpers.npm_adduser_sh", _res + "/helpers/npm-adduser.sh")
Config.set("files.messages.errors_yml", _res + "/messages/errors.yml")
Config.set("files.messages.warnings_yml", _res + "/messages/warnings.yml")

# change the working directory of the script
os.chdir(Config.get("working_directory"))

# import tasks
from tasks import bump
from tasks import doc
from tasks import release

from helpers.tunnels import npm
from helpers.tunnels import git

#git("status", cwd=Config.get("doc_directory"))

git("--help")

exit()

if Arguments.has_main_argument():
    arg = Arguments.get_main_argument()

    if Arguments.has_case(arg):
        Arguments.handle_case(arg)

    else:
        print(Messages.get_warning("NO_CASE_FOR_ARGUMENT").format(arg))

else:
    print(Messages.get_warning("NO_ARGUMENTS_WERE_PASSED"))
    Arguments.print_available_cases()
