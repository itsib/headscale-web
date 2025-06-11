ARG VERSION=0.9.11
FROM node:20.17-slim AS builder

COPY package.json \
     package-lock.json \
     /usr/web/

WORKDIR /usr/web/
RUN npm install -g npm@latest && npm ci

COPY public/ /usr/web/public/
COPY src/ /usr/web/src/
COPY icons/ /usr/web/icons/
COPY scripts/copy.mjs /usr/web/scripts/
COPY tailwind.config.ts \
     tsconfig.* \
     vite.config.ts \
     icon-font.json \
     index.html \
     manifest.webmanifest \
     healthcheck \
     LICENSE \
     README.md \
     /usr/web/

RUN npm run build

FROM rtsp/lighttpd AS production
ARG VERSION

WORKDIR /var/www/html

RUN rm -rf ./*

COPY --from=builder /usr/web/dist .
COPY --from=builder /usr/web/healthcheck /usr/bin/healthcheck
COPY ./lighttpd.conf /etc/lighttpd/lighttpd.conf

ENV PORT=80
ENV VERSION=${VERSION}

ENTRYPOINT ["/usr/sbin/lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]

