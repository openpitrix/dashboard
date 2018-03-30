FROM node:carbon
MAINTAINER sunnyw <sunnywang@yunify.com>

COPY docker/source.list /etc/apt/sources.list
RUN apt-get update \
    && apt-get install -y --no-install-recommends vim

RUN useradd --create-home --user-group --shell /bin/bash web

ENV HOME=/home/web

RUN mkdir -p $HOME/app

# todo: production way to install yarn
#RUN curl -o- -L https://yarnpkg.com/install.sh | bash
#ENV PATH "$PATH:$HOME/.yarn/bin"

# todo: local dev way to install yarn
ADD docker/yarn.tar.gz $HOME
ENV PATH "$PATH:$HOME/yarn-v1.5.1/bin"

# install deps firstly will re-use cache layer of docker
COPY package.json yarn.lock .npmrc /tmp/

RUN cd /tmp && yarn install --verbose \
    && cd $HOME/app \
    && ln -s /tmp/node_modules

WORKDIR $HOME/app

# todo: use docker-compose volume mount as rw
#COPY . .

RUN chown -R web:web .

USER web

# for yarn cache
#ADD .yarn-cache.tgz /
#RUN echo 'cache=/tmp/.yarn-cache' >> /tmp/.npmrc


#EXPOSE 8000

CMD ["yarn", "--version"]
