ARG VERSION=latest

FROM node:${VERSION}

WORKDIR /usr/src/app

COPY src/package*.json ./

RUN npm install

COPY src/ ./

COPY src/public/ ./src/

EXPOSE ${PORT}

CMD node index.js