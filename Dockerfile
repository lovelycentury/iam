# syntax=docker/dockerfile:1.7
#
# @okkly/iam — Keycloak login theme (Keycloakify). A Keycloakify project does
# not run as its own web server: it compiles to a Keycloak provider JAR. So
# this image IS Keycloak, with the theme baked in; iam.okkly.dev points here.
#
#   docker build -t iam .
#   docker run -p 8080:8080 \
#     -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=... \
#     -e KC_HOSTNAME=iam.okkly.dev -e KC_PROXY_HEADERS=xforwarded \
#     -e KC_DB=postgres -e KC_DB_URL=... -e KC_DB_USERNAME=... -e KC_DB_PASSWORD=... \
#     iam
#
# `pnpm build-keycloak-theme` = `vite build` then `keycloakify build`, which
# emits dist_keycloak/*.jar. The Keycloak version is pinned to match
# vite.config.ts -> keycloakify({ startKeycloakOptions.dockerImage }).

FROM node:22-slim AS build
# .dockerignore drops .git, so the `prepare` script's simple-git-hooks would
# find no repo to install into and log a misleading [ERROR] (it exits 0, so the
# build survives either way). Nothing here commits, so skip it outright.
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    CI="true" \
    SKIP_INSTALL_SIMPLE_GIT_HOOKS="1"
# keycloakify shells out to two JVM tools while packaging the provider JAR:
# `mvn` to build it and `keytool` to sign it. Debian calls the first package
# `maven`, not `mvn` as keycloakify's own error message suggests.
RUN apt-get update \
    && apt-get install -y --no-install-recommends default-jre-headless maven \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable
WORKDIR /repo

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm fetch

COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline
RUN pnpm run build-keycloak-theme

FROM quay.io/keycloak/keycloak:26.7.2 AS runtime
COPY --from=build /repo/dist_keycloak/*.jar /opt/keycloak/providers/

# Build-time options have to be fixed here, not at `docker run`: `start
# --optimized` refuses to boot if a build option differs from what this step
# persisted ("build time options have values that differ..."). Everything else
# — hostname, DB url, credentials — stays a runtime env var.
ENV KC_DB=postgres \
    KC_HEALTH_ENABLED=true
RUN /opt/keycloak/bin/kc.sh build

# 8080 serves the app, 9000 the management interface (/health/ready).
EXPOSE 8080 9000
# Base image's ENTRYPOINT is /opt/keycloak/bin/kc.sh already.
CMD ["start", "--optimized"]
