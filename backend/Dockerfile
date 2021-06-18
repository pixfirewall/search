FROM node:alpine

# install nest.js command line
RUN npm i -g @nestjs/cli

# set maximum space for building the api
ARG MAX_OLD_SPACE_SIZE=4096
ENV NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

# build the API
RUN yarn build