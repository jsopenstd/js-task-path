#!/usr/bin/env bash

function clean_up_dependencies()
{
    cd /vagrant
    rm -rf node_modules
    npm cache clean
}

# install node & update npm
curl -sL https://deb.nodesource.com/setup_6.x | sudo bash -
sudo apt-get install nodejs -y

sudo npm install npm --global

# install dependency version updater globally
sudo npm rm npm-check-updates --global
sudo npm install npm-check-updates --global

# install gulp globally
sudo npm rm gulp --global
sudo npm install gulp gulp-cli --global

# install project dependencies
# clean-up before the first try to prevent "ENOENT: no such file or directory, open..." error during npm install
clean_up_dependencies

# install dependencies
if ! npm install; then

    # clean-up before another try
    clean_up_dependencies

	# when running Vagrant under Windows, in case of "EPROTO: protocol error, symlink...",
	# try install dependencies with "--no-bin-links"
    if ! npm install --no-bin-links; then
        echo '"npm install" AND "npm install --no-bin-links" failed, try to resolve it manually'
    fi
fi
