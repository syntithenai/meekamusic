FROM node

#RUN apk add --no-cache bash tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-armhf /tini
RUN chmod +x /tini

EXPOSE 8081

# override some config defaults with values that will work better for docker
ENV ME_CONFIG_EDITORTHEME="default" \
    ME_CONFIG_MONGODB_SERVER="mongo" \
    ME_CONFIG_MONGODB_ENABLE_ADMIN="true" \
    ME_CONFIG_BASICAUTH_USERNAME="" \
    ME_CONFIG_BASICAUTH_PASSWORD="" \
    VCAP_APP_HOST="0.0.0.0"

ENV MONGO_EXPRESS 0.49.0

RUN npm install mongo-express@$MONGO_EXPRESS

COPY docker-entrypoint.sh /

WORKDIR /node_modules/mongo-express

RUN cp config.default.js config.js

ENTRYPOINT [ "/tini", "--", "/docker-entrypoint.sh"]
CMD ["mongo-express"]
