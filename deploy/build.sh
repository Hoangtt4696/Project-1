#!/bin/sh
cd ../
rm -rf ./output && mkdir ./output
pwd
mv backend/bin ./output/
mv backend/connect_db ./output/
mv backend/helper ./output/
mv backend/crons ./output/
mv backend/core ./output/
mv backend/modules ./output/
mv backend/lib ./output/
mv backend/views ./output/
mv backend/middleware ./output/
mv backend/emailservices ./output/
mv backend/config ./output/
mv backend/public ./output/
cp -r frontend/build ./output/public/

cp backend/app.js ./output/
cp backend/config.js ./output/
cp backend/route.js ./output/
cp backend/package.json ./output/



cd ./output/
mkdir ./dotenv
cd ./dotenv/
touch .env