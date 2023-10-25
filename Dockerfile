FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm config set registry http://registry.npmjs.org

RUN npm cache clean -f

RUN npm ci

COPY . .

RUN npm run test

EXPOSE 3123

CMD ["npm", "run", "start"]