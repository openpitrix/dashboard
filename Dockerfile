FROM node:9-alpine as base
MAINTAINER wangxi <sunnywang@yunify.com>

ENV PATH=$PATH:/app/node_modules/.bin
ENV SASS_BINARY_PATH=/app/build-deps/linux-node-sass-x64-59_binding.node

WORKDIR /app

RUN mkdir -p /app

COPY package.json yarn.lock /tmp/

COPY . .

#ADD yarn-offline-cache.tgz /usr/local/share/.cache/yarn/v1/

RUN cd /tmp && HUSKY_SKIP_INSTALL=true yarn install --pure-lockfile --prefer-offline --verbose

RUN cd /app \
    && ln -fs /tmp/node_modules \
    && yarn prod:build \
    && rm -rf node_modules

FROM base as builder

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# install production deps
RUN yarn install --pure-lockfile --prod --prefer-offline --verbose \
    && rm -rf /tmp/node_modules \
    && yarn cache clean

EXPOSE 8000

CMD ["npm", "run", "prod:serve"]
