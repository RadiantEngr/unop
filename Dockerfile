FROM node:v16
LABEL Unox Developers <developers@unox.one>
RUN mkdir -p /unox-api && \
    mkdir -p /logs 
RUN cd /unox-api && rm -rf *
WORKDIR /unox-api
ADD package.json /unox-api/package.json
ADD yarn.lock /unox-api/yarn.lock
RUN yarn && \
    yarn global add pm2
COPY . /unox-api
RUN yarn tsc
EXPOSE 4000
RUN chown -R appuser:appuser /logs && \
    chown -R appuser:appuser /unox-api
USER appuser
CMD [ "node", "dist/server.js" ]
