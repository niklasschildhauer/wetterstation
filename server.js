"use strict"

//---------------------------------- PORTS -----------------------------------------/*/
/* :4200 -> Angular Frontend
/* :3201 -> API Gateway http (use only on ESP32 boards)
/* :4201 -> API Gateway https (frontend and API docu)
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

// const https = require('https');
const http = require('http');
// const fs = require('fs');



//Allow CORS, because Angular is running on a different port (4200)
const corsOptions = {
  origin: "http://192.168.178.191:8080",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "x-xsrf-token"
  ]
};

// Options for auto-generated swagger api documentation
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

//Config to use cors, morgan request logging and json encoding for requests
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json({ type: "application/json" }));




// ------------------------------------------------ Models ------------------------------------------------
// Contains modelling of types for parameter/return values in the api documentation

/**
 * @typedef LoginCredentials
 * @property {string} username.required
 * @property {string} password.required
 */

/**
 * @typedef Auth_Response
 * @property {string} success
 * @property {UserContext.model} userContext
 */

/**
 * @typedef Interval
 * @property {string} begin startdate of the interval in adapted format "2020-06-13 18:30:00"
 * @property {string} end enddate of the interval in adapted format "2020-06-13 18:30:00"
 */

/**
* @typedef SensordataOutdoors
* @property {integer} humidity.required
* @property {integer} temperature.required
* @property {integer} pressure.required
* @property {string} location.required
* @property {integer} deviceID.required
*/

/**
* @typedef SensordataIndoors
* @property {integer} humidity.required
* @property {integer} temperature.required
* @property {integer} gasVal.required
* @property {string} location.required
* @property {integer} deviceID.required
*/

/**
* @typedef OutdoorWeatherData
* @property {integer} humidity
* @property {integer} temperature
* @property {integer} pressure
* @property {string} location
* @property {string} timestamp
* @property {string} weather
*/

/**
* @typedef IndoorRoomData
* @property {id} number
* @property {integer} humidity
* @property {integer} temperature
* @property {integer} gasVal
* @property {string} location
* @property {string} timestamp
* @property {integer} gasValCalibrationValue
*/

/**
* @typedef UserContext
* @property {integer} id
* @property {string} username
* @property {string} theme
* @property {integer} fontSize
* @property {boolean} selfVoicingEnabled
* @property {boolean} doVentilationReminder
* @property {boolean} reduceMotion
* @property {Array<string>} pollen
*/

/**
* @typedef UserContextRequestObject
* @property {string} theme
* @property {integer} fontSize
* @property {boolean} selfVoicingEnabled
* @property {boolean} doVentilationReminder
* @property {boolean} reduceMotion
*/

/**
* @typedef Pollen
* @property {string} pollenName
*/

/**
* @typedef Pollen_object
* @property {integer} id
* @property {string} pollenName
*/

/**
* @typedef Forecast
* @property {string} trend
* @property {string} weatherIcon
* @property {string} weatherDescription
* @property {integer} seaPressure
*/

/**
* @typedef Allergy_request_object
* @property {integer} userID
* @property {integer} pollenID
*/

/**
* @typedef OpenAPERequestObject
* @property {string} openApeUser
* @property {string} openApePassword
*/

/**
* @typedef ESPConfig
* @property {integer} id
* @property {string} roomName
* @property {integer} transmissionFrequency
* @property {string} postalCode
* @property {integer} gasValCalibrationValue
* @property {string} sensorType
*/

/**
* @typedef ESPConfigRequestObject
* @property {integer} id
* @property {string} roomName
* @property {integer} transmissionFrequency
* @property {string} postalCode
*/

// -------------------------------------------- Routes - Auth -------------------------------------------

/**
 * Login a user with username and password
 * @route POST /auth/login
 * @group auth - Authentication operations
 * @param {LoginCredentials.model} loginCredentials.body.required - the user's login credentials
 * @returns {object} An object including the auth token
 * @returns {Error}  Http 400 - Bad Request if user credentials are not correct
 */
app.post("/v1/auth/login", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4202/login", JSON.stringify(req.body), res);
});

/**
 * Check a token for validity
 * @route GET /auth/checkToken
 * @group auth - Authentication operations
 * @security JWT
 * @returns {object} An object including the auth token
 */
app.get("/v1/auth/checkToken", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(token, "GET", "http://localhost:4202/checkToken", res);
});


/**
 * Get the current user's UserContext
 * @route GET /user/currentUser
 * @group user - User / UserContext
 * @security JWT
 * @returns {UserContext.model} Authentication response message
 */
app.get("/v1/user/currentUser", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(token, "GET", "http://localhost:4202/currentUser", res);
});

/**
 * Register a new user
 * @route POST /user/register
 * @group user - User / UserContext
 * @param {LoginCredentials.model} loginCredentials.body.required - the new user's credentials
 * @returns {UserContext.model} Authentication response message
 */
app.post("/v1/user/register", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4203/register", JSON.stringify(req.body), res);
});


