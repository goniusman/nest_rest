# ---- Stage 1: Build ----
FROM node:20-slim AS builder

# Install build tools
RUN apt-get update && apt-get install -y python3 make g++ bash && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only dependency manifests first
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci --legacy-peer-deps --no-audit --no-fund

# Copy rest of the application
COPY . .

# Build the project
RUN npm run build


# ---- Stage 2: Production Runtime ----
FROM node:20-slim AS runtime

WORKDIR /app

# Copy only what's needed for runtime
COPY package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm ci --omit=dev --legacy-peer-deps --no-audit --no-fund

# (Optional) Copy any required assets/configs/templates
# COPY --from=builder /app/config ./config
# COPY --from=builder /app/public ./public

EXPOSE 5000

CMD ["node", "dist/main.js"]
