npm_cache := $(shell npm config get cache)

build: docker/Dockerfile
	@echo 'building image..'
	docker build -t sunnyw/node-app -f docker/Dockerfile --force-rm .

# todo: add yarn cache to reduce `yarn install` cycle
#run:
	# init empty cache file for yarn cache
	if [ ! -f .yarn-cache.tgz ]; then
		echo "Init empty .yarn-cache.tgz"
		tar cvzf .yarn-cache.tgz --files-from /dev/null
	fi

	@echo "mount $(npm_cache) to container as yarn cache dir\n \
	running web container.."

	docker run -it -v node_modules:/home/web/app/node_modules \
	-v "$(npm_cache)":/tmp/.yarn-cache openpitrix/dash bash

dev: docker-compose.yml
	docker-compose up
