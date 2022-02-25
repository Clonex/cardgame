FROM node:16.3-alpine3.12

# Enable yarn
# RUN npm i -g corepack
RUN apk update
RUN apk add python3 python2 make g++ bash
# RUN apk add g++ make python
RUN yarn add global node-gyp

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
RUN yarn --frozen-lockfile

COPY . /app
# RUN yarn build

CMD ["yarn","start"]