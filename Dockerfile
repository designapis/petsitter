FROM mhart/alpine-node:12 as base

RUN apk update && \
    apk upgrade && \
    apk add --no-cache git

# ------- Get the dependencies
FROM base as backend-deps

RUN mkdir -p /backend
WORKDIR /backend

COPY backend/package.json .
COPY backend/package-lock.json .

RUN NODE_ENV=development npm ci

# ------- Frontend (SPA) Builder image

FROM base as frontend

COPY frontend /frontend
WORKDIR /frontend
RUN NODE_ENV=development npm ci
RUN NODE_ENV=production npm run build

# ------- Production image
FROM base

COPY backend /app
WORKDIR /app

COPY --from=frontend /frontend/build /app/build
COPY --from=backend-deps /backend/node_modules /app/node_modules

ENV NODE_ENV=production
RUN npm prune --production

CMD ["node", "index.js"]
