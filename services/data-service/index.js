"use strict"

const port = 4204;

var express = require('express');
var app = express();
const request = require("request");

app.use(express.json());

app.post('/sensorout', (req, res) => {
	let body = JSON.stringify(req.body);
	genericRequestWithPayload("POST", 'http://localhost:4205/outdoorinsert', body, res);
});

app.post('/sensorin', (req, res) => {
	let body = JSON.stringify(req.body);
	genericRequestWithPayload("POST", 'http://localhost:4205/indoorinsert', body, res);
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

