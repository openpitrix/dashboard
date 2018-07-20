<p align="center"><img src="https://raw.githubusercontent.com/openpitrix/openpitrix/master/docs/images/logo.png" alt="OpenPitrix Dashboard"></p>

# OpenPitrix Dashboard

[![Build Status](https://travis-ci.org/openpitrix/dashboard.svg)](https://travis-ci.org/openpitrix/dashboard)
[![docker build status](https://img.shields.io/docker/build/openpitrix/dashboard.svg)](https://cloud.docker.com/swarm/openpitrix/repository/docker/openpitrix/dashboard/builds)
[![docker pull status](https://img.shields.io/docker/pulls/openpitrix/dashboard.svg)](http://lab.openpitrix.io)
[![codecov](https://codecov.io/gh/openpitrix/dashboard/branch/master/graph/badge.svg)](https://codecov.io/gh/openpitrix/dashboard)
[![License](http://img.shields.io/badge/license-apache%20v2-blue.svg)](./LICENSE)

## Install

If you already installed `git`, setting up this repo is very simple:

```shell
git clone --depth 1 https://github.com/openpitrix/dashboard.git
cd dashboard
yarn && yarn dev
```

If you prefer to use `docker`:

```shell
docker pull openpitrix/dashboard
docker run --name openpitrix-dashborad -p 8000:8000 openpitrix/dashboard
```

If you prefer to use `docker-compose`:

```shell
docker-compose up --build
```

We also prepared a Makefile, if you installed `make`:

```shell
make build
make dev
```

**See how to install requisites:** [install doc](./docs/install.md)

## Build

For `development` mode:

```shell
yarn dev
```

For `production` mode:

```shell
yarn prod
```

## Test

For `unit` and `integrate` test:

```shell
yarn test
```

For `e2e` test:

```shell
yarn e2e
```

## Architecture

See: [arch doc](./docs/arch.md)

## Join the community

For bug reporting, [file an issue](https://github.com/openpitrix/dashboard/issues/new)

Wanna help us to improve this project? Fork this repo, send your awesome _PR_.

We are happy to see you :smiley:
