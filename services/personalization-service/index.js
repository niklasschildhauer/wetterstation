"use strict"

const port = 4203;

const express = require('express');
const app = express();
const grh = require("./lib/shared");
const openApeClient = require("./lib/openape");
const { genericRequestWithPayload, genericRequest } = require('./lib/shared');
const OpenApeClient = openApeClient.openApeClient;
app.use(express.json({ type: "application/json" }));

app.get('/', function (req, res) {
    res.status(200).send("Hello from port " + port);
});

// Utility route when the user is already known
app.post('/userContextUtility', (req, res) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    let db_user = req.body;
    grh.genericRequest(token, "GET", 'http://localhost:4205/pollen/byUsername/' + db_user.username).then((pollen) => {
        let out = {
            id: db_user.id,
            username: db_user.username,
            theme: db_user.theme,
            fontSize: db_user.fontSize,
            selfVoicingEnabled: db_user.selfVoicingEnabled,
            doVentilationReminder: db_user.doVentilationReminder,
            reduceMotion: db_user.reduceMotion,
            pollen: JSON.parse(pollen)
        };
        res.status(200).json(out);
    })
})

app.post('/register', (req, res) => {

    //No pollen allergies recorded here
    //Personalization settings set to default
    let reqObj = {
        username: req.body.username,
        password: req.body.password,
        theme: defaults.theme,
        fontSize: defaults.fontSize,
        selfVoicingEnabled: defaults.selfVoicingEnabled,
        doVentilationReminder: defaults.doVentilationReminder,
        reduceMotion: defaults.reduceMotion,
        pollen: []
    };

    grh.genericRequestWithPayload("", "POST", 'http://localhost:4205/userContext/new', JSON.stringify(reqObj), res).then((response) => {
        //Remove password from output object
        delete response.password
        res.status(200).json(JSON.parse(response));
    });
})

app.put('/save/:id', (req, res) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    const id = req.params.id;

    //Data sanitization -> not sending id as param
    const _body = {
        username: req.body.username,
        password: req.body.password,
        theme: req.body.theme,
        fontSize: req.body.fontSize,
        selfVoicingEnabled: req.body.selfVoicingEnabled,
        doVentilationReminder: req.body.doVentilationReminder,
        reduceMotion: req.body.reduceMotion
    }

    grh.genericRequestWithPayload(token, "PUT", 'http://localhost:4205/userContext/save/' + id, JSON.stringify(_body), res).then((response) => {
        //Remove password from output object
        delete response.password
        res.status(200).json(JSON.parse(response));
    });
})

app.post('/loadOpenAPESettingsAndSave', (req, res) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    let openApeUser = req.body.openApeUser;
    let openApePassword = req.body.openApePassword;

    genericRequest(token, "GET", "http://localhost:4202/currentUser").then(db_user => {
        let out = JSON.parse(db_user);
        delete out.pollen;

        // console.log("out?", out, typeof out)
        getOpenApeData(openApeUser, openApePassword).then((response) => {
            // console.log("response", response)
            
            //On behalf of all backend programmers: sorry for this
            response.forEach(entry => {
                if (typeof entry === 'object') {
                    if (entry.hasOwnProperty('http://terms.gpii.eu/selfVoicingEnabled')) {
                        console.log("has prop", entry['http://terms.gpii.eu/selfVoicingEnabled'])
                        out.selfVoicingEnabled = entry['http://terms.gpii.eu/selfVoicingEnabled']
                        console.log("true -->", out.selfVoicingEnabled);
                    }
                    else if (entry.hasOwnProperty('http://terms.gpii.eu/theme')) {
                        console.log("has prop", entry['http://terms.gpii.eu/theme'])
                        out["theme"] = entry['http://terms.gpii.eu/theme']
                    }
                    else if (entry.hasOwnProperty('http://terms.gpii.eu/fontSize')) {
                        console.log("has prop", entry['http://terms.gpii.eu/fontSize'])
                        out.fontSize = entry['http://terms.gpii.eu/fontSize']
                    }
                    else if (entry.hasOwnProperty('http://terms.gpii.eu/doVentilationReminder')) {
                        console.log("has prop", entry['http://terms.gpii.eu/doVentilationReminder'])
                        out.doVentilationReminder = entry['http://terms.gpii.eu/doVentilationReminder']
                    }
                    else if (entry.hasOwnProperty('http://terms.gpii.eu/reduceMotion')) {
                        console.log("has prop", entry['http://terms.gpii.eu/reduceMotion'])
                        out.reduceMotion = entry['http://terms.gpii.eu/reduceMotion']
                    }
                }
            });
            genericRequestWithPayload(token, "PUT", 'http://localhost:4205/userContext/save/' + out.id, JSON.stringify(out), res).then((response) => {
                // console.log("response-save", response)
                res.status(200).json(JSON.parse(response))
            }).catch(error => {
                res.status(400).json({ "error": error })
            });
        })
    });
})

app.get('/test', (req, res) => {
    getOpenApeData("am206", "schmurx123");

    res.status(200).json("ok");
})

const getOpenApeData = (openApeUser, openApePassword) => {
    return new Promise((resolve, reject) => {
        const client = new OpenApeClient(openApeUser, openApePassword, "https://openape.gpii.eu");
        const arrayOfPreferences = [];
        client.getUserContextList((ctxList) => {
            // console.log("IT WORKS:", ctxList)
            if (ctxList["user-context-uris"]) {
                ctxList["user-context-uris"].forEach(element => {
                    client.getUserContext(element, (data) => {
                        // console.log("SUCCESS CB", data);
                        arrayOfPreferences.push(data.default.preferences)
                    })
                });
            }
            else {
                //TODO: Error handling
                reject("Meaningful error message");
            }
        })
        console.log("array of user preferences in OpenAPE", arrayOfPreferences);
        resolve(arrayOfPreferences);
    })
}

let defaults = {
    theme: "dark", //TODO: Request from APE
    fontSize: 16, //TODO: Request from APE
    selfVoicingEnabled: true, //TODO: Request from APE
    doVentilationReminder: true, //TODO: Request from APE, speaker must be configurable on Raspberry
    reduceMotion: true, //TODO: Request from APE
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