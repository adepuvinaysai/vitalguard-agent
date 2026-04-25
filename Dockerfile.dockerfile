# Step 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:stable-alpine
# Copy the build output to nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]