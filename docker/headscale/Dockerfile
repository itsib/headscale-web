FROM headscale/headscale AS headscale

ENTRYPOINT []

FROM ubuntu:latest

RUN apt-get update && \
    apt-get -y install ca-certificates openssl && \
    update-ca-certificates

COPY --from=headscale /ko-app/headscale /usr/bin/
COPY --chmod=0775 ./scripts/* /usr/bin/

CMD ["docker-run"]