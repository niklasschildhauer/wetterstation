"use strict"

const express = require('express');
const app = express();
const middleware = require('./lib/middleware');
const authService = require('./lib/auth-service');
const AuthService = authService.AuthService;

const port = 4202;

//Use instance of AuthService to protect routes for the AuthService.
const handlers = new AuthService();

//Config for datatype usage
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

//Supplied routes:
/*
  /login : Provide credentials to receive a token
  /checkToken : Validate Token (use from server side)
  /currentUser : The user that the token is associated to
*/
app.post('/login', handlers.login);
app.get('/checkToken', middleware.checkToken, handlers.validateToken);
app.get('/currentUser', middleware.checkToken, handlers.currentUser);

console.log("listening on port", port)
app.listen(port);