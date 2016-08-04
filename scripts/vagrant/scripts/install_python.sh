#!/usr/bin/env bash

# update python 2.7.x
sudo add-apt-repository ppa:fkrull/deadsnakes-python2.7 -y

sudo apt-get update -y
sudo apt-get install python2.7 -y

# install pip (python's package manager)
sudo apt-get install python-pip -y
