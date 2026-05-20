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

# Stage 2: Serve with Node.js 'serve'
FROM node:20-alpine

RUN npm install -g serve

# Copy built web assets
COPY --from=builder /app/web-build ./web-build

# Expose typical Cloud Run port
EXPOSE 8080

# Run serve on Cloud Run $PORT (or 8080 default)
CMD serve -s web-build -l tcp://0.0.0.0:${PORT:-8080}
