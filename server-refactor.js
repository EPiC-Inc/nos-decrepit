// Refactored version of server.js

// Dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var fs = require('fs');
var stdin = process.openStdin();

// Variables
var cmdHelp = "?adduser [user] [hash] : Adds a user<br>?rmuser [user] : Removes a user<br>?broadcast [msg] : Sends msg under _System<br>?ban [user] : Bans a user from the chat"
var users = {};                         // List of logged-in users
var authList = require('./users.json'); // The list of authenticated users

// Set the port (node server.js [port])
// process.argv : 0:program 1:file 2:(in this case)port
if (process.argv[2] == undefined) {
  var port = 80;
} else {
  var port = process.argv[2]; // Use node server.js [port]
}

// Routing
app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/index.html');
});

// File stream for the queue for _System
var qstream = fs.createWriteStream("sysTodo.txt", {flags:'a'});
// Just do qstream.write(data); - don't forget \n

// Console commands
stdin.addListener("data", function(d) {
  cmd = d.toString.trim();
  console.log("you entered: [" + cmd + "]");
});

// Upon a connection, keep it open via this callback
io.on('connection', function(socket){
  
});

// Start the server
http.listen(port, function(){
  console.log('Listening on port:'+port);
});
