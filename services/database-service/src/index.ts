import "reflect-metadata";
import {createConnection} from "typeorm";
import {Outdoor} from "./entity/Outdoor";
import express from 'express';


"use strict"


// create typeorm connection
createConnection().then(connection => {
    const outdoorData = connection.getRepository(Outdoor);


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



    app.get('/outdoorall', async (req, res) => {
            const outdoors = await outdoorData.find();
            res.json(outdoors);
            console.log(outdoors);
        });

    app.post('/outdoorinsert', async (req, res) => {
        console.log("ich lebe")
        const outdoor = await outdoorData.create(req.body);
        const results = await outdoorData.save(outdoor);
        return res.send(results);
    });




    console.log("listening on port", port)
    app.listen(port);

});
