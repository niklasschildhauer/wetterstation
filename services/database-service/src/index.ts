import "reflect-metadata";
import { Between, createConnection, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual } from "typeorm";
import { Outdoor } from "./entity/Outdoor";
import { Indoor } from "./entity/Indoor";

"use strict"


// create typeorm connection
createConnection().then(connection => {
    const outdoorData = connection.getRepository(Outdoor);
    const indoorData = connection.getRepository(Indoor);


    //set up express 
    const port = 4205;
    var express = require('express');
    var app = express();
    app.use(express.json());


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


    // ------------------------------------------------ Helper ------------------------------------------------

    const returnNotNull = (databaseOutput: any, res: any): void => {
        if (databaseOutput === undefined) {
            console.log("database input was undefined");
            res.json({});
        }
        else {
            res.status(200).json(databaseOutput);
        }
    }

    const parseDateHelper = (date: string): boolean => {
        let dateFormatRegex: RegExp = /([0-9]){4}-([0-9]){2}-([0-9]){2} ([0-9]){2}:([0-9]){2}:([0-9]){2}/
        return dateFormatRegex.test(date);
    }

    console.log("listening on port", port)
    app.listen(port);

});
