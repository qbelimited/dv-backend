###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Install OpenSSL and other necessary build dependencies
RUN apk add --no-cache openssl openssl-dev pkgconfig python3 make g++

# Create necessary directories and set permissions
RUN mkdir -p /usr/src/app/dist \
    && mkdir -p /usr/src/app/src \
    && chown -R node:node /usr/src/app

# Copy application dependency manifests
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

# Install app dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine As build

WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache openssl openssl-dev pkgconfig python3 make g++

# Create necessary directories and set permissions
RUN mkdir -p /usr/src/app/dist \
    && mkdir -p /usr/src/app/src \
    && chown -R node:node /usr/src/app

# Copy package files
COPY --chown=node:node package*.json ./

# Copy node_modules and prisma from development stage
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=development /usr/src/app/prisma ./prisma

# Copy source code
COPY --chown=node:node . .

# Build the application
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Generate Prisma client for production
RUN npx prisma generate

USER node

###################
# PRODUCTION
###################

FROM node:20-alpine As production

# Install OpenSSL - required for Prisma
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /usr/src/app

# Create necessary directories and set permissions
RUN mkdir -p /usr/src/app/dist \
    && mkdir -p /usr/src/app/src \
    && chown -R node:node /usr/src/app

# Copy necessary files from build stage
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

# Copy the generated Prisma client
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Set the user
USER node

# Start the server
CMD [ "node", "dist/src/main.js" ]
