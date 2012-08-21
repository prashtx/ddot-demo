/*jslint node: true */
'use strict';

var http = require('http');
var express = require('express');

var port = process.env.PORT || 3000;

var server;
var app = express(express.logger());

app.use(express['static']('./public'));

server = http.createServer(app);
server.listen(port, function (err) {
  if (err) {
    console.log(err.message);
    throw err;
  }
  console.log('Listening on port ' + port);
});
