FROM node:10.15-alpine

# install dependencies
WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm cache clean --force && npm install

# copy app source to image after npm install so that
# application code changes don't bust the docker cache of npm install step
COPY . /opt/app
COPY /client/build /opt/app/client/build

# set application PORT and expose docker PORT
ENV PORT 3312
ENV NODE_ENV="production"
ENV DB_HOST = "35.239.45.2"
ENV PRODUCTION_DB = "ovnis"
ENV DB_WRITE_1_USR = "ovnis-write"
ENV DB_WRITE_1_PWD = "ge3KBK3Ae#aFp$6J"
ENV DB_READ_1_USR = "ovnis-read"
ENV DB_READ_1_PWD = "B&7mFLj*Q33vmceq"

EXPOSE 3312

CMD [ "npm", "run", "start" ]
