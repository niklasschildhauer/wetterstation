"use strict"

let jwt = require('jsonwebtoken');
let config = require('./config');
let request = require('request')

class AuthService {
  login(req, res) {
    // Credentials provided by user
    let username = req.body.username;
    let password = req.body.password;

    // Request the database for the given username and get the credentials from the database
    request(
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        uri: 'http://localhost:4205/userContext/' + username,
        method: 'GET'
      },
      function (error, response, body) {
        let _body = JSON.parse(body);

        let db_username = _body.username;
        let db_password = _body.password;

        //Check if the username exists
        if (db_username && db_password) {
          if (username === db_username && password === db_password) {
            //Credentials are correct -> deliver token to client
            let token = jwt.sign({ username: username }, config.secret,
              {
                expiresIn: '24h'
              }
            );

            // We defined that the login method should return the full User object therefore the full User object has to be requested from the database
            // Request full user_context from pers-service through utility method
            request(
              {
                headers: {
                  "Authorization": token,
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                },
                uri: 'http://localhost:4203/userContextUtility',
                method: 'POST',
                body: body
              },
              function (error, response, body) {
                //Case: "unknown error" (likely some service is not available)
                if (error) {
                  console.log("most likely some service was not available")
                  res.status(400).json("Unknown error");
                }
                // Case: Success
                // The login handler delivers the success message, the auth token and the User object
                else {
                  res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token,
                    userContext: JSON.parse(body)
                  });
                }
              })
          } else {
            //Wrong credentials provided
            res.json({
              success: false,
              message: 'Incorrect username or password'
            });
          }
        } else {
          //No credentials provided
          res.json({
            success: false,
            message: 'Authentication failed! Please check the request'
          });
        }
      }
    );
  }
  // The validate token uses the middleware in middleware.js to validate the given token
  // The usage of middleware is specified in the route definition (index.js)
  validateToken(req, res) {
    res.status(200).json({ success: true, message: "Token is valid" })
  }

  // The currentUser method decodes the received token to get the username for which it was assigned.
  // It then requests the according User object and returns it.
  currentUser(req, res) {
    let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
    // Decode the token and get the username
    let user = getDecodedUser(token);

    //Request the User object by given username
    request(
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        uri: 'http://localhost:4205/userContext/' + user,
        method: 'GET'
      }, function (error, response, body) {
        var _body = JSON.parse(body)
        // Use the UserContextUtility to get the full User object including appended external information such as Pollen configuration etc.
        request(
          {
            headers: {
              "Authorization": token,
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            uri: 'http://localhost:4203/userContextUtility',
            method: 'POST',
            body: JSON.stringify(_body)
          }, function (error, response, body) {
            if (error) {
              res.status(400).json(error);
            }
            else {
              res.status(200).json(JSON.parse(body));
            }
          })
      })
  }
}


// Decodes a token to get the username for which it was created
const getDecodedUser = (token) => {
  let decodedUser;

  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  //Verify and decode a token
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return err;
    }
    decodedUser = decoded.username;
  });
  return decodedUser;
}




module.exports = {
  AuthService: AuthService
};

const checkJSONParse = (body) => {
  try {
    return JSON.parse(body);
  } catch (e) {
    return e;
  }
}

/*
Original blueprint

https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4
*/