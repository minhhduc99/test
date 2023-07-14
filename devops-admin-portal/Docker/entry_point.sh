#!/bin/sh
NODE_ENV=$NODE_ENV npm start & $(npm bin)/ng serve --configuration=$NODE_ENV --host 0.0.0.0
