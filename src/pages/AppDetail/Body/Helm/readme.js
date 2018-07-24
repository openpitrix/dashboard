const markdown =
  '# OpenPitrix Dashboard\n' +
  '[![Build Status](https://travis-ci.org/openpitrix/dashboard.svg)](https://travis-ci.org/openpitrix/dashboard)\n' +
  '[![docker build status](https://img.shields.io/docker/build/openpitrix/dashboard.svg)](https://cloud.docker.com/swarm/openpitrix/repository/docker/openpitrix/dashboard/builds)\n' +
  '[![docker pull status](https://img.shields.io/docker/pulls/openpitrix/dashboard.svg)](http://lab.openpitrix.io)\n' +
  '[![codecov](https://codecov.io/gh/openpitrix/dashboard/branch/master/graph/badge.svg)](https://codecov.io/gh/openpitrix/dashboard)\n' +
  '[![License](http://img.shields.io/badge/license-apache%20v2-blue.svg)](./LICENSE)\n' +
  '\n' +
  '## Install\n' +
  '\n' +
  'If you already installed `git`, setting up this repo is very simple:\n' +
  '\n' +
  '```shell\n' +
  'git clone --depth 1 https://github.com/openpitrix/dashboard.git\n' +
  'cd dashboard\n' +
  'yarn && yarn dev\n' +
  '```\n' +
  '\n' +
  'If you prefer to use `docker`:\n' +
  '\n' +
  '```shell\n' +
  'docker pull openpitrix/dashboard\n' +
  'docker run --name openpitrix-dashborad -p 8000:8000 openpitrix/dashboard\n' +
  '```\n' +
  '\n' +
  'If you prefer to use `docker-compose`:\n' +
  '\n' +
  '```shell\n' +
  'docker-compose up --build\n' +
  '```\n' +
  '\n' +
  'We also prepared a Makefile, if you installed `make`:\n' +
  '\n' +
  '```shell\n' +
  'make build\n' +
  'make dev\n' +
  '```\n' +
  '\n' +
  '**See how to install requisites:** [install doc](./docs/install.md)\n' +
  '\n' +
  '## Build\n' +
  '\n' +
  'For `development` mode:\n' +
  '\n' +
  '```shell\n' +
  'yarn dev\n' +
  '```\n' +
  '\n' +
  'For `production` mode:\n' +
  '\n' +
  '```shell\n' +
  'yarn prod\n' +
  '```\n' +
  '\n' +
  '## Test\n' +
  '\n' +
  'For `unit` and `integrate` test:\n' +
  '\n' +
  '```shell\n' +
  'yarn test\n' +
  '```\n' +
  '\n' +
  'For `e2e` test:\n' +
  '\n' +
  '```shell\n' +
  'yarn e2e\n' +
  '```\n' +
  '\n' +
  '## Architecture\n' +
  '\n' +
  'See: [arch doc](./docs/arch.md)\n' +
  '\n' +
  '## Join the community\n' +
  '\n' +
  'For bug reporting, [file an issue](https://github.com/openpitrix/dashboard/issues/new)\n' +
  '\n' +
  'Wanna help us to improve this project? Fork this repo, send your awesome _PR_.\n' +
  '\n' +
  'We are happy to see you :smiley:\n';

export default markdown;
