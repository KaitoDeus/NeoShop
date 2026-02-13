# Stage 1: Development
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]

# Stage 2: Build
FROM dev AS build
RUN npm run build

# Stage 3: Production
FROM nginx:stable-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
RUN echo 'server { \
    listen 3000; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
