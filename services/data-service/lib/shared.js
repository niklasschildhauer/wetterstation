const request = require("request");

// ------------------------------------------------ Helper ------------------------------------------------

// A parameterized request without payload used for GET or DELETE requests.
// Takes http-method, resource location uri
// Returns as a promise which can be chained with then() to allow for controllable async programming 
const genericRequestToPromise = (method, uri) => {
    return new Promise((resolve, reject) => {
        request(
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                uri: uri,
                method: method
            },
            function (error, response, body) {
                if (error) {
                    reject(error);
                }
                if(body !== undefined){
                    resolve(JSON.parse(body))
                }
                else{
                    console.log("(Forecast) Body of request was undefined")
                    reject("error")
                }
            }
        );
    });
}

// A parameterized request without payload used for GET or DELETE requests and using token auth header
// Takes an auth-token, http-method, resource location uri
// Returns as a promise which can be chained with then() to allow for controllable async programming 
const genericRequestToPromiseAuth = (token, method, uri) => {
    return new Promise((resolve, reject) => {
        request(
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                uri: uri,
                method: method
            },
            function (error, response, body) {
                if (error) {
                    reject(error);
                }
                if(body !== undefined){
                    resolve(JSON.parse(body))
                }
                else{
                    console.log("(Forecast) Body of request was undefined")
                    reject("error")
                }
            }
        );
    });
}

// A parameterized request without payload used for GET or DELETE requests.
// Takes http-method, resource location uri and the request body
// Returns as a promise which can be chained with then() to allow for controllable async programming 
const genericRequestWithPayloadToPromise = (method, uri, body) => {
    return new Promise((resolve, reject) => {
        request(
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                uri: uri,
                method: method,
                body: JSON.parse(body),
                json: true
            },
            function (error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body)
            }
        );
    });
}

// A parameterized request without payload used for GET or DELETE requests and using token auth header
// Takes an auth-token, http-method, resource location uri and the request body
// Returns as a promise which can be chained with then() to allow for controllable async programming 
const genericRequestWithPayloadToPromiseAuth = (token, method, uri, body) => {
    return new Promise((resolve, reject) => {
        request(
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                uri: uri,
                method: method,
                body: JSON.parse(body),
                json: true
            },
            function (error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body)
            }
        );
    });
}

// Export the functions 
module.exports = {
    genericRequestWithPayloadToPromiseAuth: genericRequestWithPayloadToPromiseAuth,
    genericRequestToPromiseAuth: genericRequestToPromiseAuth,
    genericRequestToPromise: genericRequestToPromise,
    genericRequestWithPayloadToPromise: genericRequestWithPayloadToPromise
}