FROM node:24

WORKDIR /usr/src/server

COPY --chown=node:node --exclude=.env --exclude=node_modules --exclude=.git . .

RUN npm install

USER node

CMD ["npm", "run", "dev"]