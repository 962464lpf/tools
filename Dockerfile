FROM node:latest
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

#Install dependcy
ENV npm_config_unsafe_perm=true
RUN npm install

CMD npm run serve 
