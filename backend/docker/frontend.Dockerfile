# Build stage
FROM node:20 AS build
WORKDIR /app
COPY ./retail-front-end/package*.json ./
RUN npm install
COPY ./retail-front-end/ .
RUN npm run build

# Production stage (serve with nginx)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
