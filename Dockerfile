FROM node:latest

WORKDIR /app

COPY ./package.json /app/package.json
RUN npm install
RUN npm update

COPY ./ /app

EXPOSE 3000