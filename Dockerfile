FROM node:16-alpine

WORKDIR /app
COPY package*.json /app
COPY . .

RUN rm -rf node_modules/
RUN npm install
RUN npm update


CMD ["npm","run","dev"]