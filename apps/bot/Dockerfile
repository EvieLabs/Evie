# ================ #
#    Setup Stage   #
# ================ #
FROM --platform=linux/amd64 node:18-buster-slim AS builder

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential python3 libfontconfig1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@evie/bot --docker


# ================ #
#   Builder Stage  #
# ================ #
FROM --platform=linux/amd64 node:18-buster-slim AS installer
RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential python3 libfontconfig1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY .yarnrc.yml .yarnrc.yml
COPY .yarn .yarn
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
COPY tsup.config.js tsup.config.js
RUN yarn turbo run build --filter=@evie/bot...


# ================ #
#   Runner Stage   #
# ================ #

FROM --platform=linux/amd64 node:18-buster-slim AS runner

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential python3 libfontconfig1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 evie
RUN adduser --system --uid 1001 evie
USER evie
COPY --from=installer /app .

WORKDIR /app/apps/bot

ENV NODE_OPTIONS="--enable-source-maps"
CMD node dist/index.js
