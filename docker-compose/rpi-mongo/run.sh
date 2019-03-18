docker run -d --name mongo -p 9405:27017 \
           -v /media/usbraid/docker/mongo/data/db:/data/db \
           -v /media/usbraid/docker/mongo/data/configdb:/data/configdb \
           paperinik/rpi-mongo
