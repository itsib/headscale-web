#!/bin/bash

set -e

npm pack

echo -e "\x1b[0;93mSend package to the server.\x1b[0m"
scp ./headscale-ui-*.tgz root@amsterdam:/var/www

echo -e "\x1b[0;93mUnpack package in remote server.\x1b[0m"
ssh amsterdam -t 'cd /var/www && tar -xzf headscale-ui-*.tgz && rm -rf ./headscale-ui && mv ./package/dist/ headscale-ui && rm -rf ./package headscale-ui-*'
