#!/bin/bash

cd "$( cd "$(dirname "$0")" && pwd )/.."

NAME="headscale-web"
IMAGE="sergeyitsib/$NAME"

# Remove old image
docker container stop "$NAME"
docker container rm "$NAME"
docker image rm "$IMAGE"

docker build -f Dockerfile -t "$IMAGE" .

#docker run --detach --name "$NAME" --cap-add=NET_ADMIN -p 80:80 -p 443:443 -p 443:443/udp -e HOST="ui.itsib.su" "$IMAGE"

docker run --detach --name "$NAME" -p 8080:80 "$IMAGE"