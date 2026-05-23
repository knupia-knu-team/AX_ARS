# ═══════════════════════════════════════════════════════════
# Stage 1: Build Frontend React Client
# ═══════════════════════════════════════════════════════════
FROM node:20-alpine AS client-build
WORKDIR /app

# Copy package descriptors and install dependencies
COPY client/package.json ./client/
RUN cd client && npm install

# Copy source and build
COPY client/ ./client/
COPY shared/ ./shared/
RUN npm run build --prefix client

# ═══════════════════════════════════════════════════════════
# Stage 2: Build Backend Express Server
# ═══════════════════════════════════════════════════════════
FROM node:20-alpine AS server-build
WORKDIR /app

# Copy package descriptors and install dependencies
COPY server/package.json ./server/
RUN cd server && npm install

# Copy source and build
COPY server/ ./server/
COPY shared/ ./shared/
RUN npm run build --prefix server

# ═══════════════════════════════════════════════════════════
# Stage 3: Final Production Runner
# ═══════════════════════════════════════════════════════════
FROM node:20-alpine
WORKDIR /app

# Copy compiled assets from Stage 1 & Stage 2
COPY --from=client-build /app/client/dist ./client/dist
COPY --from=server-build /app/server/dist ./server/dist
COPY --from=server-build /app/server/package.json ./server/

# Install only production dependencies
RUN cd server && npm install --omit=dev

# Set environment
ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

# Run Express server
CMD ["node", "server/dist/index.js"]
