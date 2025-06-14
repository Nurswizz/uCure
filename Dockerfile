# === Stage 1: Build client ===
FROM node:18 AS builder

WORKDIR /app

# Копируем весь проект
COPY . .

# Устанавливаем зависимости из корневого package.json
RUN npm install

# Собираем клиент (билд окажется в ./dist)
RUN npm run build

# === Stage 2: Production server ===
FROM node:18

WORKDIR /app

# Копируем всё, кроме node_modules и dist
COPY --chown=node:node . .

# Устанавливаем только прод-зависимости
RUN npm install --omit=dev

# Копируем собранный фронтенд из корня в public
COPY --from=builder /app/dist ./server/public

# Переходим в директорию сервера
WORKDIR /app/server

# Запуск
CMD ["npm", "start"]
