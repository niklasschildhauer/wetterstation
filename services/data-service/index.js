"use strict"

const port = 4204;

var express = require('express');
var app = express();

//app.use(express.urlencoded({
//	extended:true
//}));
app.use(express.json());


app.get('/', function (req, res) {
	res.status(200).send("Hello from port " + port);
});

app.post('/sensorout', (req, res) => {
	var temperature = req.body.temperature;
	var pressure = req.body.pressure;
	var humidity = req.body.humidity;
	console.log(req.body);
	res.status(200).json("OK");
});

app.post('/sensorin', (req, res) => {
	var roomTemperature = req.body.temperature;
	var roomPressure = req.body.pressure;
	var roomHumidity = req.body.humidity;
	var gasVal = req.body.gasVal;
	console.log(req.body);
	res.status(200).json("OK");
});

console.log("listening on port", port)
app.listen(port);