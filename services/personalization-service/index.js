"use strict"

const port = 4203;

const express = require('express');
const app = express();
const grh = require("./lib/shared");
const openApeClient = require("./lib/openape");
const OpenApeClient = openApeClient.openApeClient;
app.use(express.json({type: "application/json" }));

app.get('/', function (req, res) {
    res.status(200).send("Hello from port " + port);
});

// Utility route when the user is already known
app.post('/userContextUtility', (req, res) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    let db_user = req.body;
    let externals = getOpenApeData();
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
        let externals = getOpenApeData()
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

app.get('/test', (req,res) => {
    getOpenApeData();

    res.status(200).json("ok");
})

const getOpenApeData = () => {
    const client = new OpenApeClient("am206", "schmurx123", "https://openape.gpii.eu");
    const arrayOfPreferences = [];
    client.getUserContextList((ctxList) => {
        // console.log("IT WORKS:", ctxList)
        if(ctxList["user-context-uris"]){
            ctxList["user-context-uris"].forEach(element => {
                client.getUserContext(element, (data) => {
                    // console.log("SUCCESS CB", data);
                    arrayOfPreferences.push(data.default.preferences)
                })
            });
        }
        else {
            console.log("weird **** happened");
        }
    })

    console.log("theArray", arrayOfPreferences)

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

/**
 * 
{
  "default": {
    "name": "Default context",
    "preferences": {
      "http://terms.gpii.eu/screenLockTimeout": 600
    }
  }
}
 */