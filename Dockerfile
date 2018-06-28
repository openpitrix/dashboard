FROM node:9-alpine as base
MAINTAINER sunnyw <sunnywang@yunify.com>

ENV PATH=$PATH:/app/node_modules/.bin
#ENV SASS_BINARY_PATH=/app/build-deps/linux-node-sass-x64-59_binding.node

ARG BUILD_ENV

WORKDIR /app

RUN mkdir -p /app

COPY package.json yarn.lock /tmp/

COPY . .

#ADD yarn-offline-cache.tgz /usr/local/share/.cache/yarn/v1/

RUN cd /tmp \
    && if [ "$BUILD_ENV" = "docker" ] ; then yarn install --pure-lockfile --prefer-offline; \
    else yarn install --pure-lockfile --prefer-offline --verbose; fi

RUN cd /app \
    && ln -fs /tmp/node_modules \
    && yarn prod:build \
    && rm -rf node_modules

FROM base as builder

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN yarn install --pure-lockfile --prod --prefer-offline \
    && rm -rf /tmp/node_modules \
    && yarn cache clean

EXPOSE 8000

CMD ["npm", "run", "prod:serve"]
