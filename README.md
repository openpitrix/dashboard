<p align="center"><img src="https://raw.githubusercontent.com/openpitrix/openpitrix/master/docs/images/logo.png" alt="OpenPitrix Dashboard"></p>

# OpenPitrix Dashboard

[![Build Status](https://travis-ci.org/openpitrix/dashboard.svg)](https://travis-ci.org/openpitrix/dashboard)
[![codecov](https://codecov.io/gh/openpitrix/dashboard/branch/master/graph/badge.svg)](https://codecov.io/gh/openpitrix/dashboard)
[![License](http://img.shields.io/badge/license-apache%20v2-blue.svg)](./LICENSE)

## Installation

### using git
```shell
git clone https://github.com/openpitrix/dashboard.git
cd dashboard
yarn
yarn dev
```

### using docker
```shell
docker pull openpitrix/dashboard
docker run --name openpitrix-dashborad -p 8000:8000 openpitrix/dashboard
```

### docker-compose
```shell
docker-compose up --build
```

### using make
```shell
make build
make dev
```

**For some requisites, see installation details:** [install doc](./docs/install.md)

## Architecture

See: [arch doc](./docs/arch.md)

## Building

**For development mode**

```shell
yarn dev
```

**For production mode**

```shell
yarn prod
```

## Testing

```shell
yarn test
```

## Join the community

For bug reporting, [open issue](https://github.com/openpitrix/dashboard/issues/new)

Wanna help us to improve this project? Fork this repo, send your awesome _PR_.

We are happy to see you :smiley:
