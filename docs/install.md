# Requisites installation

## Install git
See [https://git-scm.com/](https://git-scm.com/)

## Install node.js
Since this application is built as `universal react app`, make sure Node.js is installed.
See [https://nodejs.org](https://nodejs.org)

## Install nvm (optional)

---

## Install yarn (optional)

### 1. install yarn using local tar file
> without hitting internet on every build, good for local dev

```shell
ADD docker/yarn.tar.gz /opt/
ENV PATH "$PATH:/opt/yarn-v1.5.1/bin"
```

### 2. install yarn using official shell
> need curl files on every build, will set yarn include path automatically

```shell
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
ENV PATH "$PATH:$HOME/.yarn/bin"
```

### 3. install yarn using apt-get
> need modify linux distro's source.list, more complex
> for example: on `debian` machine

```shell
COPY source.list /etc/apt/sources.list
RUN apt-get update && apt-get install -y --no-install-recommends \
    apt-utils \
    apt-transport-https curl \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends yarn
```

## Install docker (optional)
If you want build from docker image, you should make sure `docker` is installed.
For installation details, see: [Docker installation](https://docs.docker.com/install/)

## Install docker-compose (optional)

