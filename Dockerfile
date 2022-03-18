FROM node:16.14.2

# Create app directory
WORKDIR /usr/src/app

# Copy package.json
COPY ./apps/bot/package*.json ./

# Copy yarn.lock
COPY ./yarn.lock ./

# Fetch dependencies
RUN yarn

# Copy code
COPY ./apps/bot .

# Copy root prisma config
COPY ./prisma .

# Compile typescript to javascript
RUN yarn build

# Install pm2
RUN npm install pm2 -g

# Entrypoint
CMD [ "yarn", "docker" ]
