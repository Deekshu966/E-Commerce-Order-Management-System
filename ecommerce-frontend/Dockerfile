# Angular Frontend Dockerfile
FROM nginx:alpine

# Copy built Angular files
COPY dist/ecommerce-frontend/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
