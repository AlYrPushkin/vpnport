FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY . .

RUN yarn build || npm run build || pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

COPY --from=builder --chown=nuxtjs:nodejs /app/.output /app/.output
COPY --from=builder --chown=nuxtjs:nodejs /app/package.json /app/package.json

RUN \
  if [ -f yarn.lock ]; then yarn install --production --frozen-lockfile --ignore-scripts && yarn cache clean; \
  elif [ -f package-lock.json ]; then npm ci --only=production --ignore-scripts && npm cache clean --force; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --prod --frozen-lockfile --ignore-scripts && pnpm store prune; \
  fi

# Создаем папку logs с правильными правами для логирования посетителей
RUN mkdir -p /app/logs && chown -R nuxtjs:nodejs /app/logs

USER nuxtjs

EXPOSE 3000

ENV NODE_ENV=production
ENV NITRO_PRESET=node-server
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]