# Multi-stage build for production
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies without running lifecycle scripts (avoid husky in container)
RUN npm ci --ignore-scripts && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Remove dev dependencies for production
RUN npm prune --omit=dev

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S antrai -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=antrai:nodejs /app/dist ./dist
COPY --from=builder --chown=antrai:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=antrai:nodejs /app/package*.json ./
COPY --from=builder --chown=antrai:nodejs /app/prisma ./prisma

# Create logs and uploads directories with proper permissions
RUN mkdir -p /app/logs /app/uploads && chown -R antrai:nodejs /app/logs /app/uploads

# Switch to non-root user
USER antrai

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/app.js"]


