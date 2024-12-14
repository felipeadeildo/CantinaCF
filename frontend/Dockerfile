FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_BACKEND_URL=http://cantinacf-backend:5000

RUN npm run build
