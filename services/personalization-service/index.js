"use strict"

const port = 4203;

var express = require('express');
const { OPEN_PRIVATECACHE } = require('sqlite3');
const { Db } = require('typeorm');
var app = express();

app.get('/', function (req, res) {
    res.status(200).send("Hello from port " + port);
});

app.get('/user-context', (req, res) => {
    
    const out = {
        theme: "", //TODO: Request from APE
        fontSize: "", //TODO: Request from APE
        selfVoicingEnabled: "", //TODO: Request from APE
        pollen: [ // TODO: Get from our DB, clarify typing
            Ambrosia,
            Beifuss,
            Birke,
            Erle,
            Esche,
            Graeser,
            Hasel,
            Roggen,
        ],
        doVentilationReminder: "", //TODO: Request from APE, speaker must be configurable on Raspberry
        reduceMotion: "", //TODO: Request from APE
        
    }


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



const url_login = 'https://gpii.openape.eu/token' // Login w/ credentials {username: "...", password: "...", grant_type:"password"}
const postdata_login = { 
    username: "...", 
    password: "...", 
    grant_type: "password"
}

const url_contexts = 'https://gpii.openape.eu/api/user-contexts'

const url_context_id = 'https://gpii.openape.eu/api/user-contexts/:id'

console.log("listening on port", port)
app.listen(port);