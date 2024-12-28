#!/bin/bash

HOST="127.0.0.1"
PORT="8081"
NAME="headscale-web"
IMAGE_NAME="sergeyitsib/$NAME"

docker build -t "$IMAGE_NAME:latest" .

docker remove --force "$NAME" >/dev/null 2>&1

docker run -p "$HOST:$PORT:80/tcp" --name "$NAME" -d "$IMAGE_NAME" >/dev/null 2>&1

echo -e "\x1b[0;36mContainer running on\x1b[0m http://$HOST:$PORT/"