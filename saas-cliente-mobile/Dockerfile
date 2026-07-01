FROM node:22-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

EXPOSE 19006

CMD ["sh", "-c", "CI=1 npm run web -- --port 19006 --host lan"]
