import "reflect-metadata";
import { Between, createConnection} from "typeorm";
import { Outdoor } from "./entity/Outdoor";
import { Indoor } from "./entity/Indoor";
import { UserContext } from "./entity/UserContext";
import { Allergy} from "./entity/Allergy";
import { Pollen } from "./entity/Pollen";

"use strict"

// create typeorm connection
createConnection().then(connection => {
    const outdoorData = connection.getRepository(Outdoor);
    const indoorData = connection.getRepository(Indoor);
    const userCtxData = connection.getRepository(UserContext);
    const allergyData = connection.getRepository(Allergy);
    const pollenData = connection.getRepository(Pollen);

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

        if(parseDateHelper(beginTimestamp) && parseDateHelper(endTimestamp)){
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

        if(parseDateHelper(beginTimestamp) && parseDateHelper(endTimestamp)){
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
        const outdoor = await outdoorData.create(req.body);
        const results = await outdoorData.save(outdoor);
        return res.send(results);
    });

    //The indoor sensors insert data on this route
    app.post('/indoor/insert', async (req, res) => {
        const indoor = await indoorData.create(req.body);
        const results = await indoorData.save(indoor);
        return res.send(results);
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
        const pollen = await pollenData.findOne({id:req.params.id})
        console.log("pollen", pollen)
        returnNotNull(pollen, res);
    })

    //Create a new pollen object into the db
    app.post('/pollen/insert', async (req, res) => {
        const entry = await pollenData.create(req.body);
        const results = await pollenData.save(entry);
        return res.send(results);
    });

    // -------------------------------------- Users -----------------------------

    //Request a UserContext object from the db
    app.get('/userContext/:username', async (req, res) => {
        const userCtx = await userCtxData.findOne({username: req.params.username});
        returnNotNull(userCtx, res);
    })

    //Save a new UserContext object to the db
    app.post('/userContext/save', async (req, res) => {
        const entry = await userCtxData.create(req.body)
        const results = await userCtxData.save(entry);
        return res.send(results);
    });

    // -------------------------------------- Allergy -----------------------------

    //Save a new Allergy object to the db
    app.post('/allergy/save', async (req, res) => {
        const userId = req.body.userId;
        const pollenId = req.body.pollenId;
        const user = await userCtxData.findOne({id: userId});
        const pollen = await pollenData.findOne({id: pollenId});

        const allergy = new Allergy();
        const result = await connection.manager.save(allergy)
        user.allergies = [allergy];
        await connection.manager.save(user);
        pollen.allergies = [allergy];
        await connection.manager.save(pollen);

        returnNotNull(result, res);
    });

    // ------------------------------------------------ Helper ------------------------------------------------

    const returnNotNull = (databaseOutput: any, res: any): void => {
        if (databaseOutput === undefined) {
            console.log("database input was undefined");
            res.status(204).json({});
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

    console.log("listening on port", port)
    app.listen(port);

});
