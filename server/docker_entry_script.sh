#!/bin/bash

./wait-for-it.sh db:3306 --strict -- echo 'Database is ready'
npx sequelize-cli db:migrate
sleep 15
npm run start
