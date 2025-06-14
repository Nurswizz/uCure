# 1. Базовый образ с Node.js
FROM node:18

# 2. Рабочая директория внутри контейнера
WORKDIR /app

# 3. Копируем package.json и package-lock.json
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем остальные файлы проекта
COPY . .

# 6. Собираем проект
RUN npm run build

# 7. Указываем переменную окружения
ENV NODE_ENV=production

# 8. Открываем порт (если у тебя используется 5000)
EXPOSE 5000

# 9. Команда запуска
CMD ["npm", "start"]
