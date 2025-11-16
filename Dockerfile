# Multi-stage Docker build
# Stage 1: Build the SvelteKit application
FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production runtime with PocketBase
FROM alpine:latest

# Install necessary packages
RUN apk add --no-cache \
    ca-certificates \
    wget \
    unzip

# Create app directory
WORKDIR /app

# Download and install PocketBase
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.7/pocketbase_0.20.7_linux_amd64.zip \
    && unzip pocketbase_0.20.7_linux_amd64.zip \
    && chmod +x pocketbase \
    && rm pocketbase_0.20.7_linux_amd64.zip

# Copy built SvelteKit app from builder stage
COPY --from=builder /app/build ./public
COPY --from=builder /app/package.json ./

# Copy PocketBase configuration if exists
COPY pb_* ./

# Create data directory for PocketBase
RUN mkdir -p pb_data

# Expose port
EXPOSE 8080

# Start PocketBase with the built SvelteKit app as static files
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/app/pb_data", "--publicDir=/app/public"]