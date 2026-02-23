# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# SPA 라우팅 대응 및 API 프록시를 위한 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/public /usr/share/nginx/html/public
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
