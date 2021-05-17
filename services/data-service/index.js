"use strict"

const port = 4204;

var express = require('express');
var app = express();
const request = require("request");

app.use(express.json());

app.post('/sensorout', (req, res) => {
	genericRequestWithPayload("POST", 'http://localhost:4205/outdoor/insert', JSON.stringify(req.body), res);
});

app.post('/sensorin', (req, res) => {
	var roomTemperature = req.body.temperature;
	var roomPressure = req.body.pressure;
	var roomHumidity = req.body.humidity;
	var gasVal = req.body.gasVal;
	console.log(req.body);
	res.status(200).json("OK");
});



// ------------------------------------------------ Helper ------------------------------------------------


const genericRequest = (method, uri, res) => {
	request(
	  {
		headers: {
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
  
  const genericRequestWithPayload = (method, uri, body, res) => {
	request(
	  {
		headers: {
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



console.log("listening on port", port)
app.listen(port);

