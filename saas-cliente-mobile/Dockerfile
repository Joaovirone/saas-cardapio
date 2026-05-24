FROM node:24-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 19006

CMD ["npm", "run", "web", "--", "--port", "19006", "--host", "lan"]
