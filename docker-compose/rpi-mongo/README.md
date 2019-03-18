# Mongo

![docker_logo](https://raw.githubusercontent.com/brunocantisano/rpi-mongo/master/files/docker.png)![docker_mongo_logo](https://raw.githubusercontent.com/brunocantisano/rpi-mongo/master/files/logo-mongo.png)![docker_paperinik_logo](https://raw.githubusercontent.com/brunocantisano/rpi-mongo/master/files/docker_paperinik_120x120.png)

This Docker container implements Mongo Database Server on Raspberry pi.

 * Raspbian base image: [resin/rpi-raspbian](https://hub.docker.com/r/resin/rpi-raspbian/)
 * Mongo database v3.0.9
 * MongoDB shell version: 3.0.9
 
### Installation from [Docker registry hub](https://registry.hub.docker.com/u/paperinik/rpi-mongo/).

You can download the image with the following command:

```bash
docker pull paperinik/rpi-mongo
```

# How to use this image

Exposed ports and volumes
----

The image exposes ports: `27017` (process) and `28017` (http). Also, exports two volumes: `/data/db`, which contains mongo database and `/data/configdb` which contains mongo config files.

Use cases
----

1) Run a container with a binded data directory:
```bash
docker run -d --name mongo -p 9405:27017 \
           -v /media/usbraid/docker/mongo/db:/data/db \
           -v /media/usbraid/mongo/configdb:/data/configdb \
           paperinik/rpi-mongo
```
----

2) Get the mongo version running in the container:
```bash
docker run -it paperinik/rpi-mongo mongod --version
```
----
