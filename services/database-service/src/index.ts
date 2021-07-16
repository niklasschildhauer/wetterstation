import "reflect-metadata";
import { Between, createConnection } from "typeorm";
import { Outdoor } from "./entity/Outdoor";
import { Indoor } from "./entity/Indoor";
import { UserContext } from "./entity/UserContext";
import { Pollen } from "./entity/Pollen";
import { Forecast } from "./entity/Forecast";
import { ESPConfig } from "./entity/ESPconfig";
import { Calibration } from "./entity/Calibration";

"use strict"

const debugEnabled = false;

// create typeorm connection
createConnection().then(connection => {
    //Repositories for all entities in the db. Can be used to create/save objects and use the type safety they provide as well as filtering etc.
    const outdoorData = connection.getRepository(Outdoor);
    const indoorData = connection.getRepository(Indoor);
    const userCtxData = connection.getRepository(UserContext);
    const pollenData = connection.getRepository(Pollen);
    const forecastData = connection.getRepository(Forecast);
    const espConfigData = connection.getRepository(ESPConfig);
    const calibrationData = connection.getRepository(Calibration);

    //set up express 
    const port = 4205;
    var express = require('express');
    var request = require('request');
    var morgan = require('morgan');
    var app = express();
    app.use(morgan("dev"));
    app.use(express.json());


    // -------------------------------------- Outdoor / Indoor requests -----------------------------

    //Get the latest data from the outdoor table  
    app.get('/outdoor/latest', async (req, res) => {
        let out;
        //Get the latest entry by ordering DESC and picking the last entry
        const latest = await outdoorData.findOne({
            order: {
                id: "DESC"
            }
        });

        out = {
            ...latest,
            weather: "",
            location_name: "",
            roomName: ""
        }

        //Add the weather-icon to the outgoing data
        if (latest !== undefined) {
            const weather_postalCode = latest.location;
            const openweathermap_api_key = 'c23b6eb0df192e3eed784aa71777b7da'
            const request_uri = `https://api.openweathermap.org/data/2.5/weather?zip=${weather_postalCode},DE&appid=${openweathermap_api_key}`;
            const object_with_coordinates = await genericRequestToURI("GET", request_uri);

            // console.log('obj', object_with_coordinates);

            if (object_with_coordinates['coord']) {
                const lat = object_with_coordinates['coord']['lat'];
                const lon = object_with_coordinates['coord']['lon'];

                const weather_request_uri = `https://api.brightsky.dev/current_weather?lat=${lat}&lon=${lon}`;
                const weather = await genericRequestToURI("GET", weather_request_uri);

                out['weather'] = weather['weather']['icon'];
                out['location_name'] = object_with_coordinates['name'];

                // Get ESPConfig associated with the sensor
                const theEsp: ESPConfig = await espConfigData.findOne({ id: latest.deviceID })

                // Add roomName to outgoing data
                if (theEsp !== undefined && theEsp.hasOwnProperty("roomName")) {
                    console.log("roomName", theEsp.roomName)
                    out.roomName = theEsp.roomName;
                }
            }
            // console.log("Res", latest);
            returnNotNull(out, res)
        }
        else {
            return res.send({ message: "The requested entry did not exist" })
        }
    });

    //Get the latest data from the indoor table  
    app.get('/indoor/latest', async (req, res) => {
        let out;
        //Get the latest entry by ordering DESC and picking the last entry
        const latest = await indoorData.findOne({
            order: {
                id: "DESC"
            }
        });

        out = {
            ...latest,
            gasValCalibrationValue: -1,
            roomName: ""
        }

        // Get ESPConfig associated with the sensor
        const theEsp: ESPConfig = await espConfigData.findOne({ id: latest.deviceID })

        // Add the calibration value to the outgoing data
        if (latest.deviceID !== -1) {
            if (theEsp !== undefined && theEsp.hasOwnProperty("gasValCalibrationValue")) {
                out.gasValCalibrationValue = theEsp.gasValCalibrationValue;
            }
        }

        // Add roomName to outgoing data
        if (theEsp !== undefined && theEsp.hasOwnProperty("roomName")) {
            console.log("roomName", theEsp.roomName)
            out.roomName = theEsp.roomName;
        }

        returnNotNull(out, res)
    });

    //History data for the outdoor sensor
    app.post('/outdoor/history', async (req, res) => {
        const beginTimestamp = req.body.begin;
        const endTimestamp = req.body.end;

        if (parseDateHelper(beginTimestamp) && parseDateHelper(endTimestamp)) {
            // debugLog("begin", beginTimestamp)
            // debugLog("end", endTimestamp)

            const history = await outdoorData.find({
                where: [
                    { timestamp: Between(beginTimestamp, endTimestamp) }
                ]
            });
            returnNotNull(history, res)
        }
        else {
            res.status(400).json({});
        }
    });

    //History data for the outdoor sensor
    app.post('/indoor/history', async (req, res) => {
        console.log("req.body", req.body)
        const beginTimestamp = req.body.begin;
        const endTimestamp = req.body.end;

        // console.log(beginTimestamp, endTimestamp)

        if (parseDateHelper(beginTimestamp) && parseDateHelper(endTimestamp)) {
            // debugLog("begin", beginTimestamp)
            // debugLog("end", endTimestamp)

            const history = await indoorData.find({
                where: [
                    { timestamp: Between(beginTimestamp, endTimestamp) }
                ]
            });
            returnNotNull(history, res)
        }
        else {
            res.status(400).json({});
        }
    });

    // -------------------------------------- Insert sensor data -----------------------------

    //The outdoor sensors insert data on this route
    app.post('/outdoor/insert', async (req, res) => {
        const outdoor = new Outdoor();
        outdoor.humidity = req.body.humidity;
        outdoor.temperature = req.body.temperature;
        outdoor.location = req.body.location;
        outdoor.pressure = req.body.pressure;
        outdoor.timestamp = getDateFormatted();
        outdoor.deviceID = req.body.deviceID;
        const deviceID = req.body.deviceID;

        await outdoorData.create(outdoor);
        await outdoorData.save(outdoor);

        //The device already has an ID and an associated device in the DB. 
        if (deviceID !== -1) {

            /*
            * Return the current sensor config back to the sensor
            * For the reason of saving battery lifespan the outdoor sensor does not have an event or http listener that is permanently active
            * Instead, the config objects are sent back every time the sensor delivers data. The sensors of both types will then overwrite their local memory with the
            * received config data
            */
            const return_val = await espConfigData.findOne({ id: deviceID });
            // Remove these properties because they are irrelevant on the ESP
            delete return_val.gasValCalibrationValue;
            delete return_val.sensorType;
            return res.send(return_val);
        }
        //The device does not yet exist "Case: first data the sensor ever sends". A new device object will be created and the ID (and some other default configs) will be passed to the device
        else {
            const result = await registerNewDeviceESPConfig(sensorTypes.outdoor);
            // Remove these properties because they are irrelevant on the ESP
            delete result.gasValCalibrationValue;
            delete result.sensorType;
            return res.send(result);
        }
    });

    //The indoor sensors insert data on this route
    app.post('/indoor/insert', async (req, res) => {
        const indoor = new Indoor();
        indoor.humidity = req.body.humidity;
        indoor.gasVal = req.body.gasVal;
        indoor.temperature = req.body.temperature;
        indoor.location = req.body.location;
        indoor.timestamp = getDateFormatted();
        indoor.deviceID = req.body.deviceID;

        const deviceID = req.body.deviceID;

        await indoorData.create(indoor);
        await indoorData.save(indoor);

        /*
        * Return the current sensor config back to the sensor
        * For the reason of saving battery lifespan the outdoor sensor does not have an event or http listener that is permanently active
        * Instead, the config objects are sent back every time the sensor delivers data. The sensors of both types will then overwrite their local memory with the
        * received config data
        */
        if (deviceID !== -1) {
            const return_val = await espConfigData.findOne({ id: deviceID });
            // Remove these properties because they are irrelevant on the ESP
            delete return_val.gasValCalibrationValue;
            delete return_val.sensorType;
            return res.send(return_val);
        }
        //The device does not yet exist "Case: first data the sensor ever sends". A new device object will be created and the ID (and some other default configs) will be passed to the device
        else {
            const result = await registerNewDeviceESPConfig(sensorTypes.indoor);
            // Remove these properties because they are irrelevant on the ESP
            delete result.gasValCalibrationValue;
            delete result.sensorType;
            return res.send(result);
        }
    });

    // -------------------------------------- Pollen -----------------------------

    //Request all pollen objects
    app.get('/pollen/all', async (req, res) => {
        const pollen = await pollenData.find();
        //Append the "severity" of the pollen by using an external API (opendata.dwd.de)
        const pollenLoadsPerRegion = await genericRequestToURI("GET", 'https://opendata.dwd.de/climate_environment/health/alerts/s31fg.json');
        const pollenLoadForRegionOfInterest: Object = pollenLoadsPerRegion["content"].find(e => e.partregion_name === "Hohenlohe/mittlerer Neckar/Oberschwaben").Pollen;
        //Append the data for the pollen to the output object
        pollen.forEach(pollenObj => {
            if (pollenLoadForRegionOfInterest.hasOwnProperty(pollenObj.pollenName)) {
                pollenObj["loadRating"] = pollenLoadForRegionOfInterest[pollenObj.pollenName].today;
            }
        });

        returnNotNull(pollen, res);
    });

    //Request one pollen object by id
    app.get('/pollen/:id', async (req, res) => {
        const pollen = await pollenData.findOne({ id: req.params.id })
        returnNotNull(pollen, res);
    })

    //Create a new pollen object into the db
    app.post('/pollen/insert', async (req, res) => {
        const entry = await pollenData.create(req.body);
        const results = await pollenData.save(entry);
        return res.send(results);
    });

    //Add a Pollen object to a user
    app.post('/pollen/save', async (req, res) => {
        //Get the auth token and validate it (personalization options are only available if the user is logged in)
        const token = req.headers["x-access-token"] || req.headers["authorization"];
        validateToken(token).then(async (success) => {
            if (success) {
                //Lookup Pollen and user Objects
                const userID = req.body.userID;
                const pollenID = req.body.pollenID;
                const pollen = await (await pollenData.find({ relations: ['users'] })).filter(pl => pl.id === pollenID)
                const user = await userCtxData.findOne({ id: userID })
                //If the user has no Pollen assigned, assign the new one, else append
                if (pollen[0].users === undefined) {
                    pollen[0].users = [user]
                }
                else {
                    pollen[0].users.push(user);
                }

                //Persist the changes to the db
                await connection.manager.save(user);
                await connection.manager.save(pollen);

                res.send({ "result": "OK" });
            }
        }).catch((error) => {
            debugLog("error in pollen/save", error)
            return res.send({ "error": error });
        })
    });

    //Remove a pollen object from a user
    app.delete('/pollen/delete', async (req, res) => {
        const userID = req.body.userID
        const pollenID = req.body.pollenID

        //Get the auth token and validate it (personalization options are only available if the user is logged in)
        const token = req.headers["x-access-token"] || req.headers["authorization"];
        validateToken(token).then(async (success) => {
            if (success) {

                //Remove the pollen object from the user. Do some type checks.
                const pollen = await (await pollenData.find({ relations: ["users"] })).filter(pl => pl.id === pollenID);
                if (pollen.length === 1) {
                    // console.log("pollen.users", pollen[0].users)
                    pollen[0].users = pollen[0].users.filter(usr => usr.id !== userID)
                    await pollenData.save(pollen[0])
                }
                return res.send(pollen);
            }
        }).catch((error) => {
            return res.send({ "error": error });
        })
    })

    //Get the pollen associated with a user (by username)
    app.get('/pollen/byUsername/:username', async (req, res) => {
        //Get the auth token and validate it (personalization options are only available if the user is logged in)
        const token = req.headers["x-access-token"] || req.headers["authorization"];
        validateToken(token).then(async (success) => {
            if (success) {
                const username = req.params.username;
                let userPollenNames: Array<string> = [];
                const allergies = await pollenData.find({ relations: ["users"] });

                //Iterate all Pollen and check if it associated to the given username
                allergies.forEach(allergy => {
                    // debugLog("allergy:", allergy)
                    if (allergy.users.length > 0) {
                        allergy.users.forEach(user => {
                            if (user.username === username) {
                                // console.log("user was", user.username, "pollen was", allergy.pollenName);
                                userPollenNames.push(allergy.pollenName);
                            }
                        })
                    }
                });
                debugLog("pollen for user", username + ": " + userPollenNames);
                returnNotNull(userPollenNames, res);
            }
        }).catch((error) => {
            return res.send({ "error": error });
        })
    })

    // -------------------------------------- Users -----------------------------

    //Request a UserContext object from the db
    app.get('/userContext/:username', async (req, res) => {
        const userCtx = await userCtxData.findOne({ username: req.params.username });
        returnNotNull(userCtx, res);
    })

    //Register a new user
    app.post('/userContext/new', async (req, res) => {
        debugLog("the req.body", req.body)
        const entry = await userCtxData.create(req.body)
        const results = await userCtxData.save(entry);
        returnNotNull(results, res);
    });

    //Modify a UserContext object
    app.put('/userContext/save/:id', async (req, res) => {
        //Get the auth token and validate it (personalization options are only available if the user is logged in)
        const token = req.headers["x-access-token"] || req.headers["authorization"];
        debugLog("token", token);
        validateToken(token).then(async (success) => {
            console.log("success var", success)
            if (success) {
                const entry = await userCtxData.findOne(req.params.id)
                console.log("entry before", entry)
                //Setting id as the value of the database not the one provided by the request body 
                //-> consitency and no duplicate ids
                req.body.id = entry.id;
                console.log("req.body", req.body)
                const results = await userCtxData.save(req.body);
                console.log("entry after", results);
                returnNotNull(results, res);
            }
        }).catch((error) => {
            console.log("catch err", error)
            return res.send({ "error": error });
        })
    });

    //Overwrite the personalization values with the data from a user's openAPE account
    app.put('/userContext/saveOpenAPESettings/:id', async (req, res) => {
        //Get the auth token and validate it (personalization options are only available if the user is logged in)
        const token = req.headers["x-access-token"] || req.headers["authorization"];
        debugLog("token", token);
        validateToken(token).then(async (success) => {
            if (success) {
                const entry = await userCtxData.findOne(req.params.id)
                debugLog("entry before", entry)
                //Setting id as the value of the database not the one provided by the request body 
                //-> consitency and no duplicate ids
                req.body.id = entry.id;
                const results = await userCtxData.save(req.body);
                debugLog("entry after", results);
                returnNotNull(results, res);
            }
        }).catch((error) => {
            return res.send({ "error": error });
        })
    });

    // -------------------------------------- ESPConfig -----------------------------

    //Modify a sensor/ESPConfig object
    app.post('/espconfig/change', async (req, res) => {
        const espconf = await espConfigData.findOne({ id: req.body.id });
        espconf.transmissionFrequency = req.body.transmissionFrequency;
        espconf.postalCode = req.body.postalCode;
        espconf.roomName = req.body.roomName;
        espconf.gasValCalibrationValue = req.body.gasValCalibrationValue;
        const result = await connection.manager.save(espconf);

        return res.send(result);
    })

    //Get all sensor/ESPConfig objects
    app.get('/espconfig/all', async (req, res) => {
        const allEsps = await espConfigData.find();
        return res.send(allEsps);
    })

    // -------------------------------------- Forecast -----------------------------

    //Get the latest data from the forecast table  
    app.get('/forecast/latest', async (req, res) => {
        const latest = await forecastData.findOne({
            order: {
                id: "DESC"
            }
        });
        returnNotNull(latest, res)
    });

    //Insert new forecast entry into forecast table
    app.post('/forecast/insert', async (req, res) => {
        try {
            debugLog("body", req.body);
            const forecast = await forecastData.create(req.body);
            const results = await forecastData.save(forecast);
            debugLog("results", results);
            returnNotNull(results, res);
        } catch (error) {
            console.log("(Forecast) Inserting a new dataset failed")
            console.log("Error:", error)
            return res.send({ message: "The requested operation failed" })
        }
    });

    //Get the last 9 forecast entries for new forecast
    app.get('/forecast/history', async (req, res) => {
        const history = await forecastData.find({
            order: {
                id: "DESC"
            },
            take: 9
        });
        debugLog("history", history);
        returnNotNull(history, res);
    });

    // -------------------------------------- Calibration -----------------------------

    //Insert a new calibration task to the database
    app.post('/calibration/insert', async (req, res) => {
        const _calibration = {
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            deviceID: req.body.deviceID
        }
        const calibration = await calibrationData.create(_calibration);
        const result = await calibrationData.save(calibration);
        returnNotNull(result, res);
    })

    //Get the latest calibration task
    app.get('/calibration/latest', async (req, res) => {
        const latest = await calibrationData.find()
        console.log("latest?", latest[latest.length - 1])
        returnNotNull(latest[latest.length - 1], res);
    })

    //Delete a calibration task by id
    app.delete('/calibration/:id', async (req, res) => {
        await calibrationData.delete({ id: req.params.id })
        return res.send({ result: "ok" })
    })

    // ------------------------------------------------ Helper ------------------------------------------------

    //Helper to handle statusCodes and error cases for e.g. empty database or wrong parameters
    const returnNotNull = (databaseOutput: any, res: any): void => {
        if (databaseOutput === undefined) {
            console.log("database input was undefined");
            res.status(400).json({ message: "Requested entry did not exist" });
        }
        else {
            res.status(200).json(databaseOutput);
        }
    }

    //Validate a date by RegExp to check for valid formatting so SQLite does not throw errors
    const parseDateHelper = (date: string): boolean => {
        //TODO: The regex is somewhat improved but still far from perfect (month 13 still works etc.) 
        //but this is not really solvable with regex since you are only able to specify allowed character (ranges) and not e.g. number values
        let dateFormatRegex: RegExp = /(20[0-9]{2})-([0-2]{1}[0-9]{1})-([0-2]{1}[0-9]{1}) ([0-5]{1}[0-9]{1}:){2}([0-9]){2}/
        return dateFormatRegex.test(date);
    }

    //Get the current date in "our format" (mandatory to make date comparisons with SQLite) --> "YYYY-MM-DD HH:MM:SS"
    const getDateFormatted = (): string => {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
        let formatted = localISOTime.split(".")[0].replace("T", " ");
        return formatted;
    }

    //Helper to create a new sensor/ESPConfig object. Provides defaults for the config data of the new ESPConfig
    const registerNewDeviceESPConfig = async (sensorType: sensorTypes): Promise<ESPConfig> => {
        // const rndInt =  Math.floor(Math.random() * (max - min + 1) + min)
        const rndInt = Math.floor(Math.random() * (500 - 1 + 1) + 1)
        const newDevice = new ESPConfig();
        newDevice.roomName = "device" + rndInt;
        newDevice.postalCode = "70565";
        newDevice.transmissionFrequency = 1
        newDevice.sensorType = sensorTypes[sensorType]

        const result = await connection.manager.save(newDevice);
        return result;
    }

    //Logging helper
    const debugLog = (message1: string, message2?: any): void => {
        if (debugEnabled) {
            console.log(message1 + " " + message2);
            console.log("==========================================");
        }
    }

    //Helper to validate an auth-token using the auth-service
    const validateToken = (token) => {
        return new Promise((resolve, reject) => {
            request(
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    uri: "http://localhost:4202/checkToken",
                    method: "GET"
                },
                function (error, response, body) {
                    if (error) {
                        reject("Error in auth-service statusCode: " + response.statusCode);
                    } else {
                        let data = JSON.parse(body);
                        if (data.success) {
                            resolve(true)
                        } else {
                            reject("Error in request: The request is unauthorized");
                        }
                    }
                }
            );
        })
    };

    //Helper to request data from external APIs
    const genericRequestToURI = (method, uri) => {
        return new Promise((resolve, reject) => {
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
                    if (error) {
                        reject(error);
                    }
                    resolve(JSON.parse(body))
                }
            );
        });
    }

    enum sensorTypes {
        outdoor,
        indoor
    }

    console.log("listening on port", port)
    app.listen(port);

});