FROM node:16-buster-slim

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update && \
	apt-get upgrade -y --no-install-recommends && \
	apt-get install -y --no-install-recommends build-essential git python3 libfontconfig1 dumb-init && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/*

# Fetch dependencies
COPY yarn.lock .
COPY package.json .
COPY .yarnrc.yml .
COPY .yarn/ .yarn/

RUN yarn install

# Compile
COPY tsconfig.base.json tsconfig.base.json
COPY src/ src/
COPY prisma/schema.prisma prisma/schema.prisma
COPY .git/ .git/

RUN yarn build

# Production mode
ENV NODE_ENV="production"

# Entrypoint
CMD [ "yarn", "start:withdbupdate" ]