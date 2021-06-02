"use strict"

let jwt = require('jsonwebtoken');
let config = require('./config');
let request = require('request')

class AuthService {
  login(req, res) {
    console.log(req.body)

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
        console.log("body", body, typeof body, body === {}, typeof {})

        let _body = JSON.parse(body);
        console.log("_body", _body)

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
            res.json({
              success: true,
              message: 'Authentication successful!',
              user: username,
              token: token,
              //TODO: Return user context
              userContext: ""
            });
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
    res.json("Token is valid")
  }
}




module.exports = {
  AuthService: AuthService
};

/*
Original blueprint

https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4
*/