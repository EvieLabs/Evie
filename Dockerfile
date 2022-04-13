FROM node:16.11.1

# Create app directory
WORKDIR /usr/src/app

# Puppeteer
RUN apt-get install -y \
	fonts-liberation \
	gconf-service \
	libappindicator1 \
	libasound2 \
	libatk1.0-0 \
	libcairo2 \
	libcups2 \
	libfontconfig1 \
	libgbm-dev \
	libgdk-pixbuf2.0-0 \
	libgtk-3-0 \
	libicu-dev \
	libjpeg-dev \
	libnspr4 \
	libnss3 \
	libpango-1.0-0 \
	libpangocairo-1.0-0 \
	libpng-dev \
	libx11-6 \
	libx11-xcb1 \
	libxcb1 \
	libxcomposite1 \
	libxcursor1 \
	libxdamage1 \
	libxext6 \
	libxfixes3 \
	libxi6 \
	libxrandr2 \
	libxrender1 \
	libxss1 \
	libxtst6 \
	xdg-utils

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
