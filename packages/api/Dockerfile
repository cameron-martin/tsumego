FROM node:13.2.0-alpine

WORKDIR /app
ENV NODE_ENV=production

ADD yarn.lock /app/
ADD package.json /app/

ADD packages/api /app/packages/api

RUN cd /app && yarn install --frozen-lockfile

EXPOSE 8080

CMD [ "node", "packages/api/dist/index.js" ]