/**
 * Save an existing user
 * @route PUT /user/save
 * @group user - User / UserContext
 * @security JWT
 * @param {integer} id.query.required - id of the UserContext object
 * @param {UserContextRequestObject.model} userContext.body.required - the updated user credentials
 * @returns {UserContext.model} UserContext object
 */
app.put("/v1/user/save", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequestWithPayload(token, "PUT", "http://localhost:4203/save/" + req.query.id, JSON.stringify(req.body), res);
});


/**
 * Load settings from OpenAPE and overwrite the personalization settings in the DB
 * @route POST /user/loadOpenAPESettingsAndSave
 * @group user - User / UserContext
 * @security JWT
 * @param {OpenAPERequestObject.model} openAPECredentials.body.required - Open APE credentials
 * @returns {UserContext.model} UserContext object
 */
app.post("/v1/user/loadOpenAPESettingsAndSave", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequestWithPayload(token, "POST", "http://localhost:4203/loadOpenAPESettingsAndSave", JSON.stringify(req.body), res);
});


/**
 * Write settings to OpenAPE
 * @route POST /user/writeOpenAPESettings
 * @group user - User / UserContext
 * @security JWT
 * @param {OpenAPERequestObject.model} openAPECredentials.body.required - Open APE credentials
 * @returns {UserContext.model} UserContext object
 */
 app.post("/v1/user/writeOpenAPESettings", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequestWithPayload(token, "POST", "http://localhost:4203/writeOpenAPESettings", JSON.stringify(req.body), res);
});

// ----------------------------------------- Routes - Sensors -----------------------------------------

/**
 * Receive data for outdoor sensors
 * @route POST /sensors/outdoor
 * @group sensors - Receiving of sensor data
 * @param {SensordataOutdoors.model} sensordata.body.required sensordata
 */
app.post("/v1/sensors/outdoor", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4204/sensorout", JSON.stringify(req.body), res);
});

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
  genericRequest("", "GET", "http://localhost:4205/outdoor/latest", res);
});


/**
 * Receive latest data for outdoor sensors
 * @route GET /weather-data/indoor/latest
 * @group weather-data - Request weather data
 * @returns {IndoorRoomData.model} 200 - The latest recorded weather data
 */
app.get("/v1/weather-data/indoor/latest", (req, res) => {
  genericRequest("", "GET", "http://localhost:4205/indoor/latest", res);
});


/**
 * Receive history weather data for outdoor sensors for a given interval of time
 * @route POST /weather-data/outdoor/history
 * @group weather-data - Request weather data
 * @param {Interval.model} interval.body.required interval
 * @returns {Array<OutdoorWeatherData>} 200 - An array of OutdoorWeatherData objects for a given interval
 */
app.post("/v1/weather-data/outdoor/history", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4205/outdoor/history", JSON.stringify(req.body), res);
});


/**
 * Receive history weather data for indoor sensors for a given interval of time
 * @route POST /weather-data/indoor/history
 * @group weather-data - Request weather data
 * @param {Interval.model} interval.body.required interval
 * @returns {Array<IndoorRoomData>} 200 - An array of IndoorRoomData objects for a given interval
 */
app.post("/v1/weather-data/indoor/history", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4205/indoor/history", JSON.stringify(req.body), res);
});

// ------------------------------------------ Routes - Pollen ------------------------------------------

/**
 * Receive all Pollen types from the database
 * @route GET /pollen/all
 * @group Pollen - Pollen data CRUD
 * @returns {Array<Pollen_object>} 200 - An array of PollenTypes and 
 */
app.get("/v1/pollen/all", (req, res) => {
  genericRequest("", "GET", "http://localhost:4205/pollen/all", res);
});


/**
 * Receive one Pollen object from the database determined by specified id
 * @route GET /pollen
 * @group Pollen - Pollen data CRUD
 * @param {integer} id.query.required - id of the Pollen object
 * @returns {Pollen_object} 200 - a single Pollen object
 */
app.get("/v1/pollen", (req, res) => {
  genericRequest("", "GET", "http://localhost:4205/pollen/" + req.query.id, res);
});

/**
 * Create a new Pollen object
 * @route POST /pollen/insert
 * @group Pollen - Pollen data CRUD
 * @param {Pollen.model} pollen.body.required - Pollen object with pollenName
 * @returns {Pollen_object} 200 - a single Pollen object
 */
app.post("/v1/pollen/insert", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4205/pollen/insert", JSON.stringify(req.body), res);
});


/**
 * Save a new Allergy
 * @route POST /allergies/save
 * @group Allergies - Create and retrieve allergies
 * @security JWT
 * @param {Allergy_request_object.model} pollen.body.required - userID and pollenID - determines the allergy
 */
app.post("/v1/allergies/save", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequestWithPayload(token, "POST", "http://localhost:4205/pollen/save", JSON.stringify(req.body), res);
});


