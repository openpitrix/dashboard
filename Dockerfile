FROM openpitrix/dashboard-env-slim:v0.2.0 as builder
MAINTAINER sunnyw <sunnywang@yunify.com>

ARG SKIP_NODE_SASS_TESTS=true

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

FROM node:8-alpine

ENV NODE_ENV=production

WORKDIR /app

RUN mkdir -p /app

COPY --from=builder /app /app
COPY --from=builder /tmp/prod_node_modules /app/node_modules

EXPOSE 8000

CMD ["npm", "run", "prod:serve"]
