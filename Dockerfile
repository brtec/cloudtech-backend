# syntax=docker/dockerfile:1

# Base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Copy built application from builder stage
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/package*.json ./

# Expose port
EXPOSE 7001

# Start the application
CMD ["node", "dist/main"]
