FROM node:20-alpine AS base

# Install fontconfig and fonts for sharp/librsvg text rendering (avoids tofu boxes)
RUN apk add --no-cache fontconfig ttf-dejavu font-noto font-noto-arabic ttf-freefont && fc-cache -f

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm install

# Copy source code and build
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

# Expose port 3000
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
