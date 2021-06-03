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
    let db_user = req.body;
    let externals = getExternalData();
    grh.genericRequest("", 'http://localhost:4205/pollen/byUsername/' + db_user.username).then((pollen) => {
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

app.get('/userContext', (req, res) => {
    const db_user = ""

    // export interface UserContext {
    //     theme: Themes,
    //     fontSize: number, // in %
    //     pollen: Pollen[], // Um die Mockdaten einfacher zu erstellen in Array konvertiert. Kann auch wieder in Map<Pollen, boolean> gewandelt werden. 
    //     selfVoicingEnabled: boolean,
    //     doVentilationReminder: boolean, // TODO: What if multiple users have concurring settings here?
    //     //simpleLanguage: boolean, //TODO: Is this neccessary? Because we have few text elements in the UI.
    //     reduceMotion: boolean, // New element: For people with vestibular disorders is animation triggerd by scrolling not good.
    // }

    // export enum Pollen {
    //     Ambrosia,
    //     Beifuss,
    //     Birke,
    //     Erle,
    //     Esche,
    //     Graeser,
    //     Hasel,
    //     Roggen,
    // }
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