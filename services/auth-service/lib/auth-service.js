"use strict"

let jwt = require('jsonwebtoken');
let config = require('./config');


class AuthService {
  login (req, res) {

    // Credentials provided by user
    let username = req.body.username;
    let password = req.body.password;

    // Use mocked data for now. This has to be refactored into requesting db
    let mockedUsername = 'admin';
    let mockedPassword = 'admin';

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        //Credentials are correct -> deliver token to client
        let token = jwt.sign({username: username}, config.secret,
          { 
            expiresIn: '24h'
          }
        );
        res.json({
          success: true,
          message: 'Authentication successful!',
          user: mockedUsername,
          token: token
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
  validateToken(req, res){
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