# Stage 1: Build Expo web bundle
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files from the mobile directory
COPY mobile/package*.json ./
RUN npm ci

# Copy all mobile directory contents
COPY mobile/ .

# Export web build using the local npx cli (much faster and highly optimized)
RUN npx expo export --platform web --output-dir web-build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built web assets to Nginx html directory
COPY --from=builder /app/web-build /usr/share/nginx/html

# Expose typical Cloud Run port (8080)
EXPOSE 8080

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
