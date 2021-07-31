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
// Used in auth-service. "Links together" UserContext and Pollen
app.post('/userContextUtility', (req, res) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    //The user is already given as param
    let db_user = req.body;
    //Request Pollen by username from the db
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
    }).catch((error) => {
        console.log("(UserCTX utility) User context utility returned error")
        console.log(error)
    })
})

//Register a new user
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
    //Persist the changes to the db
    grh.genericRequestWithPayload("", "POST", 'http://localhost:4205/userContext/new', JSON.stringify(reqObj), res).then((response) => {
        //Remove password from output object
        delete response.password
        res.status(200).json(JSON.parse(response));
    }).catch((error) => {
        console.log("(Register) Register returned error")
        console.log(error)
    });
})

//Save a user to the db (modify)
app.put('/save/:id', (req, res) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    const id = req.params.id;

    //Data sanitization -> not sending id as param
    const _body = {
        theme: req.body.theme,
        fontSize: req.body.fontSize,
        selfVoicingEnabled: req.body.selfVoicingEnabled,
        doVentilationReminder: req.body.doVentilationReminder,
        reduceMotion: req.body.reduceMotion
    }

    //Send changes to the db
    grh.genericRequestWithPayload(token, "PUT", 'http://localhost:4205/userContext/save/' + id, JSON.stringify(_body), res).then((response) => {
        //Remove password from output object
        delete response.password
        res.status(200).json(JSON.parse(response));
    }).catch((error) => {
        console.log("(User save) User save returned error")
        console.log(error)
    });
})

// Load OpenAPE settings using openAPE credentials and the openAPE provider in ./lib/openape.js
app.post('/loadOpenAPESettingsAndSave', (req, res) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    let openApeUser = req.body.openApeUser;
    let openApePassword = req.body.openApePassword;

    //Get the user object
    genericRequest(token, "GET", "http://localhost:4202/currentUser").then(db_user => {
        let out = JSON.parse(db_user);
        //Pollen are not required here because they are only saved in our db, not openAPE
        delete out.pollen;

        //Request openAPE
        getOpenApeData(openApeUser, openApePassword).then((response) => {
            
            //As the keys of the key-value pairs are delivered as URLS this is neccessary to "decode" the properties to reflect the actual values
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

            //Save the changes to the db
            genericRequestWithPayload(token, "PUT", 'http://localhost:4205/userContext/save/' + out.id, JSON.stringify(out), res).then((response) => {
                // console.log("response-save", response)
                res.status(200).json(JSON.parse(response))
            }).catch(error => {
                res.status(400).json({ "error": error })
            });
        })
    });
})

//Request openAPE data using the client in ./lib/openape.js
const getOpenApeData = (openApeUser, openApePassword) => {
    return new Promise((resolve, reject) => {
        const client = new OpenApeClient(openApeUser, openApePassword, "https://openape.gpii.eu");
        const arrayOfPreferences = [];
        client.getUserContextList((ctxList) => {
            // console.log("ctxList:", ctxList)
            if (ctxList["user-context-uris"]) {
                ctxList["user-context-uris"].forEach(element => {
                    client.getUserContext(element, (data) => {
                        // console.log("success", data);
                        arrayOfPreferences.push(data.default.preferences)
                    })
                });
            }
            else {
                reject("Error");
            }
        })
        console.log("array of user preferences in OpenAPE", arrayOfPreferences);
        resolve(arrayOfPreferences);
    })
}

//Defaults for new Users
let defaults = {
    theme: "automatic",
    fontSize: 62.5,
    selfVoicingEnabled: false,
    doVentilationReminder: false,
    reduceMotion: false,
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