#!/usr/bin/env bash

export H_NPM_USERNAME="$1"
export H_NPM_PASSWORD="$2"
export H_NPM_EMAIL="$3"

npm adduser <<!
$H_NPM_USERNAME
$H_NPM_PASSWORD
$H_NPM_EMAIL
!

unset H_NPM_USERNAME
unset H_NPM_PASSWORD
unset H_NPM_EMAIL
