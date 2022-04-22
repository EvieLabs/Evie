FROM node:16.11.1

# Create app directory
WORKDIR /usr/src/app

# Copy code
COPY . .

# Fetch dependencies
RUN yarn install

# Compile typescript to javascript
RUN yarn build

# Install pm2
RUN npm install pm2 -g

# Production mode
ENV NODE_ENV="production"

# Entrypoint
CMD [ "yarn", "docker" ]
