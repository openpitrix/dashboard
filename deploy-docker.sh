#!/usr/bin/env bash

set -e

REPO=openpitrix/dashboard
COMMIT=$(git rev-parse --short HEAD)

echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

echo "Pulling remote latest image to reuse docker cache"
docker pull $REPO:latest

echo "Building docker image from git HEAD commit: $COMMIT"
docker build --cache-from $REPO:latest -t $REPO:$COMMIT .

echo "Tag $REPO:$COMMIT as latest image"
docker tag $REPO:$COMMIT $REPO:latest

echo "Push latest image to docker hub"
docker push $REPO:latest