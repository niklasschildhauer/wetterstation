"use strict"

const forecast = () => {
    //Forecast logic
}





// ------------------------------------------------ Helper ------------------------------------------------


const genericRequest = (token, method, uri, res) => {
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
        genericCallback(error, response, body, res);
      }
    );
  };
  
  const genericRequestWithPayload = (token, method, uri, body, res) => {
    request(
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        uri: uri,
        method: method,
        body: body
      },
      function (error, response, body) {
        genericCallback(error, response, body, res);
      }
    );
  };
  
  const genericCallback = (error, response, body, res) => {
    if (error) {
      res.sendStatus("400");
    } else {
      if (response.statusCode === 200) {
        let data = JSON.parse(body);
        res.json(data);
      } else if (response.statusCode === 401) {
        let out = "The request is unauthorized";
        res.status("401").json(out);
      } else {
        let out = "Bad request";
        res.status("400").json(out);
      }
    }
  };


  module.exports = {
    forecast: forecast
}