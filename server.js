"use strict"

//---------------------------------- PORTS -----------------------------------------/*/
/* :4200 -> Angular Frontend
/* :4201 -> API Gateway
/* :4202 -> AuthService
/* :4203 -> PersonalizationService
/* :4204 -> DataService
/* :4205 -> PersistentDataService
//----------------------------------------------------------------------------------/*/

const express = require('express');
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const expressSwagger = require("express-swagger-generator")(app);
const request = require("request");

//Allow CORS, because Angular is running on a different port (4200)
const corsOptions = {
  origin: "http://localhost:4200",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "x-xsrf-token"
  ]
};

let swaggerOptions = {
  swaggerDefinition: {
    info: {
      description: "Wetterstation API GW",
      title: "Wetterstation API",
      version: "1.0.0"
    },
    host: "localhost:4201",
    basePath: "/v1",
    produces: ["application/json", "application/xml"],
    schemes: ["http"],
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: ""
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: ["./server.js"] //Path to the API handle folder
};
expressSwagger(swaggerOptions);

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb", type: "application/json" }));




// ------------------------------------------------ Models ------------------------------------------------

/**
 * @typedef LoginCredentials
 * @property {string} username.required
 * @property {string} password.required
 */

/**
 * @typedef Auth_Response
 * @property {string} success
 */

/**
* @typedef SensordataOutdoors
* @property {integer} temperature.required
* @property {integer} humidity.required
* @property {integer} pressure.required
*/

/**
* @typedef SensordataIndoors
* @property {integer} roomTemperature.required
* @property {integer} roomHumidity.required
* @property {integer} roomPressure.required
* @property {integer} gasVal.required
*/


// ------------------------------------------------ Routes ------------------------------------------------

/**
 * Login a user with username and password
 * @route POST /auth/login
 * @group auth - Authentication operations
 * @param {LoginCredentials.model} loginCredentials.body.required - the user's login credentials
 * @returns {object} An object including the auth token
 * @returns {Error}  Http 400 - Bad Request if user credentials are not correct
 */
app.post("/v1/auth/login", (req, res) => {
  genericRequestWithPayload(
    "",
    "POST",
    "http://localhost:4202/login",
    JSON.stringify(req.body),
    res
  );
});

/**
 * Check a token for validity
 * @route GET /auth/checkToken
 * @group auth - Authentication operations
 * @security JWT
 * @returns {Auth_Response.model} Authentication response message
 */
app.get("/v1/auth/checkToken", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(token, "GET", "http://localhost:4202/checkToken", res);
});

//TODO: Returns?
/**
 * Receive data for outdoor sensors
 * @route POST /sensors/outdoor
 * @group sensors - Receiving of sensor data
 * @param {SensordataOutdoors.model} sensordata.body.required test
 */
app.post("/v1/sensors/outdoor", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4204/sensorout", JSON.stringify(req.body), res);
});


//TODO: Returns?
/**
 * Receive data for outdoor sensors
 * @route POST /sensors/indoor
 * @group sensors - Receiving of sensor data
 * @param {SensordataIndoors.model} sensordata.body.required test
 */
app.post("/v1/sensors/indoor", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4204/sensorin", JSON.stringify(req.body), res);
});



// ------------------------------------------------ Helper ------------------------------------------------


const genericRequest = (token, method, uri, res) => {
  request(
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      uri: uri,
      method: method
    },
    function (error, response, body) {
      genericCallback(error, response, body, res);
    }
  );
};

const genericRequestWithPayload = (token, method, uri, body, res) => {
  request(
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      uri: uri,
      method: method,
      body: body
    },
    function (error, response, body) {
      genericCallback(error, response, body, res);
    }
  );
};

const genericCallback = (error, response, body, res) => {
  if (error) {
    res.sendStatus("400");
  } else {
    if (response.statusCode === 200) {
      let data = JSON.parse(body);
      res.json(data);
    } else if (response.statusCode === 401) {
      let out = "The request is unauthorized";
      res.status("401").json(out);
    } else {
      let out = "Bad request";
      res.status("400").json(out);
    }
  }
};







console.log("listening on port 4201")
app.listen(4201);



/*
CURL test comannds WINDOWS


curl -X GET http://localhost:4202/checkToken
// --> invalid token
curl -H "Content-Type: application/json" -X POST http://localhost:4202/login -d "{\"password\":\"password\", \"username\":\"admin\"}"
// --> 200, receive token
curl -X GET -H "Authorization: Bearer <received_token>" http://localhost:4202/checkToken
//Logout
curl -X GET -H "Authorization: Bearer <received_token>" http://localhost:4202/logout

*/