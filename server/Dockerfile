FROM node:12
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
RUN npm install -g cross-env
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 4001
CMD [ "./docker_entry_script.sh" ]
