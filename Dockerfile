# === Stage 1: Build client ===
FROM node:18 AS builder

WORKDIR /app

# Копируем весь проект
COPY . .

# Устанавливаем зависимости из корневого package.json
RUN npm install

# Собираем клиент — в client/dist
RUN npm run build

# === Stage 2: Production server ===
FROM node:18

WORKDIR /app

# Копируем всё, кроме node_modules и dist (оптимизация)
COPY --chown=node:node . .

# Устанавливаем только необходимые зависимости
RUN npm install --omit=dev

# Копируем собранный фронтенд в public/ (или куда указывает сервер)
COPY --from=builder /app/client/dist ./server/public

# Переходим в директорию сервера
WORKDIR /app/server

# Запуск сервера
CMD ["npm", "start"]
