FROM node:20.17-slim AS builder

WORKDIR /app

COPY . .
RUN npm install -g npm@latest && \
    npm install --frozen-lockfile && \
    npm run build

FROM caddy:2.8-alpine

WORKDIR /usr/share/caddy

RUN rm -rf ./*

COPY --from=builder /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist .

