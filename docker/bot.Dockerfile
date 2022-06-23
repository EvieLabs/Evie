FROM node:16-buster-slim

# Create app directory
WORKDIR /usr/src/app

# Install Dependencies
RUN apt-get update && \
	apt-get upgrade -y --no-install-recommends && \
	apt-get install -y --no-install-recommends build-essential git python3 libfontconfig1 dumb-init && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/*

# Fetch dependencies
COPY yarn.lock .
COPY package.json .
COPY services/backend/package.json services/backend/package.json 
RUN yarn install

# Compile
COPY tsconfig.base.json tsconfig.base.json
COPY services/backend/ services/backend/
COPY .git/ .git/

# Go into backend dir
WORKDIR /usr/src/app/services/backend
RUN yarn build

# Production mode
ENV NODE_ENV="production"

# Entrypoint
CMD [ "yarn", "start:withdbupdate" ]