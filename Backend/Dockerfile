# Backend (Node.js + Express)
FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

# 1. install only the production packages (this step is cached until package files change)
COPY package*.json ./
RUN npm ci --omit=dev

# 2. copy the code
COPY --chown=node:node . .

# multer saves uploaded files in public/temp before they go to Cloudinary
RUN mkdir -p public/temp && chown -R node:node public

# 3. run as a normal user, not as root
USER node

EXPOSE 8000
CMD ["node", "src/index.js"]