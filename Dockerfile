FROM node:16.14.2

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000
ENTRYPOINT ["npm", "start"]