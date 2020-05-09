FROM mhart/alpine-node:12 as base

RUN apk update && \
    apk upgrade && \
    apk add --no-cache git

RUN mkdir /app
WORKDIR /app

# ------- Get the dependencies

FROM base as deps
# https://stackoverflow.com/questions/33322103/multiple-froms-what-it-means

COPY package.json .
COPY package-lock.json .
RUN NODE_ENV=development npm ci

# ------- SPA Builder image

# FROM deps as build

# COPY src/ ./src
# COPY public/ ./public
# COPY tsconfig.json .
# COPY config-overrides.js .

# RUN NODE_ENV=production npm run build

# ------- Production image

FROM deps

# COPY --from=build ./app/build /app/build
COPY api ./api
COPY controllers ./controllers
COPY models ./models
COPY node_modules ./node_modules
COPY service ./service
COPY utils ./utils
COPY index.js ./index.js

ENV NODE_ENV=production

RUN npm prune --production

CMD ["node", "index.js"]
