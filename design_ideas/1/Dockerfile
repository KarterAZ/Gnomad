ARG VERSION=latest

FROM node:${VERSION}

WORKDIR /usr/src/app

COPY src/package*.json ./

RUN npm install

COPY src .

EXPOSE ${PORT}

CMD node main.js