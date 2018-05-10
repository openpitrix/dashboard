FROM mhart/alpine-node:8
MAINTAINER sunnyw <sunnywang@yunify.com>

# alpine-node doesn't have apt, bash
#COPY docker/source.list /etc/apt/sources.list
#RUN apt-get update \
#    && apt-get install -y --no-install-recommends vim

RUN addgroup web && \
    adduser -D -G web -s /bin/sh web

ENV HOME=/home/web

# install node-sass binding from local, in case of download failed
ENV SASS_BINARY_PATH=/tmp/linux_musl-x64-57_binding.node

RUN mkdir -p $HOME/app

# case: production way to install yarn
#RUN curl -o- -L https://yarnpkg.com/install.sh | bash
#ENV PATH "$PATH:$HOME/.yarn/bin"

# case: local dev way to install yarn
ADD docker/yarn.tar.gz $HOME
ENV PATH "$PATH:$HOME/yarn-v1.5.1/bin"

# install deps firstly will re-use cache layer of docker
COPY package.json yarn.lock .npmrc docker/linux_musl-x64-57_binding.node /tmp/

RUN cd /tmp && yarn install --verbose \
    && npm rebuild node-sass \
    && cd $HOME/app \
    && ln -s /tmp/node_modules \
    && chown -R web:web $HOME

WORKDIR $HOME/app

USER web

# for yarn cache
#ADD .yarn-cache.tgz /
#RUN echo 'cache=/tmp/.yarn-cache' >> /tmp/.npmrc

CMD ["yarn", "--version"]
