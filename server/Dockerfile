# Stage 1: Build the application
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --only=production

# =======================================

# Stage 2: Create the production image
FROM node:18-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /usr/src/app

# Copy necessary files from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/server ./server

# Copy only necessary files
COPY server/ ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5004

# Set proper permissions
RUN chown -R appuser:appgroup /usr/src/app
USER appuser

# Expose the application port
EXPOSE 5004

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5004/api/health || exit 1

# Start the application
CMD ["node", "index.js"]
