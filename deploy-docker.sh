#!/usr/bin/env bash

set -ex

REPO=openpitrix/dashboard
COMMIT=$(git rev-parse --short HEAD)
TAG=${1:-latest}

cat ~/docker_pass.txt | docker login --username iwisunny --password-stdin

echo "Pulling remote latest image to reuse docker cache"
docker pull $REPO:latest

echo "Building docker image from git HEAD commit: $COMMIT"
docker build --cache-from $REPO:latest -t $REPO:$COMMIT .

echo "Tag $REPO:$COMMIT as latest image"
docker tag $REPO:$COMMIT $REPO:$TAG

echo "Push latest image to docker hub"
docker push $REPO:$TAG
