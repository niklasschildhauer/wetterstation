"use strict"

const port = 4203;

const express = require('express');
const app = express();
const grh = require("./lib/shared");
app.use(express.json({type: "application/json" }));

app.get('/', function (req, res) {
    res.status(200).send("Hello from port " + port);
});

// Utility route when the user is already known
app.post('/userContextUtility', (req, res) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    let db_user = req.body;
    let externals = getExternalData();
    grh.genericRequest(token, "GET", 'http://localhost:4205/pollen/byUsername/' + db_user.username).then((pollen) => {
        let out = {
            id : db_user.id,
            username: db_user.username,
            theme: externals.theme,
            fontSize: externals.fontSize,
            selfVoicingEnabled : externals.selfVoicingEnabled,
            doVentilationReminder : externals.doVentilationReminder,
            reduceMotion : externals.reduceMotion,
            pollen : JSON.parse(pollen)
        };
        res.status(200).json(out);
    })
})

app.post('/register', (req, res) => {
    //TODO: OpenAPE stuff register
    saveExternalData();

    grh.genericRequestWithPayload("", "POST", 'http://localhost:4205/userContext/save', JSON.stringify(req.body), res).then((response) => {
        let externals = getExternalData()
        let db_user = JSON.parse(response)

        //No pollen allergies recorded here
        let out = {
            id : db_user.id,
            username: db_user.username,
            theme: externals.theme,
            fontSize: externals.fontSize,
            selfVoicingEnabled : externals.selfVoicingEnabled,
            doVentilationReminder : externals.doVentilationReminder,
            reduceMotion : externals.reduceMotion,
            pollen : []
        };

        res.status(200).json(out);
    });
})

const getExternalData = () => {
    //TODO: implement
    return {
        theme: "dark", //TODO: Request from APE
        fontSize: 16, //TODO: Request from APE
        selfVoicingEnabled: true, //TODO: Request from APE
        doVentilationReminder: true, //TODO: Request from APE, speaker must be configurable on Raspberry
        reduceMotion: true, //TODO: Request from APE
    }
}

const saveExternalData = () => {
    //TODO: implement@
}

console.log("listening on port", port)
app.listen(port);





const url_login = 'https://gpii.openape.eu/token' // Login w/ credentials {username: "...", password: "...", grant_type:"password"}
const postdata_login = {
    username: "...",
    password: "...",
    grant_type: "password"
}

const url_contexts = 'https://gpii.openape.eu/api/user-contexts'

const url_context_id = 'https://gpii.openape.eu/api/user-contexts/:id'