FROM node:24 AS test-stage

WORKDIR /usr/src/app

COPY --exclude=.env --exclude=node_modules --exclude=dist --exclude=.git . .

RUN npm ci

RUN npm run test

FROM test-stage AS build-stage

ENV VITE_BACKEND_URL=http://localhost:8080

RUN npm run build

FROM nginx:1.29-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html