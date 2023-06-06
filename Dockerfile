FROM node:18.13.0

WORKDIR /app
COPY package*.json ./
COPY ./ ./

RUN npm install
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]