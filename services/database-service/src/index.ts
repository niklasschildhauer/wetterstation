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


    /* app.get('/', function (req, res) {
         res.status(200).send("Hello from port " + port);
     });
 
 
 /*
 // Connection to the database entitiy
 createConnection().then(async connection => {
 
     console.log("Inserting new sensor data...");
     const outdoor = new Outdoor();
     outdoor.humidity = 30;
     outdoor.temperature = 24;
     outdoor.pressure = 7;
     await connection.manager.save(outdoor);
     console.log("Saved new outdoor data with id: " + outdoor.id);
 
     console.log("Loading outdoor from the database...");
     const outdoors = await connection.manager.find(Outdoor);
     console.log("Loaded outdoors: ", outdoors);
 
 }).catch(error => console.log(error));
 */



    // app.get('/outdoor/all', async (req, res) => {
    //     const outdoors = await outdoorData.find({
    //         order: {
    //             id: "DESC"
    //         }
    //     });
    //     res.json(outdoors);
    //     console.log(outdoors);
    // });


    //Get the latest data from the outdoor table  
    app.get('/outdoor/latest', async (req, res) => {
        const latest = await outdoorData.findOne({
            order: {
                id: "DESC"
            }
        });
        res.json(latest);
    });

    //Get the latest data from the indoor table  
    app.get('/indoor/latest', async (req, res) => {
        const latest = await indoorData.findOne({
            order: {
                id: "DESC"
            }
        });
        res.json(latest);
    });


    app.post('/outdoor/history', async (req, res) => {
        const beginTimestamp = req.body.begin;
        const endTimestamp = req.body.end;

        // console.log("begin", beginTimestamp)
        // console.log("end", endTimestamp)

        const history = await outdoorData.find({
            where: [
                { timestamp: Between(beginTimestamp, endTimestamp) }
            ]
        });
        res.json(history);
    });

    
    app.post('/indoor/history', async (req, res) => {
        const beginTimestamp = req.body.begin;
        const endTimestamp = req.body.end;

        // console.log("begin", beginTimestamp)
        // console.log("end", endTimestamp)

        const history = await indoorData.find({
            where: [
                { timestamp: Between(beginTimestamp, endTimestamp) }
            ]
        });
        res.json(history);
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

    console.log("listening on port", port)
    app.listen(port);

});
