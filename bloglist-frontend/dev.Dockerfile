FROM node:24

WORKDIR /usr/src/app

COPY --exclude=.env --exclude=node_modules --exclude=dist --exclude=.git --exclude=package-lock.json . .

RUN npm install

CMD ["npm", "run", "dev", "--", "--host"]