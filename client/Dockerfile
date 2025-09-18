# Stage 1: Build the React application
FROM node:18-alpine as builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN cd client && npm ci

# Copy source code
COPY . .

# Build the application
RUN cd client && npm run build

# =======================================

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy custom nginx config
COPY client/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Set environment variables
ENV NODE_ENV=production
ENV PORT=80

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets with proper permissions
COPY --from=builder --chown=nginx:nginx /app/client/dist /usr/share/nginx/html

# Expose port 80 and 443
EXPOSE 80 443

# Use tini as init process for better signal handling
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
