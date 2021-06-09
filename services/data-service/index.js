"use strict"

const port = 4204;

//Use with genericRequestHandlers.genericRequest(...)
const genericRequestHandlers = require("./lib/shared");
const apparentTemp = require("./lib/apparentTemperature")
const forecast = require("./lib/forecast")

const express = require('express');
const morgan = require('morgan');
const cron = require('node-cron');
const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.post('/sensorout', (req, res) => {
	let _body = {
		"humidity" : parseInt(req.body.humidity),
		"temperature": parseInt(req.body.temperature),
		"pressure" : parseInt(req.body.pressure),
		"location" : req.body.location,
		"deviceID" : parseInt(req.body.deviceID)
	}
	genericRequestHandlers.genericRequestWithPayloadToPromise("POST", 'http://localhost:4205/outdoor/insert', JSON.stringify(_body)).then((response) => {
		res.status(200).send(response);
	}).catch((error) => {
		res.status(400).send({"error": error})
	});
});

app.post('/sensorin', (req, res) => {
	let _body = {
		"humidity" : parseInt(req.body.humidity),
		"temperature": parseInt(req.body.temperature),
		"gasVal" : parseInt(req.body.gasVal),
		"location" : req.body.location,
		"deviceID" : parseInt(req.body.deviceID)
	}

	// console.log("body", _body);
	genericRequestHandlers.genericRequestWithPayloadToPromise("POST", 'http://localhost:4205/indoor/insert', JSON.stringify(_body)).then((response) => {
		res.status(200).send(response);
	}).catch((error) => {
		res.status(400).send({"error": error})
	});

});

console.log("listening on port", port)
app.listen(port);