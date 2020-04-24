FROM node:12.12
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
ENV NODE_ENV=production
RUN yarn install
COPY adaptor.ts index.ts tsconfig.json ./
RUN yarn run tsc

USER node