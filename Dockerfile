FROM node:alpine

RUN apk add --no-cache nodejs npm yarn
WORKDIR /app
COPY  package.json yarn.lock ./
RUN yarn 
COPY ./ ./
EXPOSE 5000
CMD ["yarn", "start:debug"]