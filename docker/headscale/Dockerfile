FROM headscale/headscale:v0.29.0 AS source

ENTRYPOINT []

FROM ubuntu:24.04 AS production

RUN apt-get update && \
    apt-get -y install ca-certificates openssl && \
    update-ca-certificates

COPY --from=source /ko-app/headscale /usr/bin/
COPY --chmod=0775 ./scripts/* /usr/bin/

CMD ["docker-run"]