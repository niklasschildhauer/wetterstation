"use strict"

const port = 4204;

var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.status(200).send("Hello from port " + port);
});

console.log("listening on port", port)
app.listen(port);