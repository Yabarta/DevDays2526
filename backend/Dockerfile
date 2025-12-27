# Use official Node.js image
FROM node:24-alpine

# Set working directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# Expose the port (default 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]