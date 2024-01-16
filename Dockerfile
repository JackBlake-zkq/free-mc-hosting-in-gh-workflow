FROM eclipse-temurin:21-jre-alpine
RUN apk update && apk add npm
COPY package*.json *.*js ./
COPY --from=node:20-alpine3.18 /usr/local/bin/ /usr/local/bin/
RUN npm ci
CMD node server_wrapper.mjs