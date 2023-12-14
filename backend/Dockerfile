FROM node:alpine AS build
WORKDIR /app

COPY package*.json /app/
RUN npm install --silent
COPY . .

EXPOSE 5002
CMD ["npm", "start"]
