# Wetterstation

The WeatherIO weather station was developed in the summer semester of 2021 as part of the "Smart-Home Praktikum" lecture in the Computer Science and Media course at the Hochschule der Medien. 
With the help of various sensors, WeatherIO collects measurement data (both outdoors and indoors) and stores it in a database. 
The results are then displayed graphically in a customisable web application. With the personalisation functions Self-Voicing, Reduce Motion, adjustable font size and High Contrast Theme, people with different needs and limitations are supported.


## Dev commands


(in folder wetterstation)

### Install nodemon globally!
```
npm i -g nodemon
```

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
```
npm run server
```

### for development (better debugging) best use separate backend-services
###### every service in a new terminal
```
npm run auth
npm run pers
npm run database
npm run weather-data
```


