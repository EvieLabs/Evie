FROM node:16.11.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install pm2 -g
RUN npm install -g typescript
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN apt-get update && apt-get install -y ffmpeg

#EXPOSE 8080
CMD [ "npm", "run", "docker" ]
