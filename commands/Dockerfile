FROM node:17-alpine

WORKDIR /fujino
COPY . .

RUN npm install --production
RUN node deploy-commands.js
ENTRYPOINT node main.js