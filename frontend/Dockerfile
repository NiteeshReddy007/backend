FROM node:alpine AS build
WORKDIR /app

COPY package*.json /app/
RUN npm install --silent
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
