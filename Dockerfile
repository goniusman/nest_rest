# Base image
FROM node:20

# Install build tools
# RUN apk add --no-cache python3 make g++ 

# Set work directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy app files
COPY . .

# Build app
RUN npm run build

# Expose NestJS port
EXPOSE 5000

# Start app
CMD ["npm", "run", "start"]"npm", "run", "start"]







# Old One.
# FROM node:alpine

# RUN apk add --no-cache nodejs npm yarn
# WORKDIR /app
# COPY  package.json yarn.lock ./
# RUN yarn --network-timeout 1000000
# COPY ./ ./
# EXPOSE 5000
# CMD ["yarn", "start:debug"]








