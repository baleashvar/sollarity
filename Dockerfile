# Multi-stage build for Sollarity
FROM node:18-alpine AS client-build

# Build React client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Python environment for workers
FROM python:3.9-alpine AS python-env

WORKDIR /app/workers
COPY workers/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY workers/ ./

# Main application
FROM node:18-alpine

# Install Python for workers
RUN apk add --no-cache python3 py3-pip

# Create app directory
WORKDIR /app

# Copy server files
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy built client
COPY --from=client-build /app/client/build ./client/build

# Copy server source
COPY server/ ./server/

# Copy Python workers
COPY --from=python-env /app/workers ./workers/
COPY workers/requirements.txt ./workers/
RUN cd workers && pip3 install --no-cache-dir -r requirements.txt

# Copy config
COPY config/ ./config/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S sollarity -u 1001
USER sollarity

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start application
CMD ["node", "server/server.js"]