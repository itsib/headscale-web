# Build image: docker build
FROM node:20.17-slim AS builder
WORKDIR /app

COPY . .

RUN npm install --frozen-lockfile && \
    npm run build && \
    rm -rf node_modules

# Production image
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /var/www
COPY ./docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]