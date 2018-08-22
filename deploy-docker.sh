#!/usr/bin/env sh

set -e

# kill any running openpitrix-dashboard containers
echo "Cleaning up old containers.."
docker ps -a | grep openpitrix-dashboard | awk '{print $1}' | xargs docker rm -f || true


REPO=openpitrix/dashboard
COMMIT=$(git rev-parse --short HEAD)

echo "Building docker image from git HEAD commit: $COMMIT"
docker build -t $REPO:$COMMIT .

echo "Push image to docker hub.."
docker push $REPO:$COMMIT