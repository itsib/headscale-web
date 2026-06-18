FROM caddy:2.11.4-builder-alpine AS builder

RUN xcaddy build \
    --with github.com/caddyserver/transform-encoder@ba41249

FROM caddy:2.11.4-alpine AS production

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
