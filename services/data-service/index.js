"use strict"

const port = 4204;

//Use with genericRequestHandlers.genericRequest(...)
const genericRequestHandlers = require("./lib/shared");
const forecast = require("./lib/forecast")

const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan("dev"));
app.use(express.json());

/*
*  CONFIG
*/
// in hours
const CALIBRATION_DURATION = 4;
// in minutes
const CALIBRATION_CHECK_INTERVAL = 10 * 1000 * 60

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

app.get('/calibration/insert/:deviceID', (req, res) => {
	
	let startDate = getLocalISODate().split(".")[0].replace("T", " ");
	console.log("startDate", startDate)
	//Calculate the endDate for the calibration
	let _endDate = new Date(getLocalISODate())
	console.log("_endDate", _endDate)
	_endDate = new Date(_endDate.setHours(_endDate.getHours() + CALIBRATION_DURATION));
	console.log("_endDate step 2", _endDate);
	let endDate = _endDate.toISOString().split(".")[0].replace("T", " ");
	console.log("endDate", endDate)
	
	let _body = {
		"startDate": startDate,
		"endDate": endDate,
		"deviceID": req.params.deviceID
	}

	genericRequestHandlers.genericRequestWithPayloadToPromise("POST", "http://localhost:4205/calibration/insert", JSON.stringify(_body)).then((response) => {
		res.status(200).send(response);
	}).catch((error) => {
		res.status(400).send({"error": error})
	});

})

setInterval(() => {
	genericRequestHandlers.genericRequestToPromise("GET", "http://localhost:4205/calibration/latest").then((response) => {
		if( !(response.message === 'Requested entry did not exist')){
			console.log("startDate", response.startDate)
			console.log("endDate", response.endDate)
			console.log("calibration", response.deviceID)
			let reqBodyHistory = {
				begin: response.startDate,
				end: response.endDate
			}
	
			let now = new Date(getLocalISODate())
			let isOver = new Date(response.endDate);
	
			if(response != undefined){
				if(now >= isOver){
					genericRequestHandlers.genericRequestWithPayloadToPromise("POST", "http://localhost:4205/indoor/history", JSON.stringify(reqBodyHistory)).then((history) => {
						// console.log("history", history);
						// console.log("history filtered", history.filter(a => a.deviceID === response.deviceID))
						const len = history.filter(a => a.deviceID === response.deviceID).length
						const avg = history.filter(a => a.deviceID === response.deviceID).map(a => a.gasVal).reduce((a, b) => a + b) / len
						console.log("avg", avg);
	
						//Get ESPconf by number	
						genericRequestHandlers.genericRequestToPromise("GET", "http://localhost:4205/espconfig/all").then((allesps) => {
							let theConf;
							console.log("allesps", allesps)
							console.log("response.deviceID", response.deviceID)
							// console.log("???", response.deviceID === espConf.id)
							allesps.forEach((espConf) => {
								console.log("espConf", espConf)
								if(espConf["id"] === response.deviceID){
									theConf = espConf;
								}
							})
							theConf.gasValCalibrationValue = avg
							console.log("after setting gasValCalibation (this is the new espconf", theConf);
							genericRequestHandlers.genericRequestWithPayloadToPromise("POST", "http://localhost:4205/espconfig/change", JSON.stringify(theConf)).then((newConf) => {
								console.log("after persist to db (this is the db espconf", newConf);
								genericRequestHandlers.genericRequestToPromise("DELETE", "http://localhost:4205/calibration/" + response.id);
							}).catch((err) => {
								console.log("(Calibration worker): Something went wrong with changing esp config device")
								console.log("Error", err)
							});
						}).catch((err) => {
							console.log("(Calibration worker): Something went wrong with fetching esp config device list")
							console.log("Error", err)
						});
					}).catch((err) => {
						console.log("(Calibration worker): Something went wrong retrieving history data")
						console.log("Error", err)
					})
				}
			}

		}
	})
}, CALIBRATION_CHECK_INTERVAL)


const getLocalISODate = () => {
	var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
	var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
	// console.log("localISOTime", localISOTime);
	return localISOTime;
}

console.log("listening on port", port)
app.listen(port);


// app.post("calibration") -> 14.03 -> to_db

// cronjob -> 10min calibration? -> is longer than 4 hours ago?

// get history -> startdate to currentDate -> gets 100 values -> avg -> insert to userContext-db -> delete calibration