const request = require("request");

// ------------------------------------------------ Helper ------------------------------------------------

const genericRequest = (method, uri) => {
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
                resolve(JSON.parse(body))
            }
        );
    });
}

const genericRequestWithPayload = (method, uri, body) => {
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

module.exports = {
    genericRequest: genericRequest,
    genericRequestWithPayload: genericRequestWithPayload
}