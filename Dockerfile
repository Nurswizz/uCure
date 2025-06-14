# === Stage 1: Build Frontend ===
FROM node:20 AS client-builder

WORKDIR /app

COPY client ./client
COPY package.json package-lock.json ./

# Устанавливаем зависимости только для клиента
RUN cd client && npm install && npm run build

# === Stage 2: Build Backend + Copy Frontend Build ===
FROM node:20 AS server

WORKDIR /app

COPY server ./server
COPY package.json package-lock.json ./

# Устанавливаем только production-зависимости
RUN npm install --only=production

# Копируем билд фронтенда внутрь сервера (если он его раздаёт)
COPY --from=client-builder /app/client/dist ./server/public

# Указываем рабочую директорию как server
WORKDIR /app/server

# Открываем порт
EXPOSE 3000

CMD ["node", "index.js"]
