FROM node:16-alpine

RUN corepack enable

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
RUN yarn --frozen-lockfile

COPY . /app

CMD ["yarn","start"]