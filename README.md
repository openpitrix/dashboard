<p align="center"><img src="./src/assets/logo.svg" alt="OpenPitrix Dashboard"></p>

# OpenPitrix Dashboard
> A dashboard for [OpenPitrix](https://github.com/openpitrix/openpitrix)


[![Build Status](https://travis-ci.org/openpitrix/dashboard.svg)](https://travis-ci.org/openpitrix/dashboard)
[![License](http://img.shields.io/badge/license-apache%20v2-blue.svg)](./LICENSE)


## 1. Installation

### Setting up with git
If you choose this way, we recommend you to install some requisites
- git
- node.js (`npm` is already bundled with node)
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

> The easiest way is to use one-off command: `docker-compose`

```shell
docker-compose up
```

> Using `docker` to build and run

Since we already provide a **Makefile**, to build docker image is simple:

```shell
make build
```

Or you can build from scratch:

```shell
docker build -t sunnyw/node-app -f docker/Dockerfile .

docker run -d --name openpitrix-dash -p 8000:8000 -v .:/home/web/app/ sunnyw/node-app
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

We are happy to see you :)


