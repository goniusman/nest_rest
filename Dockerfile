# Base image
FROM node:20-slim

# Set work directory
WORKDIR /app

# Copy dependencies first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps --no-audit --no-fund

# Copy app files
COPY . .

# Build app
RUN npm run build

# Expose NestJS port
EXPOSE 5000

# Start app
CMD ["npm", "run", "start"]
