// Refactored version of server.js

/// Dependencies - don't need to worry too much about these
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var fs = require('fs');
var sanitize = require('sanitize-html');
var stdin = process.openStdin();
/// End dependencies

/// Variables
var commands = require('./commands.js');
var authList = require('./users.json');
var rooms = require('./rooms.json');

var users = {};
/// End vars

/// Functions
// Save a json object to a file
function saveJSON(filename, data, successCallback=function(){}, failCallback=function(){console.log('error writing to file')}) {
  var content = JSON.stringify(data);
  fs.writeFile(filename, content, 'utf8', function (err) {
    if (err) {
      failCallback();
    } else {
      successCallback();
    }
  });
}

// Save a message to a room
function saveMessage(msg, room='lobby') {
  roomMsgs = rooms[room]['messages'];
  if (roomMsgs.length > 20) {
    roomMsgs.push(msg);
  } else {
    roomMsgs.splice(0, 1);
    roomMsgs.push(msg);
  }
  saveJSON('rooms.json', rooms);
}

// Create a Date object to the computer's time
var toLocalTime = function() {
  var d = new Date();
  var offset = (new Date().getTimezoneOffset() / 60) * -1;
  var n = new Date(d.getTime() + offset);
  return n;
};
/// End functions

/// Upon server startup
// Set the port (node server.js [port])
// process.argv : 0:program 1:file 2:(in this case)port
if (process.argv[2] == undefined) {
  var port = 80;
} else {
  var port = process.argv[2]; // Use node server.js [port]
}

// Msg sender thru console
stdin.addListener("data", function(d) {
  datetimestring = toLocalTime().toLocaleString() ///datetime
  packet = "<span style='background:cyan;'><span class='alert'>SERVER ALERT</span> > "+d.toString().trim()+"</span>";
  msg = Buffer.from(packet).toString('base64');
  io.emit("message", [datetimestring, msg]);
  saveMessage([datetimestring, msg]);
});
/// End startup stuff

/// Routing
app.use('/', express.static(__dirname + '/static'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/index.html');
});
app.get('/googleb7532997be74f84b.html', function(req, res){
  res.sendFile(__dirname + '/googleb7532997be74f84b.html');
});
/// End routing

/// Socketio events
/// End socketio

/// Start the server
http.listen(port, function(){
  console.log('Listening on port:'+port);
});
/// And that's it.
