FROM node:21 as build-step
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build
CMD [ "npm", "start" ]