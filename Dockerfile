FROM node:9-jessie as builder

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN yarn install --prefer-offline --verbose
RUN npm run prod:build
RUN rm -rf node_modules


FROM node:9-alpine
MAINTAINER wangxi <sunnywang@yunify.com>

COPY --from=builder /app /app

ENV NODE_ENV=production

WORKDIR /app

RUN yarn install --prod --prefer-offline --verbose

EXPOSE 8000

CMD ["npm", "run", "prod:serve"]
