# Base image
FROM node:20-slim

# Install build tools for native modules
RUN apk add --no-cache python3 make g++ bash

# Set work directory
WORKDIR /app

# Copy dependencies first (for better caching)
COPY package*.json ./

# Install dependencies
# RUN npm ci --verbose #for debug
RUN npm ci --legacy-peer-deps --no-audit --no-fund

# Copy app files
COPY . .

# Build app
RUN npm run build

# Expose NestJS port
EXPOSE 5000

# Start app
CMD ["npm", "run", "start"]
