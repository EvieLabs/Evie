FROM node:18 as builder

WORKDIR /app

COPY . .

RUN --mount=type=cache,target=/app/.yarn/cache \
    npx turbo prune --scope=@evie/bot && \
    cp -R .yarn .yarnrc.yml tsup.config.js out/ && \
    cd out && \
    yarn install && \
    yarn turbo run build --filter=@evie/bot && \
    rm -rf node_modules/.cache .yarn/cache


FROM node:18 as app

ENV NODE_ENV=production
WORKDIR /app
COPY --chown=node:node --from=builder /app/out .

WORKDIR /app/apps/bot
USER 1000

ENV NODE_OPTIONS="--enable-source-maps"
CMD ["yarn", "start"]