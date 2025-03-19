FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

ARG MY_DATABASE_URL="mongodb://localhost:27017/blog"
ENV DATABASE_URL=$MY_DATABASE_URL

ARG PORT=8080
ENV PORT=$PORT

# Set environment variable to indicate Docker environment
RUN echo "PORT=$PORT" > .env.docker && echo "DATABASE_URL=$MY_DATABASE_URL" >> .env.docker
ENV DOCKER_ENV=true

# Expose the port the app will run on
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]