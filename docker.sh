#!/bin/bash
set -e

cd "$(dirname "$(readlink -f "$BASH_SOURCE")")"

set -x

docker build -f Dockerfile -t sergeyitsib/headscale-web .

#docker build -f Dockerfile.build -t hello-world:build .
#
#docker build -t sergeyitsib/headscale-web .
#
#docker image tag sergeyitsib/headscale-web sergeyitsib/headscale-web:v0.2.9
#
#docker login -u sergeyitsib
#
#docker push sergeyitsib/headscale-web

# Run
# docker run --name headscale-web -p 127.0.0.1:8080:80/tcp -d sergeyitsib/headscale-web

# LABEL org.opencontainers.image.ref.name="headscale-web" \
  #      org.opencontainers.image.version="$VERSION" \
  #      org.opencontainers.image.created="$CREATED" \
  #      org.opencontainers.image.title="Headscale Web" \
  #      org.opencontainers.image.description="Web interface for headscale 0.23.0" \
  #      org.opencontainers.image.url="https://github.com/itsib/headscale-web" \
  #      org.opencontainers.image.authors="itsib.su@gmail.com" \
  #      org.opencontainers.image.licenses="Apache-2.0 license"