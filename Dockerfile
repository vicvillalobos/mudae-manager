FROM node:lts-alpine

WORKDIR /app

RUN apk add python3 python2 build-base pkgconfig

RUN apk add --no-cache \
    git \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    freetype-dev \
    giflib-dev

COPY package.json .

RUN yarn
