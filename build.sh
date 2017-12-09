#!/bin/bash


wget https://github.com/mwolszleger/testbuild/archive/master.zip

unzip master.zip
rm master.zip

cd testbuild

docker stop schedule
docker rm schedule
npm install
docker build -t testbuild . 

cd ..
rm -R testbuild

echo "Running docker container..."
docker run -p 8080:8080 -d testbuild
