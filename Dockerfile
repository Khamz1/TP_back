#Используем обарз линукс Alpine с версией node 14
FROM node:19.5.0-alpine

#Указываем нашу рабочую директорию
WORKDIR /app

#Скопировать package.json||package.json.lock внутрь контейнера
COPY package*.json ./

#Устанавливаем зависимости
RUN npm install

#Копируем все остальное
COPY . .

#Установить Prisma
RUN npm install -g prisma

#Генерируем Prisma-client
RUN prisma generate

#Копируем prisma-scheme
COPY prisma/schema.prisma ./prisma/

#Открываем порт в нашем контейнере
EXPOSE 4000

#Запускаем наш сервер
CMD ["npm","start"]

