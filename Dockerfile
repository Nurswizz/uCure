# === Stage 1: Build app ===
FROM node:18 AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной проект
COPY . .

# Билдим клиент и сервер
RUN npm run build

# === Stage 2: Production image ===
FROM node:18 AS runner

WORKDIR /app

# Копируем только то, что нужно
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./public

# Устанавливаем только прод зависимости
RUN npm install --omit=dev

# Стартуем сервер
CMD ["npm", "start"]
