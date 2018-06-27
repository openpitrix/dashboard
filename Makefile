npm_cache := $(shell npm config get cache)
cwd := $(shell pwd)

build: Dockerfile
	@echo building image..
	docker build -t op/web-app .

run:
	@echo up and running openpitrix-dashboard
	docker run -p 8000:8000 --name openpitrix-dashboard op/web-app

# apline linux has no bash
sh:
	docker exec -it openpitrix-dashboard sh

dev: docker-compose.yml
	docker-compose up

rm:
	docker-compose rm

build-base: Dockerfile
	@echo building base image
	docker build . --target base -t op-web-base
