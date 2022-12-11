# ================ #
#    Base Stage    #
# ================ #
FROM --platform=linux/amd64 node:18-buster-slim AS base

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
FROM base AS builder

WORKDIR /app

COPY .gitignore .gitignore
COPY .yarnrc.yml .yarnrc.yml
COPY .yarn .yarn
COPY --from=base /app/out/json/ .
COPY --from=base /app/out/yarn.lock ./yarn.lock

RUN yarn install

COPY --from=base /app/out/full/ .
COPY turbo.json turbo.json
COPY tsup.config.js tsup.config.js
RUN yarn turbo run build --filter=@evie/bot...


# ================ #
#   Runner Stage   #
# ================ #
FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 evie
RUN adduser --system --uid 1001 evie

USER evie

COPY --from=builder /app .

WORKDIR /app/apps/bot

ENV NODE_OPTIONS="--enable-source-maps"

CMD node dist/index.js
