FROM node:12

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . /usr/src/app

ENV NODE_ENV=docker

EXPOSE 8062
CMD ["npm", "run", "start:manual"]