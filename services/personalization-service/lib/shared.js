const request = require("request");

// ------------------------------------------------ Helper ------------------------------------------------


const genericRequest = async (method, uri) => {
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
                if(error)
                    reject(error)
                else
                    resolve(body)
            }
        );
    })
};

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