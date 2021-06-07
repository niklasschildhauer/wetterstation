import "reflect-metadata";
import { Between, createConnection } from "typeorm";
import { Outdoor } from "./entity/Outdoor";
import { Indoor } from "./entity/Indoor";
import { UserContext } from "./entity/UserContext";
import { Pollen } from "./entity/Pollen";
import { ESPConfig } from "./entity/ESPconfig";

"use strict"

// create typeorm connection
createConnection().then(connection => {
    const outdoorData = connection.getRepository(Outdoor);
    const indoorData = connection.getRepository(Indoor);
    const userCtxData = connection.getRepository(UserContext);
    const pollenData = connection.getRepository(Pollen);
    const espConfigData = connection.getRepository(ESPConfig);

    //set up express 
    const port = 4205;
    var express = require('express');
    var app = express();
    app.use(express.json());


    // -------------------------------------- Outdoor / Indoor requests -----------------------------

    //Get the latest data from the outdoor table  
    app.get('/outdoor/latest', async (req, res) => {
        const latest = await outdoorData.findOne({
            order: {
                id: "DESC"
            }
        });
        returnNotNull(latest, res)
    });

    //Get the latest data from the indoor table  
    app.get('/indoor/latest', async (req, res) => {
        const latest = await indoorData.findOne({
            order: {
                id: "DESC"
            }
        });
        returnNotNull(latest, res)
    });

    app.post('/outdoor/history', async (req, res) => {
        const beginTimestamp = req.body.begin;
        const endTimestamp = req.body.end;

        if (parseDateHelper(beginTimestamp) && parseDateHelper(endTimestamp)) {
            // console.log("begin", beginTimestamp)
            // console.log("end", endTimestamp)

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


    app.post('/indoor/history', async (req, res) => {
        const beginTimestamp = req.body.begin;
        const endTimestamp = req.body.end;

        if (parseDateHelper(beginTimestamp) && parseDateHelper(endTimestamp)) {
            // console.log("begin", beginTimestamp)
            // console.log("end", endTimestamp)

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
        const deviceID = req.body.deviceID;

        await outdoorData.create(outdoor);
        await outdoorData.save(outdoor);

        if (deviceID !== -1) {
            const return_val = await espConfigData.findOne({ id: deviceID });
            return res.send(return_val);
        } else {
            const result = await registerNewDeviceESPConfig();
            
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

        const deviceID = req.body.deviceID;

        await indoorData.create(indoor);
        await indoorData.save(indoor);

        if (deviceID !== -1) {
            const return_val = await espConfigData.findOne({ id: deviceID });
            
            return res.send(return_val);
        }
        else {
            const result = await registerNewDeviceESPConfig();
            return res.send(result);
        }
    });

    // -------------------------------------- Pollen -----------------------------

    //Request all pollen objects
    app.get('/pollen/all', async (req, res) => {
        const pollen = await pollenData.find();
        returnNotNull(pollen, res);
    });

    //Request one pollen object by id
    app.get('/pollen/:id', async (req, res) => {
        console.log("hello", req.params.id);
        const pollen = await pollenData.findOne({ id: req.params.id })
        console.log("pollen", pollen)
        returnNotNull(pollen, res);
    })

    //Create a new pollen object into the db
    app.post('/pollen/insert', async (req, res) => {
        const entry = await pollenData.create(req.body);
        const results = await pollenData.save(entry);
        return res.send(results);
    });

    app.post('/pollen/save', async (req, res) => {
        const userID = req.body.userID;
        const pollenID = req.body.pollenID;
        const pollen1 = await pollenData.findOne({id:pollenID})

        const user = await userCtxData.findOne({id: userID})
        pollen1.users = [user]

        await connection.manager.save(user);
        await connection.manager.save(pollen1);

        const allergies = await pollenData.find({relations: ["users"]})
        console.log(allergies);
        res.send({"result": "OK"});
    });

    app.get('/pollen/byUsername/:username', async (req, res) => {
        const username = req.params.username;
        let userPollenNames: Array<string> = [];
        const allergies = await pollenData.find({ relations: ["users"] });

        allergies.forEach(allergy => {
            // console.log("allergy:", allergy)
            console.log(allergy.users)
            if(allergy.users.length > 0){
                if(allergy.users[0].username === username){
                    // console.log("pollen in this allergy object", allergy.pollen);
                    userPollenNames.push(allergy.pollenName);
                }
            }
            else{
                // console.log("no allergies?")
            }
        });
        // console.log("pollen for user", username, ":", userPollenNames);
        returnNotNull(userPollenNames, res);
    })

    // -------------------------------------- Users -----------------------------

    //Request a UserContext object from the db
    app.get('/userContext/:username', async (req, res) => {
        const userCtx = await userCtxData.findOne({ username: req.params.username });
        returnNotNull(userCtx, res);
    })

    //Save a new UserContext object to the db
    app.post('/userContext/save', async (req, res) => {
        const entry = await userCtxData.create(req.body)
        const results = await userCtxData.save(entry);
        returnNotNull(results, res);
    });

    // -------------------------------------- ESPConfig -----------------------------

    app.post('/espconfig/change', async (req, res) => {
        const espconf = await espConfigData.findOne({ id: req.body.id });
        espconf.transmissionFrequency = req.body.transmissionFrequency;
        espconf.postalCode = req.body.postalCode;
        espconf.roomName = req.body.roomName;
        const result = await connection.manager.save(espconf);

        return res.send(result);
    })

    app.get('/espconfig/all', async (req, res) => {
        const allEsps = await espConfigData.find();
        return res.send(allEsps);
    })


    // app.get('/test', async (req, res) => {
    //     const test1 = new ESPConfig()
    //     test1.postalCode = "787878"
    //     test1.roomName = "raum123"
    //     test1.transmissionFrequency = 14
    //     const result = await connection.manager.save(test1)

    //     const test2 = new ESPConfig();
    //     test2.postalCode = "787878123231321321"
    //     test2.roomName = "schmurx"
    //     test2.transmissionFrequency = 141414
    //     const resT2 = await connection.manager.save(test2)

    //     const user = await userCtxData.findOne({id: 1});
    //     user.sensors = [test1, test2]
    //     await connection.manager.save(user);

    //     return res.send("ok")
    // })

    // ------------------------------------------------ Helper ------------------------------------------------

    const returnNotNull = (databaseOutput: any, res: any): void => {
        if (databaseOutput === undefined) {
            console.log("database input was undefined");
            res.status(400).json({message:"Requested entry did not exist"});
        }
        else {
            res.status(200).json(databaseOutput);
        }
    }

    const parseDateHelper = (date: string): boolean => {
        //TODO: The regex is somewhat improved but still far from perfect (month 13 still works etc.) 
        //but this is not really solvable with regex since you are only able to specify allowed character (ranges) and not e.g. number values
        let dateFormatRegex: RegExp = /(20[0-9]{2})-([0-2]{1}[0-9]{1})-([0-2]{1}[0-9]{1}) ([0-5]{1}[0-9]{1}:){2}([0-9]){2}/
        return dateFormatRegex.test(date);
    }

    const registerNewDeviceESPConfig = async (): Promise<ESPConfig> => {
        // const rndInt =  Math.floor(Math.random() * (max - min + 1) + min)
        const rndInt = Math.floor(Math.random() * (500 - 1 + 1) + 1)
        const newDevice = new ESPConfig();
        newDevice.roomName = "device" + rndInt;
        newDevice.postalCode = "70565";
        newDevice.transmissionFrequency = 10

        const result = await connection.manager.save(newDevice);
        return result;
    }

    console.log("listening on port", port)
    app.listen(port);

});