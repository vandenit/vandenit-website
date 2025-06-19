FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install specific pnpm version
RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/download/v8.6.12/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install specific pnpm version in builder stage
RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/download/v8.6.12/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Add build-time environment variables for TinaCMS
ARG NEXT_PUBLIC_TINA_CLIENT_ID
ARG TINA_TOKEN
ARG NEXT_PUBLIC_TINA_BRANCH=main
ARG TINA_SEARCH_TOKEN

ENV NEXT_PUBLIC_TINA_CLIENT_ID=${NEXT_PUBLIC_TINA_CLIENT_ID}
ENV TINA_TOKEN=${TINA_TOKEN}
ENV NEXT_PUBLIC_TINA_BRANCH=${NEXT_PUBLIC_TINA_BRANCH}
ENV TINA_SEARCH_TOKEN=${TINA_SEARCH_TOKEN}

RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"] 