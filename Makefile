npm_cache := $(shell npm config get cache)
cwd := $(shell pwd)

build: Dockerfile
	@echo 'building image..'
	docker build -t openpitrix/node-app .

# apline linux has no bash
sh:
	docker exec -it openpitrix-web sh

# todo: add yarn cache to reduce `yarn install` cycle
#cache:
	@echo "mount $(npm_cache) to container as yarn cache dir\n \
	running web container.."

	docker run -it -v node_modules:/home/web/app/node_modules \
	-v "$(npm_cache)":/tmp/.yarn-cache openpitrix/node-app sh

dev: docker-compose.yml
	docker-compose up

rm:
	docker-compose rm

run:
	docker run --rm -it --name openpitrix-web -p 8000:8000 -v "$(cwd)":/home/web/app openpitrix/node-app sh
