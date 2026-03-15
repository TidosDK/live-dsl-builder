FROM node:25.8.1-alpine3.23 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:25.8.1-alpine3.23 AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/server.js ./
COPY --from=builder /app/views ./views
COPY --from=builder /app/public ./public

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]
