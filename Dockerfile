# Simple production Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY server server
RUN npm ci
COPY client/public client/public
RUN npm run build:server

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/dist server/dist
COPY --from=build /app/client/public client/public
RUN npm prune --omit=dev
EXPOSE 3000
CMD ["node", "server/dist/index.js"]
