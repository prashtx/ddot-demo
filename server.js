/*jslint node: true */
'use strict';

var http = require('http');
var express = require('express');
var request = require('request');

var port = process.env.PORT || 3000;
var smsUrl = process.env.SMS_URL || 'http://ddot-sms.herokuapp.com/twilio';

var server;
var app = express(express.logger());

app.use(express['static']('./public'));

app.post('/sms', function (req, res) {
  req.pipe(request(smsUrl)).pipe(res);
});

server = http.createServer(app);
server.listen(port, function (err) {
  if (err) {
    console.log(err.message);
    throw err;
  }
  console.log('Listening on port ' + port);
});
