# Stage 1: build Vue client
FROM node:20-alpine AS client-build
WORKDIR /build
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client ./client
RUN cd client && npm run build

# Stage 2: production server
FROM node:20-alpine AS production
RUN apk add --no-cache curl
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev
COPY server ./server
COPY --from=client-build /build/client/dist ./server/public
ENV NODE_ENV=production
EXPOSE 3000
ARG VERSION=dev
LABEL org.opencontainers.image.version=$VERSION
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
CMD ["node", "server/index.js"]
