FROM node:10.15
WORKDIR /usr/src/app
COPY package*.json index.js ./
RUN npm install
EXPOSE 8011
CMD ["node", "index.js"]