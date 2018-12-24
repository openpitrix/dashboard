FROM node:9-alpine as builder
MAINTAINER sunnyw <sunnywang@yunify.com>

# see: https://github.com/sass/node-sass/#binary-configuration-parameters
ARG SASS_BINARY_PATH
ARG SASS_BINARY_SITE

ENV SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/
ENV PATH=$PATH:/app/node_modules/.bin

WORKDIR /app

RUN mkdir -p /app

COPY package.json yarn.lock /tmp/

RUN cd /tmp && mkdir -p node_modules \
    && yarn install --pure-lockfile --prefer-offline \
    && mv node_modules dev_node_modules \
    && NODE_ENV=production yarn install --pure-lockfile --prod --prefer-offline \
    && mv node_modules prod_node_modules \
    && mv dev_node_modules node_modules

COPY . /app
RUN cd /app && ln -fs /tmp/node_modules && yarn prod:build

FROM node:9-alpine

ENV NODE_ENV=production

WORKDIR /app

RUN mkdir -p /app

COPY --from=builder /app /app
COPY --from=builder /tmp/prod_node_modules /app/node_modules

EXPOSE 8000

CMD ["npm", "run", "prod:serve"]
