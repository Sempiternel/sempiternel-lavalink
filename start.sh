#!/bin/sh

yarn install
pm2 start . --name "sempiternel" --watch