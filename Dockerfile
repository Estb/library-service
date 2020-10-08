FROM node:12
WORKDIR /node-app
COPY package.json .
RUN yarn install --quiet
COPY . .
EXPOSE 3000
CMD [ "yarn", "start"]