FROM node:11-slim

RUN apt-get update && apt-get install -yq build-essential dumb-init

# where our app will live in container
WORKDIR /app

# react app
COPY  ./package.json ./package.json

# Install deps
RUN yarn

# copy whatever is here into container
COPY . .

ENTRYPOINT ["/usr/bin/dumb-init", "--"]