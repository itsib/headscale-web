#!/bin/bash

set -e

echo -e "\x1b[0;93mRemove old versions\x1b[0m"
rm -f headscale-web.tgz

echo -e "\x1b[0;93mPack files to tar archive\x1b[0m"
npm pack
mv headscale-web-*.tgz headscale-web.tgz

echo -e "\x1b[0;93mSend package to the server.\x1b[0m"
scp ./headscale-web.tgz root@amsterdam:/var/www

echo -e "\x1b[0;93mUnpack package in remote server.\x1b[0m"
ssh amsterdam -t 'cd /var/www && tar -xzf headscale-web.tgz && rm -rf ./headscale-web && mv ./package/dist/ headscale-web && rm -rf ./package headscale-web.tgz'
