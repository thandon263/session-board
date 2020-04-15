#!/usr/bin/env bash
npm install
echo "Thank you for running `npm install` to Continue,"
echo "Please Enter Password To Install Knex [Global]: "
sudo npm i -g knex
brew services restart postgresql
knex migrate:latest
npm run watch
