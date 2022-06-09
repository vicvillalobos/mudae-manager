FROM node:lts-alpine as build

WORKDIR /app

RUN apk add python3 build-base pkgconfig git

COPY package.json .

RUN yarn install

FROM node:lts-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules

COPY package.json .