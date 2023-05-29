# Fetching Node
FROM node:18-alpine3.16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the app will run on
EXPOSE 3000
EXPOSE 5173


# Set the ARG with a default value
ARG PUB_FRONTEND_PRODUCTS_URL=default_value
ARG PUB_FRONTEND_USERS_URL=default_value
ARG PUB_FRONTEND_NOTIFICATIONS_URL=default_value

# Set the environment variable using the ARG value
ENV PUB_FRONTEND_PRODUCTS_URL=$PUB_FRONTEND_PRODUCTS_URL
ENV PUB_FRONTEND_USERS_URL =$PUB_FRONTEND_USERS_URL
ENV PUB_FRONTEND_NOTIFICATIONS_URL =$PUB_FRONTEND_NOTIFICATIONS_URL


# Start the application
CMD ["npm", "run", "dev"]
