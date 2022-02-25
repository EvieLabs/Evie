FROM node:16.11.1

# Create app directory
WORKDIR /usr/src/app

# Copy package.json
COPY package*.json ./

# Fetch dependencies
RUN yarn

# Copy code
COPY . .

# Compile typescript to javascript
RUN yarn build

# Entrypoint
CMD [ "yarn", "docker:run" ]
