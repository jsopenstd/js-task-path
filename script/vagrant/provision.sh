#!/usr/bin/env bash

# enter permanent su
sudo su

# update before provisioning
apt-get update -y

# install essentials
apt-get install python-software-properties -y
apt-get install build-essential git nano curl mc -y

# update after essentials (especially python-software-properties)
apt-get update -y

# update git
add-apt-repository -y ppa:git-core/ppa
apt-get update -y
apt-get install git -y

# install node & update npm
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install nodejs -y
npm install npm --global

# install dependency version updater globally
npm rm npm-check-updates --global
npm install npm-check-updates --global

# install gulp globally
npm rm gulp --global
npm install gulp gulp-cli --global

# prevent "ENOENT: no such file or directory, open..." error during npm install
cd /vagrant
rm -rf node_modules
npm cache clean

# install project dependencies
if ! npm install; then

	# when running Vagrant under Windows, in case of "EPROTO: protocol error, symlink...",
	# try install dependencies with "--no-bin-links"
    if ! npm install --no-bin-links; then
        echo '"npm install" AND "npm install --no-bin-links" failed, try to resolve it manually'
    fi
fi

# add custom content to .bashrc
cat > /home/vagrant/.bashrc <<- EOM

    # aliases for npm-check-updates
    alias check-deps="ncu"
    alias update-deps="ncu -u"

    # navigate to vagrant folder upon login
    cd /vagrant

EOM

# update after provisioning
apt-get update -y
