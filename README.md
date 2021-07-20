# Wetterstation

## Dev commands


(in folder wetterstation)

### Install nodemon globally!
npm i -g nodemon


### start frontend:
The developer server can be started by the following command:
```
npm run frontend-dev
```

To host the frontend, please take a look at the installation instructions.
You need to install the angular-http-server and you have to make sure that 
the IP address in the Server.js file and in the environment.prod.ts in the frontend folder
is the same as the one your raspberry pi has.
```
npm run frontend-prod
```

### start backend:
npm run backend

### for development (better debugging) best use separate backend-services
###### every service in a new terminal
npm run auth
npm run


### start all services (WIP/buggy):
(Linux) npm run services
(Win) npm run servicesWin

