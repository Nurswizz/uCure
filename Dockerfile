# Build React client
FROM node:18 AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Build Express server
FROM node:18 AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ .

# Copy React build to server public directory
COPY --from=client-build /app/client/build ./public

# Expose and run server
EXPOSE 5000
CMD ["npm", "start"]