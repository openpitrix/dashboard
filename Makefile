npm_cache := $(shell npm config get cache)
yarn_cache := $(shell yarn cache dir)
cwd := $(shell pwd)

# Unconditionally make all targets
# make build --always-make
.PHONY: build build-dev clean

build: Dockerfile
	@echo building image..
	docker build . -t op/web-app

build-dev: Dockerfile.dev
	@echo building dev image..
	docker build . -t op/web-app-dev -f Dockerfile.dev

run:
	@echo up and running openpitrix-dashboard
	docker run -p 8000:8000 --rm --name openpitrix-dashboard op/web-app

run-dev:
	@echo up and running openpitrix-dashboard-dev
	docker run -p 8000:8000 --rm --name openpitrix-dashboard-dev op/web-app-dev

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

