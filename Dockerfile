FROM node:alpine

RUN apk add --no-cache nodejs npm yarn
WORKDIR /app
COPY  package.json yarn.lock ./
RUN yarn --network-timeout 1000000
COPY ./ ./
EXPOSE 5000
CMD ["yarn", "start:debug"]






