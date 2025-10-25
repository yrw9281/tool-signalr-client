# Multi-stage build for the SignalR Testing Tool frontend
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY src/react-signalr-client/package*.json ./
RUN npm install

# Copy source and build
COPY src/react-signalr-client/ ./
RUN npm run build

# Production image serving static assets via Nginx
FROM nginx:1.27-alpine AS runner

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
