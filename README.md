<p align="center"><img src="https://raw.githubusercontent.com/openpitrix/openpitrix/master/docs/images/logo.png" alt="OpenPitrix Dashboard"></p>

# Dashboard

[![Build Status](https://travis-ci.org/openpitrix/dashboard.svg)](https://travis-ci.org/openpitrix/dashboard)
[![docker build status](https://img.shields.io/docker/build/openpitrix/dashboard.svg)](https://cloud.docker.com/swarm/openpitrix/repository/docker/openpitrix/dashboard/tags)
[![docker pull status](https://img.shields.io/docker/pulls/openpitrix/dashboard.svg)](http://lab.openpitrix.io)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/153c5ea40ef44c318ad1b011c3f2b7a9)](https://app.codacy.com/app/iwisunny/dashboard?utm_source=github.com&utm_medium=referral&utm_content=openpitrix/dashboard&utm_campaign=Badge_Grade_Settings)
[![codecov](https://codecov.io/gh/openpitrix/dashboard/branch/master/graph/badge.svg)](https://codecov.io/gh/openpitrix/dashboard)
[![License](http://img.shields.io/badge/license-apache%20v2-blue.svg)](./LICENSE)

## Usage

```
git clone https://github.com/openpitrix/dashboard.git
cd dashboard
yarn 
yarn dev
```

Or you can running dashboard in `docker`:

```
docker pull openpitrix/dashboard
docker run -d --name openpitrix-dashborad -p 8000:8000 openpitrix/dashboard
```
Then open your browser: `http://localhost:8000`

## Develop
```
yarn 
yarn dev
```

We prefer `yarn` as our package manager, if you like `npm`:
```
npm i
npm run dev
```

See [How to install requsites](./docs/install.md)

## Test
```
yarn test
```

## Build

For production build:
```
yarn prod:build
```
Or using `npm`:
```
npm run prod:build
```


## Quick start

* [Deploy wordpress on QingCloud using openpitrix](./docs/quick-start.md)


## License

Apache v2
