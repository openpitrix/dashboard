#!/bin/bash

echo 'bundle production assets..'
rimraf dist && npm run prod:build

echo 'build docker image..'
docker build -t op/web-app .