FROM node:20

WORKDIR /app
COPY ./retail-backend/package*.json ./
RUN npm install
COPY ./retail-backend/ .
EXPOSE 3000
CMD ["npm", "run", "start"]  # Use your production start script here
