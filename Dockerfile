FROM node:alpine

RUN apk add --no-cache nodejs npm yarn
WORKDIR /app
COPY  package.json ./
RUN yarn --network-timeout 100000
COPY ./ ./
EXPOSE 5000
CMD ["yarn", "start:debug"]






