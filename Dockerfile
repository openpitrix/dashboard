FROM node:9-alpine
MAINTAINER wangxi <sunnywang@yunify.com>

ENV HOME=/home/web
ENV PATH "$PATH:$HOME/app/node_modules/.bin"
ENV NODE_ENV=production

RUN mkdir -p $HOME/app

RUN echo https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.6/main/ > /etc/apk/repositories; \
    echo https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.6/community/ >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache curl

# install yarn from local
ADD yarn.tar.gz $HOME
ENV PATH "$PATH:$HOME/yarn-v1.5.1/bin"

# install yarn from network
#RUN curl -o- -L https://yarnpkg.com/install.sh | sh

# install deps, re-use cache layer of docker
#COPY package.json yarn.lock .npmrc /tmp/

WORKDIR $HOME/app
COPY . .

RUN yarn install --prod --prefer-offline --verbose

EXPOSE 8000

CMD ["npm", "run", "prod:serve"]
