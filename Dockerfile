FROM node:21-alpine as base

WORKDIR /opt/luma
COPY package.json .
COPY kitres-*.tgz .
RUN npm install --omit=dev

FROM node:21-alpine as compile
RUN npm install -g typescript

COPY --from=base /opt/luma /opt/luma
WORKDIR /opt/luma

COPY . .
RUN npm install
RUN tsc | echo "OK"
RUN node build/kconst/index.js --mode prod
RUN tsc | echo "OK"
# RUN rm -rf node_modules


FROM node:21-alpine as final

VOLUME ["/var/lib/luma"]
ENV RUNNING_LOCATION=DOCKER_HOST
EXPOSE 3210

RUN apk update
RUN apk add --no-cache dcron
RUN apk add --no-cache bash


RUN echo 'http://dl-cdn.alpinelinux.org/alpine/edge/main' > /etc/apk/repositories
RUN apk update --allow-untrusted
RUN apk upgrade --allow-untrusted
RUN apk add postgresql17-client --allow-untrusted

COPY --from=compile /opt/luma /opt/luma
# COPY --from=base /opt/luma/node_modules /opt/luma/node_modules
WORKDIR /opt/luma
RUN chmod +x bin/*.sh
ENTRYPOINT [ "/opt/luma/bin/entrypoint.sh" ]






