"use strict"

const port = 4204;

//Use with genericRequestHandlers.genericRequest(...)
const genericRequestHandlers = require("./lib/shared");
const forecast = require("./lib/forecast")

// Service config
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

//The outdoor sensor will insert its data on this route
app.post('/sensorout', (req, res) => {
	//Format the data to be in correct "shape" for the database, do some type checks
	let _body = {
		"humidity": parseInt(req.body.humidity),
		"temperature": parseInt(req.body.temperature),
		"pressure": parseInt(req.body.pressure),
		"location": req.body.location,
		"deviceID": parseInt(req.body.deviceID)
	}
	//Send the data to the database
	genericRequestHandlers.genericRequestWithPayloadToPromise("POST", 'http://localhost:4205/outdoor/insert', JSON.stringify(_body)).then((response) => {
		res.status(200).send(response);
	}).catch((error) => {
		console.log("(Outdoor data) outdoor data could not be saved")
		res.status(400).send({ "error": error })
	});
});

//The indoor sensor will insert its data on this route
app.post('/sensorin', (req, res) => {
	//Format the data to be in correct "shape" for the database, do some type checks
	let _body = {
		"humidity": parseInt(req.body.humidity),
		"temperature": parseInt(req.body.temperature),
		"gasVal": parseInt(req.body.gasVal),
		"location": req.body.location,
		"deviceID": parseInt(req.body.deviceID)
	}

	//Send the data to the database
	genericRequestHandlers.genericRequestWithPayloadToPromise("POST", 'http://localhost:4205/indoor/insert', JSON.stringify(_body)).then((response) => {
		res.status(200).send(response);
	}).catch((error) => {
		console.log("(Indoor data) indoor data could not be saved")
		res.status(400).send({ "error": error })
	});
});

//This route inserts a new task for the calibration worker into the database. 
app.get('/calibration/insert/:deviceID', (req, res) => {

	//Take the current time as start date for the calibration.
	//Calculate the end date by adding hours specified in CALIBRATION_DURATION
	let startDate = getLocalISODate().split(".")[0].replace("T", " ");
	//Calculate the endDate for the calibration
	let _endDate = new Date(getLocalISODate())
	_endDate = new Date(_endDate.setHours(_endDate.getHours() + CALIBRATION_DURATION));
	let endDate = _endDate.toISOString().split(".")[0].replace("T", " ");

	//Construct the request object with startDate, endDate and deviceID
	let _body = {
		"startDate": startDate,
		"endDate": endDate,
		"deviceID": req.params.deviceID
	}

	//Persist the new calibration task into the db
	genericRequestHandlers.genericRequestWithPayloadToPromise("POST", "http://localhost:4205/calibration/insert", JSON.stringify(_body)).then((response) => {
		res.status(200).send(response);
	}).catch((error) => {
		res.status(400).send({ "error": error })
	});

})


//The calibration worker, working on the interval specified in CALIBRATION_CHECK_INTERVAL
//It has been implemented in a "stateless" so no timers have to be kept running but instead the worker regularly checks for calibration tasks that have been finished.
//The data for the calibration will be requested by using /indoor/history route
setInterval(() => {
	//Get all calibrations from the database
	genericRequestHandlers.genericRequestToPromise("GET", "http://localhost:4205/calibration/latest").then((response) => {
		//A calibration task is running
		if (!(response.message === 'Requested entry did not exist')) {
			console.log("startDate", response.startDate)
			console.log("endDate", response.endDate)
			console.log("calibration", response.deviceID)
			//The request timestamp for the history data
			let reqBodyHistory = {
				begin: response.startDate,
				end: response.endDate
			}

			//Typing to check if the endDate of the calibration task lies in the past
			let now = new Date(getLocalISODate())
			let isOver = new Date(response.endDate);

			
			if (response != undefined) {
				//The endDate of the calibration task lies in the past meaning the calibration duration is over.
				//The collected data can now be processed.
				if (now >= isOver) {

					//Request history data based on the calibration tasks startDate and endDate
					genericRequestHandlers.genericRequestWithPayloadToPromise("POST", "http://localhost:4205/indoor/history", JSON.stringify(reqBodyHistory)).then((history) => {
						//Filter the history to only include data from the sensor with the given deviceID
						const len = history.filter(a => a.deviceID === response.deviceID).length
						//Calculate the average of all data in the given timespan by using
						// - Filter out all data from sensors with a different deviceID
						// - Map all elements of the stream to only the gasVal property
						// - Add up all gasVal values using reduce
						// - Divide the sum by the length of the stream
						const avg = history.filter(a => a.deviceID === response.deviceID).map(a => a.gasVal).reduce((a, b) => a + b) / len
						// console.log("avg", avg);

						//Get ESPconf by number	from the database
						genericRequestHandlers.genericRequestToPromise("GET", "http://localhost:4205/espconfig/all").then((allesps) => {
							let theConf;
							//Iterate all sensors and get the one with the fitting deviceID
							allesps.forEach((espConf) => {
								if (espConf["id"] === response.deviceID) {
									theConf = espConf;
								}
							})
							//Modify the gasValCalibrationValue of the sensor object
							theConf.gasValCalibrationValue = avg
							//Persist the changes back to the database
							genericRequestHandlers.genericRequestWithPayloadToPromise("POST", "http://localhost:4205/espconfig/change", JSON.stringify(theConf)).then((newConf) => {
								//Delete the calibration task as it has successfully completed "Cleanup"
								genericRequestHandlers.genericRequestToPromise("DELETE", "http://localhost:4205/calibration/" + response.id);
							})
							//The rest of the code is error handling and logging
							.catch((err) => {
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
		//No calibration task is running
		else {
			console.log("No calibration task running")
		}
	})
}, CALIBRATION_CHECK_INTERVAL)


// Helper to format Date to current ISODate
const getLocalISODate = () => {
	var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
	var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
	// console.log("localISOTime", localISOTime);
	return localISOTime;
}

console.log("listening on port", port)
app.listen(port);