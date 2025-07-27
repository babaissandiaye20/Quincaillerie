FROM node:20-alpine AS builder

WORKDIR /app

# Install Python, make, g++, et OpenSSL
RUN apk add --no-cache python3 make g++ openssl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application (adapter si pas de build script)
# RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install PostgreSQL client et OpenSSL
RUN apk add --no-cache postgresql-client openssl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy Prisma schema
COPY prisma ./prisma/

# Copy built application from builder stage (adapter si pas de dist/)
COPY --from=builder /app/src ./src
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# COPY public ./public  # supprimé car le dossier n'existe pas

# Expose the port the app runs on
EXPOSE 3001

# Add wait-for-it script
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Command to run the application
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && node src/app.js"]

# Add volume for the application and node_modules
VOLUME ["/app/src", "/app/node_modules"] 