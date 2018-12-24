npm_cache := $(shell npm config get cache)
yarn_cache := $(shell yarn cache dir)
cwd := $(shell pwd)

repo := openpitrix/dashboard

# get latest git tag
tag := $$(git tag -l --sort=-v:refname | head -1)

# Unconditionally make all targets
# make build --always-make
.PHONY: build clean

build: Dockerfile
	@echo building image..
	docker build . -t op/web-app

run:
	@echo up and running openpitrix-dashboard
	docker run -p 8000:8000 --rm --name openpitrix-dashboard op/web-app

# alpine linux has no bash
sh:
	docker exec -it openpitrix-dashboard sh

dev: docker-compose.yml
	docker-compose up

run-official:
	@echo up and running official image
	docker pull openpitrix/dashboard
	docker run -d -p 8000:8000 --name openpitrix-dashboard openpitrix/dashboard

# kill any running openpitrix-dashboard containers
clean:
	@echo "Cleaning up old containers.."
	docker ps -a | grep openpitrix-dashboard | awk '{print $1}' | xargs docker rm -f || true

# override tag argument
# example: make docker-tag tag=v1.0
docker-tag:
	@echo "build docker image from git tag ${tag}"
	docker pull ${repo}:latest
	docker build --cache-from ${repo}:latest -t ${repo}:${tag} .
	docker push ${repo}:${tag}

