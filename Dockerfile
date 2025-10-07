# Simple production Dockerfile
###############################################
# Base deps stage (installs ALL dependencies)
###############################################
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY server/package.json server/
# Install with dev deps so TypeScript build tools are available
RUN npm ci --workspaces

###############################################
# Build stage (compile TypeScript)
###############################################
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY package.json package-lock.json* ./
COPY server/package.json server/
COPY server server
COPY client/public client/public
RUN npm run build

# Prune devDependencies to shrink runtime image
RUN npm prune --omit=dev --workspaces

###############################################
# Runtime stage (only production deps + built output)
###############################################
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/server/package.json server/
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/node_modules ./server/node_modules
COPY --from=build /app/server/dist server/dist
COPY --from=build /app/client/public client/public
EXPOSE 3000
CMD ["node", "server/dist/index.js"]
