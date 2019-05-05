FROM node:10.15 as build-deps
WORKDIR /opt/app/client
COPY /client/package.json /client/package-lock.json* /opt/app/client
RUN npm cache clean --force && npm install
COPY /client /opt/app/client
RUN npm run build

FROM node:10.15-alpine
# install dependencies
WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm cache clean --force && npm install

# copy app source to image after npm install so that
# application code changes don't bust the docker cache of npm install step
COPY . /opt/app
COPY --from=build-deps /opt/app/client/build /opt/app/client/build

# set application PORT and expose docker PORT
ENV PORT 3312
ENV NODE_ENV="production"

EXPOSE 3312

CMD [ "npm", "run", "start" ]
