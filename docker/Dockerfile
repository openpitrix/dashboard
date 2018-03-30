FROM node:carbon
MAINTAINER sunnyw <sunnywang@yunify.com>

RUN useradd --create-home --user-group --shell /bin/bash web

ENV HOME=/home/web

# todo: production way to install yarn
#RUN curl -o- -L https://yarnpkg.com/install.sh | bash
#ENV PATH "$PATH:$HOME/.yarn/bin"

# todo: local dev way to install yarn
ADD docker/yarn.tar.gz $HOME
ENV PATH "$PATH:$HOME/yarn-v1.5.1/bin"

RUN echo "yarn version: " && yarn --version

# install deps firstly will re-use cache layer of docker
COPY package.json yarn.lock .npmrc $HOME/app/

RUN chown -R web:web $HOME/*

USER web

WORKDIR $HOME/app

# for yarn cache
#ADD .yarn-cache.tgz /
#RUN echo 'cache=/tmp/.yarn-cache' >> /tmp/.npmrc

RUN yarn install --verbose

COPY . $HOME/app

EXPOSE $PORT 8000

CMD ["yarn", "run", "dev"]
