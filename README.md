## uCare

uCare — это одностраничное приложение, позволяющее пользователю загрузить фото или описать симптомы, чтобы мгновенно получить анализ состояния здоровья. Система оценивает срочность обращения к врачу и потенциальные последствия, используя возможности GPT (OpenAI) для интерпретации симптомов. Это цифровой «терапевт на входе» — безопасный, быстрый и умный.

## Стек технологий
Frontend: React + Vite (TypeScript)

Backend: Express (TypeScript)

AI Engine: OpenAI GPT (chat/completion API)

Storage: временное хранение в памяти

Деплой:  Railway using Docker

Vibecoded by Replit, debugged by me

## Структура проекта
```
/client
  /src
    /components
    /pages
    /hooks
    /lib
    App.tsx
    main.tsx
    index.css
  index.html
  vite.config.ts

/server
  routes.ts
  storage.ts          
  /services
    auth.ts
    openai.ts
  index.ts
  tsconfig.json
  vite.ts
```
##  Установка и запуск
```
# Клонируем репозиторий
git clone https://github.com/Nurswizz/uCare.git
cd uCare

# Установка клиентских зависимостей
cd client
npm install

# Установка серверных зависимостей
cd ../server
npm install

# Запуск клиента
npm run dev

# Запуск сервера
cd ../server
npm run dev
```

Не забудьте создать .env файл в папке server/ с переменной:

```
OPENAI_API_KEY=your_openai_key_here
```
