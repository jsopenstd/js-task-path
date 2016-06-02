#!/usr/bin/env bash

# enter permanent sudo by changing user to root
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

# update python 2.7.x
add-apt-repository -y ppa:fkrull/deadsnakes-python2.7
apt-get update -y
apt-get install python2.7 -y

# install pip (python's package manager)
apt-get install python-pip -y

# install node & update npm
curl -sL https://deb.nodesource.com/setup_6.x | bash -
apt-get install nodejs -y
npm install npm --global

# install dependency version updater globally
npm rm npm-check-updates --global
npm install npm-check-updates --global

# install gulp globally
npm rm gulp --global
npm install gulp gulp-cli --global

# add custom content to .bashrc
cat > /home/vagrant/.bashrc <<- EOM

    # aliases for npm-check-updates
    alias check-dep="ncu"
    alias update-dep="ncu -u"

    # navigate to vagrant folder (the project's root) upon login
    cd /vagrant

EOM

# exit sudo mode before installing project dependencies
# to prevent missing and/or damaged source code of dependencies
# e.g.: "SyntaxError: Unexpected token ILLEGAL" when running gulp with "istanbul"
su vagrant

# install python dependencies
pip install PyYAML --user
pip install JMESPath --user

# clean-up before the first try
# to prevent "ENOENT: no such file or directory, open..." error during npm install
cd /vagrant
rm -rf node_modules
npm cache clean

# install project dependencies
if ! npm install; then

    # clean-up before another try
    cd /vagrant
    rm -rf node_modules
    npm cache clean

	# when running Vagrant under Windows, in case of "EPROTO: protocol error, symlink...",
	# try install dependencies with "--no-bin-links"
    if ! npm install --no-bin-links; then
        echo '"npm install" AND "npm install --no-bin-links" failed, try to resolve it manually'
    fi
fi
