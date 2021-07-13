const request = require("request");

// ------------------------------------------------ Helper ------------------------------------------------

// A parameterized request without payload used for GET or DELETE requests
// Takes an auth-token, http-method, resource location uri
// Returns as a promise which can be chained with then() to allow for controllable async programming 
const genericRequest = async (token, method, uri) => {
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
                if(error)
                    reject(error)
                else
                    resolve(body)
            }
        );
    })
};

// A parameterized request with payload used for POST or PUT requests 
// Takes an auth-token, http-method, resource location uri, request body
// Returns as a promise which can be chained with then() to allow for controllable async programming 
const genericRequestWithPayload = (token, method, uri, body) => {
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
                body: body,
                // json:true
            },
            function (error, response, body) {
                if(error)
                    reject(error)
                else
                    resolve(body)
            }
        );
    })
};

module.exports = {
    genericRequest: genericRequest,
    genericRequestWithPayload: genericRequestWithPayload,
}