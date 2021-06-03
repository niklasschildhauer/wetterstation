"use strict"

let jwt = require('jsonwebtoken');
let config = require('./config');
let request = require('request')

class AuthService {
  login(req, res) {
    // Credentials provided by user
    let username = req.body.username;
    let password = req.body.password;

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
        //TODO: Deliver decoded pw here? What is the most "secure case" - 
        //can only be done if this route stays inside our network
        let db_password = _body.password;

        if (db_username && db_password) {
          if (username === db_username && password === db_password) {
            //Credentials are correct -> deliver token to client
            let token = jwt.sign({ username: username }, config.secret,
              {
                expiresIn: '24h'
              }
            );
            //Request full user_context from pers-service through utility method
            request(
              {
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                },
                uri: 'http://localhost:4203/userContextUtility',
                method: 'POST',
                body: body
              },
              function (error, response, body) {
                if (error) {
                  res.status(400).json("Unknown error");
                }
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
  validateToken(req, res) {
    res.status(200).json({success:true, message:"Token is valid"})
  }

  currentUser(req, res) {
    let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
    let user = getDecodedUser(token);

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
        request(
          {
            headers: {
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
              res.status(200).json({
                userContext: JSON.parse(body)
              });
            }
          })
      })
  }
}

const getDecodedUser = (token) => {
  let decodedUser;

  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
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

/*
Original blueprint

https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4
*/