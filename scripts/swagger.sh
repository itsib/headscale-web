#!/bin/bash

set -e
# Bearer rg7UaQ6NQw.VJ8Vv0nBOovrv0JtM3ODoU0k2t9A6zDDcCDD1ERyJAs

PROJECT_ROOT="$(pwd)"
PORT="8080"

docker container rm -f -v swagger 1>&2 2>/dev/null

docker run -p "$PORT:8080" -e SWAGGER_JSON=/swagger/api-swagger-2.0.json -v "$PROJECT_ROOT/swagger:/swagger" --name swagger -d swaggerapi/swagger-ui

echo -e "Swagger Dev Server: http://localhost:8080"
