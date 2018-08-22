#!/usr/bin/env bash

set -e

REPO=openpitrix/dashboard
COMMIT=$(git rev-parse --short HEAD)

echo "Building docker image from git HEAD commit: $COMMIT"
docker build -t $REPO:$COMMIT .

echo "Tagging latest image as $REPO:$COMMIT"
docker tag $REPO:$COMMIT $REPO:latest

echo "Push image to docker hub.."
docker push $REPO