# 1. Use Node.js official image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install deps
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps


# 4. Copy the rest of your app
COPY . .

# 5. Expose port
EXPOSE 3000

# 6. Run dev server
CMD ["npm", "run", "dev"]
