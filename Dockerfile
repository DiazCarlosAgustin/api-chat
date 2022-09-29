FROM node:16.15-slim

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
RUN npm update
COPY . .

CMD ["npm","run","dev"]