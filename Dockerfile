FROM node:20.17-slim AS builder

WORKDIR /app

COPY . .
RUN npm install -g npm@latest && \
    npm install --frozen-lockfile && \
    npm run build

FROM nginx:1.27-alpine

COPY --from=builder /app/dist /var/www
COPY --from=builder /app/nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]