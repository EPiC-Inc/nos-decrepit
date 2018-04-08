// Dependencies
var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');

// Variables
var cmdHelp = "?ping : see online users<br>?ping room : see users in your current room"
var users = {};
var authList = require('./users.json');
//console.log(authList);

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

// Upon a connection, keep it open via this callback
io.on('connection', function(socket){
  // Message upon disconnection
  socket.on('disconnect', function(){
    //
  });

  // Message upon joining a room and room switching script
  socket.on('switch', function(data){});
});

// Start the server
http.listen(port, function(){
  console.log('Listening on port:'+port);
});
