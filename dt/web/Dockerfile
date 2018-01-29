FROM node:8

RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    apt-get install -y git curl



WORKDIR /usr/app

RUN mkdir -p /usr/app

COPY package.json /usr/app

RUN npm i

RUN npm install web3@^1.0.0-beta.25
RUN npm install --build-from-source bcrypt

COPY . /usr/app

CMD ["npm", "run", "start"]
