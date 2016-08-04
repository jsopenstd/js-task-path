#!/usr/bin/env bash

# |---------------------------------------------------------------------------------------------------------------------
# | Vagrant Provision Script
# |---------------------------------------------------------------------------------------------------------------------
# |
# | This is the main script for vagrant for the provision process.
# |

export _VAGRANT_DIR="/vagrant"
export _PROVISION_DIR="$_VAGRANT_DIR/scripts/vagrant"
export _CONTENT_DIR="$_PROVISION_DIR/content"
export _SCRIPTS_DIR="$_PROVISION_DIR/scripts"

# update before provisioning
sudo apt-get update -y

"$_SCRIPTS_DIR/install_essentials.sh"

"$_SCRIPTS_DIR/install_git.sh"

"$_SCRIPTS_DIR/install_python.sh"

"$_SCRIPTS_DIR/install_node.sh"

# add custom content to .bashrc
cat "$_CONTENT_DIR/home/vagrant/.bashrc" >> /home/vagrant/.bashrc
