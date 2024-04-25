FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./www/package.json /usr/src/app/package.json
RUN npm install
RUN npm update

COPY ./www /usr/src/app

EXPOSE 3000