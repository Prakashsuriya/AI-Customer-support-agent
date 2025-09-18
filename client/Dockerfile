# Stage 1: Build the React application
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the application using a lightweight server
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 and start nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
