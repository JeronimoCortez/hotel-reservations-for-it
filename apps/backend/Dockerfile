
# Stage 1: build (requires repo-root context)
FROM node:20 AS builder
WORKDIR /repo

COPY domain/package*.json domain/
COPY domain/tsconfig.json domain/
COPY domain/jest.config.js domain/

COPY apps/backend/package*.json apps/backend/
COPY apps/backend/tsconfig.json apps/backend/

RUN npm ci --prefix domain
RUN npm ci --prefix apps/backend

COPY domain/src domain/src
COPY apps/backend/src apps/backend/src

RUN npm --prefix apps/backend run build

# Stage 2: runtime lightweight
FROM node:20-slim AS runtime
WORKDIR /repo/apps/backend
ENV NODE_ENV=production

COPY --from=builder /repo/apps/backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /repo/apps/backend/dist ./dist
COPY --from=builder /repo/domain/dist /repo/domain/dist

EXPOSE 4000
CMD ["node", "dist/server.js"]
