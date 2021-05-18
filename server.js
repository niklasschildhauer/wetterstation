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
 * @typedef Interval
 * @property {string} begin startdate of the interval in ISO-format "2020-06-13T18:30:00.000Z"
 * @property {string} end enddate of the interval in ISO-format "2020-06-13T18:30:00.000Z"
 */

/**
* @typedef SensordataOutdoors
* @property {integer} humidity.required
* @property {integer} temperature.required
* @property {integer} pressure.required
* @property {string} location.required
*/

/**
* @typedef SensordataIndoors
* @property {integer} roomHumidity.required
* @property {integer} roomTemperature.required
* @property {integer} roomPressure.required
* @property {integer} gasVal.required
* @property {string} location.required
*/

/**
* @typedef OutdoorWeatherData
* @property {integer} roomHumidity
* @property {integer} roomTemperature
* @property {integer} roomPressure
* @property {integer} gasVal
* @property {string} location
* @property {string} timestamp
* @property {string} weather
* @property {integer} apparentTemperature
*/

/**
* @typedef IndoorRoomData
* @property {integer} roomHumidity
* @property {integer} roomTemperature
* @property {integer} roomPressure
* @property {integer} gasVal
* @property {string} location
* @property {string} timestamp
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
 * @param {SensordataOutdoors.model} sensordata.body.required sensordata
 */
app.post("/v1/sensors/outdoor", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4204/sensorout", JSON.stringify(req.body), res);
});

//TODO: Returns?
/**
 * Receive data for outdoor sensors
 * @route POST /sensors/indoor
 * @group sensors - Receiving of sensor data
 * @param {SensordataIndoors.model} sensordata.body.required sensordata
 */
 app.post("/v1/sensors/indoor", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4204/sensorin", JSON.stringify(req.body), res);
});


/**
 * Receive latest data for outdoor sensors
 * @route GET /weather-data/outdoor/latest
 * @group weather-data - Request weather data
 * @returns {OutdoorWeatherData.model} 200 - The latest recorded weather data
 */
 app.get("/v1/weather-data/outdoor/latest", (req, res) => {
   //TODO: Implement me
  //genericRequest("", "GET", "http://localhost:4205/outdoor/latest", res);
  res.status(204).json("Not implemented")
});


/**
 * Receive history weather data for outdoor sensors for a given interval of time
 * @route POST /weather-data/outdoor/history
 * @group weather-data - Request weather data
 * @param {Interval.model} interval.body.required interval
 * @returns {Array<OutdoorWeatherData>} 200 - An array of OutdoorWeatherData objects for a given interval
 */
app.post("/v1/weather-data/outdoor/history", (req, res) => {
  //TODO: Implement me
  // genericRequestWithPayload("", "POST", "http://localhost:4205/outdoor/latest", JSON.stringify(req.body), res);
  res.status(204).json("Not implemented")
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