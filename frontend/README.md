# Weather IO
### A Smarthome Innovation

This webapp is build with Angular 11.2.

It uses the following external libraries: 
- ngx-spinner: 11.0.1 for the loading spinner. [Link](https://www.npmjs.com/package/ngx-spinner)
- @rinminase/ng-charts: 3.3.0 for the graphs. [Link](https://www.npmjs.com/package/@rinminase/ng-charts)

### Developer server
The developer server can be started by the following command:
```
npm run start
```

### Productive hosting
To host the frontend, please take a look at the installation instructions.
You need to install the angular-http-server and you have to make sure that 
the IP address in the Server.js file and in the environment.prod.ts in the frontend folder
is the same as the one your raspberry pi has.
```
npm run prod
```

### Build 
To build the frontend without hosting, you can use the following command:
```
npm run build
```
This will create in the dist folder a productive version of the web app.

### Documentation
The documentation of the frontend can be found in the documentation folder.
This contains a generated website which displays all dependencies and code 
documentations. 
To rebuild the documentation website run: 
```
npm run doc
```