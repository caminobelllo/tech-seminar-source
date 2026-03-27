FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src/ ./src/
ENV APP_ENV=dev
ENV APP_VERSION=v1
EXPOSE 3000
CMD ["node", "src/index.js"]