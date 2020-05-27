FROM node:12

# Set our Node environment, either development or production.
# docker-compose overrides this to development on build and run.
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN apt-get update && apt-get install -y --no-install-recommends \
    make

WORKDIR /code