<p align="center"><img src="./src/assets/logo.svg" alt="OpenPitrix Dashboard"></p>

# OpenPitrix Dashboard
> A dashboard for [OpenPitrix](https://github.com/openpitrix/openpitrix)


[![Build Status](https://travis-ci.org/openpitrix/dashboard.svg)](https://travis-ci.org/openpitrix/dashboard)
[![License](http://img.shields.io/badge/license-apache%20v2-blue.svg)](./LICENSE)


## 1. Installation

### Setting up with git
If you choose this way, we recommend you to install some requisites
- git
- node.js
- yarn (or npm, `we recommend yarn`)

**For more installation details, see: [installation doc](./docs/install.md)**

Check your requisites:
```shell
git --version
node -v
yarn -v
```

Then you are ready to go:
```shell
git clone https://github.com/openpitrix/dashboard.git
cd dashboard
yarn
yarn run dev
```


### Setting up with docker

**Attention:** If this is your first time to run the app, you should build a docker image

```shell
make build
```

_Since we wrap the build detail in Makefile, in fact you can also build your own docker image like this:_

```shell
docker build -t openpitrix/node-app .
```

**Attension:** You only have to build docker image once

To check your built images
```shell
docker images
```

Then you can start this app using `docker-compose`

```shell
docker-compose up
```

Since we already provide a **Makefile**, you can use one-off command:

```shell
make build && make dev
```

> If you like using `docker` to build and run from scratch

```shell
docker build -t openpitrix/node-app --force-rm --no-cache .

docker run -d --name openpitrix-web -p 8000:8000 -v $(pwd):/home/web/app openpitrix/node-app

# then you can shell into the running container
docker exec -it openpitrix-web bash

$ cd /home/web/app && yarn run dev
```

## 2. Application architecture
See: [architecture doc](./docs/arch.md)


## 3. Building
**For development mode**
```shell
yarn run dev
```

**For production mode**
```shell
yarn run prod
```

## 4. Testing
```shell
yarn test
```

## 5. Join the community
For bug reporting, see [issue list](https://github.com/openpitrix/dashboard/issues/new)

Wanna send us a pull request? You can fork this repo, making your improvement.

We are happy to see you :smiley:


