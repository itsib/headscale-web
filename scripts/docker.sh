#!/bin/bash
set -e

cd "$( cd "$(dirname "$0")" && pwd )/.."

docker build -f Dockerfile -t sergeyitsib/headscale-web .

#docker run -d --name headscale-web --cap-add=NET_ADMIN -p 80:80 -p 443:443 -p 443:443/udp -e DOMAIN="ui.itsib.su" sergeyitsib/headscale-web