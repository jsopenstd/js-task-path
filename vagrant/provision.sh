#!/usr/bin/env bash

# enter permanent su
sudo su

# update before provisioning
apt-get -y update

# install essentials
apt-get install -y python-software-properties
apt-get install -y build-essential git nano curl mc

# update after essentials (especially python-software-properties)
apt-get -y update

# update git
add-apt-repository -y ppa:git-core/ppa
apt-get -y update
apt-get -y install git

# install node & update npm
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y nodejs
npm install npm -g

# install dependency version updater globally
npm install --global npm-check-updates

# install gulp globally
npm rm --global gulp
npm install --global gulp gulp-cli

# install project dependencies
# when running Vagrant under Windows, in case of "EPROTO: protocol error, symlink", use npm with "--no-bin-links"
# npm install --no-bin-links
npm install

# add custom content to .bashrc
cat > /home/vagrant/.bashrc <<- EOM

    # aliases for npm-check-updates
    alias check-deps="ncu"
    alias update-deps="ncu -u"

    # navigate to vagrant folder upon login
    cd /vagrant

EOM

# update after provisioning
apt-get -y update
