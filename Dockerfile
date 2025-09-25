# --- Build stage ---
FROM node:19-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the React app (make sure package.json has "homepage": "/api-test-interface")
RUN npm run build


# --- Production stage ---
FROM nginx:alpine

# Copy built React files into Nginx HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Replace default Nginx config with our custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose container port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
