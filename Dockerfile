FROM node:18-alpine AS development
WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json ./

RUN npm i

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine as production
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm i --production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]