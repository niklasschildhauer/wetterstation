"use strict"

const port = 4203;

const express = require('express');
const app = express();
const grh = require("./lib/shared");
const openApeClient = require("./lib/openape");
const { genericRequestWithPayload, genericRequest } = require('./lib/shared');
const OpenApeClient = openApeClient.openApeClient;
app.use(express.json({ type: "application/json" }));
const request = require("request");

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


        //Request openAPE
        getOpenApeData(openApeUser, openApePassword).then((response) => {

            out = overwriteUserWithOpenAPE(response, out)
            // console.log("parsedOpenApeResponse", out)

            //Save the changes to the db
            genericRequestWithPayload(token, "PUT", 'http://localhost:4205/userContext/save/' + out.id, JSON.stringify(out), res).then((response) => {
                console.log("response-save", response)
                res.status(200).json(JSON.parse(response))
            }).catch(error => {
                res.status(400).json({ "error": error })
            });
        })
    }).catch((error) => {
        console.log("(Open APE WRITE) error occurred in OpenAPE write while getting userContext")
        console.log(error)
        res.status(400).json({ "error": error })
    });
})


// curl -X PUT https://openape.gpii.eu/api/user-contexts/610bf30403604740e28eb232 --header "authorization: eyJhbGciOiJIUzI1NiJ9.eyIkaW50X3Blcm1zIjpbXSwic3ViIjoib3JnLnBhYzRqLmNvcmUucHJvZmlsZS5Db21tb25Qcm9maWxlIzYwYmY3NTE4MDM2MDQ3NTI1Zjk5MDY5YyIsIiRpbnRfcm9sZXMiOlsidXNlciJdLCJleHAiOjE2MjgyNTc4MDEsImlhdCI6MTYyODE3MTQwMSwiZW1haWwiOiJhbTIwNkBoZG0tc3R1dHRnYXJ0LmRlIiwidXNlcm5hbWUiOiJhbTIwNiJ9.sJrsHrT8lkOUKyn4eOUqnTeEa9ucUM7FCt4CeLeqasE" --header "content-type: application/json" --data '{"http://terms.gpii.eu/selfVoicingEnabled":true,"http://terms.gpii.eu/theme":"automatic","http://terms.gpii.eu/fontSize":66,"http://terms.gpii.eu/doVentilationReminder":false,"http://terms.gpii.eu/reduceMotion":false,"http://terms.gpii.eu/pollen":"Ambrosia|Birke|Esche|Graeser|Hasel"}'

