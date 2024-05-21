FROM node:16-alpine

RUN apk update
RUN apk add python3 python2 make g++ bash
RUN yarn add global node-gyp

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
RUN yarn --frozen-lockfile

COPY . /app

CMD ["yarn","start"]