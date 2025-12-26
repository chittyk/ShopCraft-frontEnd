# Use Node 20+ (compatible with latest Vite and React Router)
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose Vite dev port
EXPOSE 5174

# Run the Vite development server on all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
