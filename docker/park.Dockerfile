FROM node:16-buster-slim

# Create app directory
WORKDIR /usr/src/app

# Install Dependencies
RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential git python3 libfontconfig1 dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
    && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install google-chrome-stable -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Fetch dependencies
COPY yarn.lock .
COPY package.json .
COPY services/park/package.json services/park/package.json 
RUN yarn install

# Compile
COPY tsconfig.base.json tsconfig.base.json
COPY services/park/ services/park/
COPY .git/ .git/

# Go into backend dir
WORKDIR /usr/src/app/services/backend
RUN yarn build

# Production mode
ENV NODE_ENV="production"

# Entrypoint
CMD [ "yarn", "start:withdbupdate" ]