# Use the official Node.js image as the base image
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]