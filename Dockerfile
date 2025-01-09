FROM caddy:2.8-builder AS caddy-builder

RUN xcaddy build \
    --with github.com/caddyserver/transform-encoder

COPY Caddyfile /tmp/Caddyfile

FROM node:20.17-slim AS node-builder

WORKDIR /app

COPY . .
RUN npm install -g npm@latest && \
    npm install --frozen-lockfile && \
    npm run build

FROM caddy:2.8-alpine

WORKDIR /srv

RUN rm -rf ./*

COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy
COPY --from=caddy-builder /tmp/Caddyfile /etc/caddy/Caddyfile
COPY --from=node-builder /app/dist .

EXPOSE 80
EXPOSE 443
EXPOSE 443/udp

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

