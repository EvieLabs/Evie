FROM node:16-alpine 

RUN mkdir -p /usr/src/app
ENV PORT 3000

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

# Production use node instead of root
# USER node

COPY . /usr/src/app

RUN yarn && yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]