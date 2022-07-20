FROM node:18.3-alpine3.16@sha256:9cfd511a5bca3cac43201e5b185c44da4f066019d20a6af85a03196400b401b4

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

USER node

CMD [ "npm", "run", "serve" ]