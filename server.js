"use strict"

//---------------------------------- PORTS -----------------------------------------/*/
/* :4200 -> Angular Frontend
/* :4201 -> API Gateway
/* :4202 -> AuthService
/* :4203 -> PersonalizationService
/* :4204 -> DataService
//----------------------------------------------------------------------------------/*/

var express = require('express');
var app = express();

app.get('/', function(req, res){
   res.status(200).send("Hello world!");
});

console.log("listening on port 4201")
app.listen(4201);