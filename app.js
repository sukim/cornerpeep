
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

// the ExpressJS App
var app = express();


var server = require('http').createServer(app);
var webRTC = require('webrtc.io').listen(server);

var port = 8000;
server.listen(port);

app.configure(function () {
	app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/site/index.html');
});

app.get('/style.css', function(req, res) {
  res.sendfile(__dirname + '/public/site/style.css');
});

app.get('/script.js', function(req, res) {
  res.sendfile(__dirname + '/public/site/script.js');
});

app.get('/webrtc.io.js', function(req, res) {
  res.sendfile(__dirname + '/public/site/webrtc.io.js');
});



// configuration of port, templates (/views), static files (/public)
// and other expressjs settings for the web server.



// var routes = require('./routes/index.js');

// app.get('/', routes.index);

// var routes = require('./routes/index.js');

// app.get('/', routes.index);

//app.get('/peeping', routes.videopeep);
//app.post('/peep_request', routes.videoRequest);

// create NodeJS HTTP server using 'app'
//http.createServer(app).listen(app.get('port'), function(){
 // console.log("Express server listening on port " + app.get('port'));
//});






