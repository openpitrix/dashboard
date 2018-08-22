<p align="center"><img src="https://raw.githubusercontent.com/openpitrix/openpitrix/master/docs/images/logo.png" alt="OpenPitrix Dashboard"></p>

# OpenPitrix Dashboard

[![Build Status](https://travis-ci.org/openpitrix/dashboard.svg)](https://travis-ci.org/openpitrix/dashboard)
[![docker build status](https://img.shields.io/docker/build/openpitrix/dashboard.svg)](https://cloud.docker.com/swarm/openpitrix/repository/docker/openpitrix/dashboard/tags)
[![docker pull status](https://img.shields.io/docker/pulls/openpitrix/dashboard.svg)](http://lab.openpitrix.io)
[![codecov](https://codecov.io/gh/openpitrix/dashboard/branch/master/graph/badge.svg)](https://codecov.io/gh/openpitrix/dashboard)
[![License](http://img.shields.io/badge/license-apache%20v2-blue.svg)](./LICENSE)

## Usage

If you prefer to use `git`:

```
git clone --depth 1 https://github.com/openpitrix/dashboard.git
cd dashboard
yarn && yarn dev
```

If you prefer to use `docker`:

```
docker pull openpitrix/dashboard
docker run -d --name openpitrix-dashborad -p 8000:8000 openpitrix/dashboard
```

Then open your browser: `http://localhost:8000`

**See how to install requisites:** [installation details](./docs/install.md)

## Quick start

**See:** [quick-start.md](./docs/quick-start.md)

## Develop

For `development` mode:

```
yarn dev
```

For `production` mode:

```
yarn prod
```

## Test

```
yarn test
```

## Contribute

For bug reporting, [open an issue](https://github.com/openpitrix/dashboard/issues/new)

If you want help us to improve this project. Fork this repo, send your awesome _PR_ :smiley:
