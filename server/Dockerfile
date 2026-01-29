# ============================================================================
# Dockerfile - SequelString API Server
# ============================================================================
# Build: docker build -t sequelstring-api .
# Run:   docker run -p 4000:4000 sequelstring-api
# ============================================================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --only=production=false

# Copy source and build
COPY . .
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# Stage 2: Production
FROM node:20-alpine AS production

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nodeuser:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeuser:nodejs /app/package*.json ./

# Environment
ENV NODE_ENV=production
ENV PORT=4000

# Expose port
EXPOSE 4000

# Switch to non-root user
USER nodeuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000/api/v1/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start application
CMD ["node", "dist/index.js"]
