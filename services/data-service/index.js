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
		"humidity" : req.body.humidity,
		"temperature": req.body.temperature,
		"pressure" : req.body.pressure,
		"location" : req.body.location,
		"apparentTemperature": apparentTemp.calculateApparentTemperature()
	}
	genericRequestHandlers.genericRequestWithPayload("POST", 'http://localhost:4205/outdoor/insert', JSON.stringify(_body), res);
});

app.post('/sensorin', (req, res) => {
	let body = JSON.stringify(req.body);
	genericRequestHandlers.genericRequestWithPayload("POST", 'http://localhost:4205/indoor/insert', body, res);
});

console.log("listening on port", port)
app.listen(port);