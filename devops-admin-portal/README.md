== DevOps Admin Portal ==

Copyright (c) 2022 SVMC / Service Operation P.

===================================
# Local test

#### Install
```
npm install
```
Should install on Ubuntu environment.
#### run BE
```
export JWT_SECRET=<a number> #set secret to encrypt jwt
npm start
```
#### run FE
```
./node_modules/.bin/ng serve
```

# Deploy to Staging server

clone project
move to project_folder
check if base_url in src/environments/environment.stg.ts is correct? input server's IP address to base_url if it is needed
`npm install`
`npm install pm2 -g`
`ng build --configuration=staging`
`pm2 start env_staging.config.js`

#Open web client from browser

Open `localhost:4200` for local (dev)

Open `server_ip:3000` for staging / production

# Server

Required environment variables
- JWT_SECRET=secret_to_encrypt_jwt
- SEND_EMAIL_USERNAME=username_to_authen_email_service -> not needed for now
- SEND_EMAIL_PASSWORD=password_to_authen_email_service -> not needed for now
- APP_COMMIT_VERSION=commit_id
(added from version 0.10.2)
- CIP_AUTHEN_URL
- CIP_AUTHEN_APPNAME
- KEYCLOAK_URL
- KEYCLOAK_REALM

username must be something like something/username or ./username or /username
## Start server

Run `npm start`

Run `NODE_ENV=staging npm start` for staging

Run `NODE_ENV=production npm start` for production

should use `pm2` tool to run app for staging or production server!

# Web Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build --configuration=staging` to build the project for STG environment

Run `ng build --configuration=production` to build the project for PRD environment

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# API List

## app

### server app info
curl -i -X GET \
 'http://localhost:3000/api/app/'

## user

### Login
curl -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "account":"admin",
  "password":"admin"
}
  ' \
 'http://localhost:3000/api/user/login'

### signup
curl -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "name":"hieu nt",
  "account":"hieu.nt4",
  "role":"admin",
  "info":"test account",
  "password":"123456"
}
  ' \
 'http://localhost:3000/api/user/signup'


 ## Organization
 ### list
 curl -i -X GET \
   -H "Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJuYW1lIjoiQWRtaW5pc3RyYXRvciIsImFjY291bnQiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE1ODY0MDczMDIsImV4cCI6MTU4NjU4MDEwMn0.fY48LW1BYlaKTOD0Nu-OL97e-VAAUlLDIPKw3DVJSCo" \
 'http://localhost:3000/api/organization?limit=15&offset=0'

 ### create
 curl -i -X POST \
   -H "Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJuYW1lIjoiQWRtaW5pc3RyYXRvciIsImFjY291bnQiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE1ODY0MDczMDIsImV4cCI6MTU4NjU4MDEwMn0.fY48LW1BYlaKTOD0Nu-OL97e-VAAUlLDIPKw3DVJSCo" \
   -H "Content-Type:application/json" \
   -d \
'{
  "name":"Service Ops",
  "description":"Service Operation Part",
  "owner":"SVMC",
  "status":"active"
}
  ' \
 'http://localhost:3000/api/organization/create'

 ### update
 curl -i -X POST \
   -H "Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJuYW1lIjoiQWRtaW5pc3RyYXRvciIsImFjY291bnQiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE1ODY0MDczMDIsImV4cCI6MTU4NjU4MDEwMn0.fY48LW1BYlaKTOD0Nu-OL97e-VAAUlLDIPKw3DVJSCo" \
   -H "Content-Type:application/json" \
   -d \
'{
  "id":1,
  "name":"Service Operation",
  "description":"Service Operation Part",
  "owner":"SVMC",
  "status":"active"
}
  ' \
 'http://localhost:3000/api/organization/update'

 ## Team (similar to Organization, change the path to /team)
 ## User (similar to Organization, change the path to /user)
 ...
