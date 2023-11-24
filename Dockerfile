# Dockerfile

FROM node:18-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /home/app

# install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm i

FROM node:18-alpine AS builder
WORKDIR /home/app

COPY --from=dependencies /home/app/node_modules ./node_modules
COPY . .

ENV NODE_ENV="production"

# build the app
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /home/app

COPY --from=builder /home/app/.next/standalone ./standalone
COPY --from=builder /home/app/public /home/app/standalone/public
COPY --from=builder /home/app/.next/static /home/app/standalone/.next/static

EXPOSE 3000
ENV PORT 3000

# serve the app
CMD ["node", "./standalone/server.js"]