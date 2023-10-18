FROM node:16

WORKDIR /app

COPY package*.json ./

RUN curl -o chrome-linux64.zip https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/117.0.5938.92/linux64/chrome-linux64.zip

RUN npm install

COPY . .

EXPOSE 3100

CMD ["npm", "run", "start"]