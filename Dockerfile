# Base stage
FROM node:16.17-alpine AS base

# Development stage
FROM base AS development

WORKDIR /usr/src/node
COPY package*.json ./
RUN NODE_ENV=development && npm ci && npm cache clean --force

WORKDIR /usr/src/node/app
COPY . .

ENV SERVER_PORT=3000
EXPOSE $SERVER_PORT 9229

CMD ["npm", "run", "start:dev"]

# Source stage
FROM base AS source

WORKDIR /usr/src/node/app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .

# Production stage
FROM source AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV SERVER_PORT=3000

EXPOSE $SERVER_PORT
CMD [ "npm", "run", "start:prod" ]
