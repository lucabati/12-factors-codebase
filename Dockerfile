FROM node:14.15.3

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY ./server.js /usr/src/app/server.js
COPY ./models /usr/src/app/models
COPY ./routes /usr/src/app/routes

# default values
ENV MONGO_HOST=localhost
ENV MONGO_PORT=27017
ENV MONGO_DB=test
ENV PORT=3000

CMD ["npm", "run", "start"]
