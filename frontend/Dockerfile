FROM node:20-alpine AS builder
WORKDIR /app

# FIX: aceita VITE_API_URL como build arg para ser baked no bundle pelo Vite
ARG VITE_API_URL=https://artelli-backend.onrender.com/api
ARG VITE_WHATSAPP_NUMBER=5511992216409
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
