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

app.get('/calibration/insert', (req, res) => {
	const token = req.headers["x-access-token"] || req.headers["authorization"];
	genericRequestHandlers.genericRequestToPromiseAuth(token, "GET", "http://localhost:4202/currentUser").then(db_user => {
		let startDate = getLocalISODate().split(".")[0].replace("T", " ");
		// console.log("startDate", startDate)
		//Calculate the endDate for the calibration
		let _endDate = new Date(getLocalISODate())
		// console.log("_endDate", _endDate)
		_endDate = new Date(_endDate.setHours(_endDate.getHours() + CALIBRATION_DURATION));
		// console.log("_endDate step 2", _endDate);
		let endDate = _endDate.toISOString().split(".")[0].replace("T", " ");
		// console.log("endDate", endDate)
		
		let _body = {
			"startDate": startDate,
			"endDate": endDate,
			"user": db_user
		}
	
		genericRequestHandlers.genericRequestWithPayloadToPromise("POST", "http://localhost:4205/calibration/insert", JSON.stringify(_body)).then((response) => {
			res.status(200).send(response);
		}).catch((error) => {
			res.status(400).send({"error": error})
		});
	})

})

setInterval(() => {
	genericRequestHandlers.genericRequestToPromise("GET", "http://localhost:4205/calibration/latest").then((response) => {
		console.log("startDate", response.startDate)
		console.log("endDate", response.endDate)
		console.log("BODY", response)
		let _body = {
			begin: response.startDate,
			end: response.endDate
		}

		let now = new Date(getLocalISODate())
		let isOver = new Date(response.endDate);

		if(response != undefined){
			if(now >= isOver){
				genericRequestHandlers.genericRequestWithPayloadToPromise("POST", "http://localhost:4205/indoor/history", JSON.stringify(_body)).then((history) => {
					// console.log("history", history, typeof history);
					const avg = history.map(a => a.gasVal).reduce((a, b) => a + b) / history.length
					// console.log("avg", avg);
					response.user.userCalibratedGasVal = avg;
					const getTokenBody = {
						username: response.user.username,
						password: response.user.password
					}
					// console.log("resp after set gasVal", response)
					genericRequestHandlers.genericRequestWithPayloadToPromise("POST", "http://localhost:4202/login", JSON.stringify(getTokenBody)).then((authResponse) => {
						genericRequestHandlers.genericRequestWithPayloadToPromiseAuth(authResponse.token, "PUT", "http://localhost:4205/userContext/save/" + response.user.id, JSON.stringify(response.user)).then((user) => {
							console.log("user, final", user)
							genericRequestHandlers.genericRequestToPromise("DELETE", "http://localhost:4205/calibration/" + response.id);
						})
					})
				})
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