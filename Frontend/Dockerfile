# Frontend (Next.js), built in 3 stages so the final image is small

# 1. install the packages
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
# npm install (not npm ci), because the package-lock.json made on Windows
# is missing a few Linux packages that Tailwind 4 needs
RUN npm install --no-audit --no-fund

# 2. build the app
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_ variables are written into the code during the build,
# so the backend address must be given here (see docker-compose.yml)
ARG NEXT_PUBLIC_FETCH_URI
ENV NEXT_PUBLIC_FETCH_URI=$NEXT_PUBLIC_FETCH_URI
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# 3. the small image that only runs the app
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# needs  output: "standalone"  in next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]