/**
 * Delete an existing Allergy
 * @route DELETE /allergies/delete
 * @group Allergies - Create and retrieve allergies
 * @security JWT
 * @param {Allergy_request_object.model} pollen.body.required - userID and pollenID - determines the allergy
 */
app.delete("/v1/allergies/delete", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequestWithPayload(token, "DELETE", "http://localhost:4205/pollen/delete", JSON.stringify(req.body), res);
});


/**
 * Retrieve all pollen types a user is allergic to
 * @route GET /allergies/byUsername
 * @group Allergies - Create and retrieve allergies
 * @security JWT
 * @param {string} username.query.required - username of the user to request
 * @returns {Array<string>} All Pollen types that the user is allergic to
 */
app.get("/v1/allergies/byUsername", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(token, "GET", "http://localhost:4205/pollen/byUsername/" + req.query.username, res);
});


// ------------------------------------------ Routes - Forecast ------------------------------------------

/**
 * Receive latest data for forecast
 * @route GET /weather-data/forecast/latest
 * @group forecast - Insert forecast data
 * @returns {Forecast} 200 - The latest recorded forecast data
 */
app.get("/v1/weather-data/forecast/latest", (req, res) => {
  genericRequest("", "GET", "http://localhost:4205/forecast/latest", res);
});

/**
 * Receive latest data for forecast
 * @route GET /weather-data/forecast/history
 * @group forecast - Insert forecast data
 * @returns {Array<Forecast>} 200 - The latest recorded forecast data history
 */
app.get("/v1/weather-data/forecast/history", (req, res) => {
  genericRequest("", "GET", "http://localhost:4205/forecast/history", res);
});

/**
 * Receive latest data for forecast
 * @route POST /weather-data/forecast/insert
 * @group forecast - Insert forecast data
 * @param {Forecast.model} forecast.body.required - Pollen object with pollenName
 * @returns {Forecast} 200 - Returns single forecast
 */
app.post("/v1/weather-data/forecast/insert", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4205/forecast/insert", JSON.stringify(req.body), res);
});

// ---------------------------------------- Routes - ESPConfig ----------------------------------------

/**
 * List all available ESPConfig objects in the database
 * @route GET /espconfig/all
 * @group ESPConfig - ESPConfig object creation and change
 * @returns {ESPConfig.model} 200 - all available ESPConfig objects
 */
app.get("/v1/espconfig/all", (req, res) => {
  genericRequest("", "GET", "http://localhost:4205/espconfig/all", res);
});


/**
 * Create a new Pollen object
 * @route POST /espconfig/change
 * @group ESPConfig - ESPConfig object creation and change
 * @param {ESPConfigRequestObject.model} espconfig.body.required - ESPConfig object
 * @returns {Array<ESPConfig>} 200 - a complete ESPConfig object
 */
app.post("/v1/espconfig/change", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4205/espconfig/change", JSON.stringify(req.body), res);
});

// ------------------------------------------------ Routes - Calibration ------------------------------------------------

/**
 * Create a new Calibration object
 * @route GET /calibration/insert
 * @param {number} deviceID.query.required - deviceID of the sensor
 * @group Calibration - Create new Calibration objects
 */
 app.get("/v1/calibration/insert", (req, res) => {
  genericRequest("", "GET", "http://localhost:4204/calibration/insert/" + req.query.deviceID, res);
});



// ------------------------------------------------ Helper ------------------------------------------------

// A parameterized request without payload used for GET or DELETE requests.
// Takes an auth-token or empty string, http-method, resource location uri
// The res parameter is the response handler of the express function handler which will simply be passed to the lower level function
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

// A parameterized request with payload used for POST or PUT requests.
// Takes an auth-token or empty string, http-method, resource location uri
// The res parameter is the response handler of the express function handler which will simply be passed to the lower level function
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

// This function will send the actual response back to the client.
// Sets the statusCode for the http response
const genericCallback = (error, response, body, res) => {
  //Case "unknown error", i.e. a service is down
  if (error) {
    res.sendStatus("400");
  } else {
    //Case "successful request"
    if (response.statusCode === 200) {
      let data = JSON.parse(body);
      res.json(data);
    } 
    //Case "not authorized"
    else if (response.statusCode === 401) {
      let out = "The request is unauthorized";
      res.status("401").json(out);
    } 
    //Case "bad request" (Wrong parameters/input)
    else {
      let out = body.message || "Bad request";
      res.status("400").json(out);
    }
  }
};

http.createServer(app).listen(4201, () => {
  console.log("http endpoint listening on 4201")
})


/*
CURL test commands WINDOWS

curl -X GET http://localhost:4202/checkToken
// --> invalid token
curl -H "Content-Type: application/json" -X POST http://localhost:4202/login -d "{\"password\":\"password\", \"username\":\"admin\"}"
// --> 200, receive token
curl -X GET -H "Authorization: Bearer <received_token>" http://localhost:4202/checkToken
//Logout
curl -X GET -H "Authorization: Bearer <received_token>" http://localhost:4202/logout

*/