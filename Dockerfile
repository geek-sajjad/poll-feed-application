FROM node:22-alpine
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
RUN yarn install

# Copy source code and startup script
COPY . .
COPY start.sh ./
RUN chmod +x start.sh

# Build the application
RUN yarn build

EXPOSE 8000
CMD ["./start.sh"]