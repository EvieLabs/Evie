FROM node:16.11.1-alpine

# Create app directory
WORKDIR /usr/src/app

RUN apk update && apk add --no-cache nmap && \
	echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
	echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
	apk update && \
	apk add --no-cache \
	chromium \
	harfbuzz \
	"freetype>2.8" \
	ttf-freefont \
	nss

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy code
COPY . .

# Fetch dependencies
RUN yarn install

# Compile typescript to javascript
RUN yarn build

# Install pm2
RUN npm install pm2 -g

# Entrypoint
CMD [ "yarn", "docker" ]
