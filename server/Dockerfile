# Use the Node.js LTS base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code to the working directory
COPY . .

# Expose the application port (replace 3000 with your app's port if different)
EXPOSE 80

# Define the command to run the application
CMD ["npm", "start"]