app.post('/writeOpenAPESettings', (req, res) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    let openApeUser = req.body.openApeUser;
    let openApePassword = req.body.openApePassword;

    //Get the user object
    genericRequest(token, "GET", "http://localhost:4202/currentUser").then(db_user => {
        let user = JSON.parse(db_user);

        //Request openAPE
        writeOpenApeData(openApeUser, openApePassword, user).then((response) => {
            res.status(200).json("ok")
        })
    }).catch((error) => {
        console.log("(Open APE WRITE) error occurred in OpenAPE write while getting userContext")
        console.log(error)
        res.status(400).json({ "error": error })
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
                    console.log(element)
                    client.getUserContext(element, (data) => {
                        if (data.default.name === "Wetterstation") {
                            // console.log("success", data);
                            arrayOfPreferences.push(data.default.preferences)
                        }
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


const writeOpenApeData = (openApeUser, openApePassword, userContext) => {
    return new Promise((resolve, reject) => {
        const client = new OpenApeClient(openApeUser, openApePassword, "https://openape.gpii.eu");
        const arrayOfPreferences = [];
        client.getUserContextList((ctxList) => {
            console.log("ctxList:", ctxList)
            let isDone = false;
            let newDataset = newOpenAPEDataset(userContext);

            //Case one: UserContext already exists, overwrite
            if (ctxList.totalContexts > 0) {
                ctxList["user-context-uris"].forEach(element => {
                    client.getUserContext(element, (data) => {
                        if (data.default.name === "Wetterstation") {
                            isDone = true;
                            console.log("newDataset", JSON.stringify(newDataset))
                            updateOpenAPEContext(client.token, element, newDataset).then((success) => {
                                console.log("success", success)
                                if (success === "success") {
                                }
                            }).catch(error => {
                                console.log("(OpenAPEWrite) Error in updating OpenAPE Context of existing object")
                                console.log(error)
                            })
                        }
                    })
                });
            }
            //Case two: UserContext does not exist, create and write
            if (!isDone) {
                createNewOpenAPEContext(client.token, newDataset).then((success) => {

                }).catch(error => {
                    console.log("(OpenAPEWrite) Error in updating OpenAPE Context of existing object")
                    console.log(error)
                })
            }

        })
        resolve("");
    })
}

const newOpenAPEDataset = (userContext) => {
    let u = userContext
    return {
        "default": {
            "name": "Wetterstation",
            "preferences": {
                'http://terms.gpii.eu/selfVoicingEnabled': u.selfVoicingEnabled,
                'http://terms.gpii.eu/theme': u.theme,
                'http://terms.gpii.eu/fontSize': u.fontSize,
                'http://terms.gpii.eu/doVentilationReminder': u.doVentilationReminder,
                'http://terms.gpii.eu/reduceMotion': u.reduceMotion,
                'http://terms.gpii.eu/pollen': u.pollen.join("|")
            }
        }
    }
}

const updateOpenAPEContext = (token, ctxID, newDataset) => {
    console.log("updateOpenAPEContext")
    return new Promise((resolve, reject) => {
        request(
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                uri: "https://openape.gpii.eu/api/user-contexts/" + ctxID,
                method: "PUT",
                body: JSON.stringify(newDataset)
            },
            function (error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve("success")
            }
        );
    })
}

const createNewOpenAPEContext = (token, newDataset) => {
    console.log("createNewOpenAPEContext")
    return new Promise((resolve, reject) => {
        request(
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                uri: "https://openape.gpii.eu/api/user-contexts",
                method: "POST",
                body: JSON.stringify(newDataset)
            },
            function (error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve("success")
            }
        );
    })
}



const overwriteUserWithOpenAPE = (response, userContext) => {
    //As the keys of the key-value pairs are delivered as URLS this is neccessary to "decode" the properties to reflect the actual values
    response.forEach(entry => {
        if (typeof entry === 'object') {
            if (entry.hasOwnProperty('http://terms.gpii.eu/selfVoicingEnabled')) {
                // console.log("has prop", entry['http://terms.gpii.eu/selfVoicingEnabled'])
                userContext.selfVoicingEnabled = entry['http://terms.gpii.eu/selfVoicingEnabled']
                // console.log("true -->", out.selfVoicingEnabled);
            }
            if (entry.hasOwnProperty('http://terms.gpii.eu/theme')) {
                // console.log("has prop", entry['http://terms.gpii.eu/theme'])
                userContext.theme = entry['http://terms.gpii.eu/theme']
            }
            if (entry.hasOwnProperty('http://terms.gpii.eu/fontSize')) {
                // console.log("has prop", entry['http://terms.gpii.eu/fontSize'])
                userContext.fontSize = entry['http://terms.gpii.eu/fontSize']
            }
            if (entry.hasOwnProperty('http://terms.gpii.eu/doVentilationReminder')) {
                // console.log("has prop", entry['http://terms.gpii.eu/doVentilationReminder'])
                userContext.doVentilationReminder = entry['http://terms.gpii.eu/doVentilationReminder']
            }
            if (entry.hasOwnProperty('http://terms.gpii.eu/reduceMotion')) {
                // console.log("has prop", entry['http://terms.gpii.eu/reduceMotion'])
                userContext.reduceMotion = entry['http://terms.gpii.eu/reduceMotion']
            }
            if (entry.hasOwnProperty('http://terms.gpii.eu/pollen')) {
                // console.log("has prop", entry['http://terms.gpii.eu/pollen'])
                let pollen = entry['http://terms.gpii.eu/pollen'].split("|");
                // console.log("splitted pollen", pollen)
                userContext.pollen = pollen
            }
        }
    });

    return userContext
}

//Defaults for new Users
let defaults = {
    theme: "automatic",
    fontSize: 62,
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