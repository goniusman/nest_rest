# Use faster base image
FROM node:20-slim AS builder

# Install build tools (Debian version)
RUN apt-get update && apt-get install -y python3 make g++ bash && rm -rf /var/lib/apt/lists/*


WORKDIR /app

COPY package*.json ./

RUN npm ci --verbose --legacy-peer-deps --no-audit --no-fund
# --legacy-peer-deps --no-audit --no-fund

COPY . .

RUN npm run build

FROM node:20-slim AS runtime

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev --legacy-peer-deps

EXPOSE 5000
CMD ["node", "dist/main.js"]
