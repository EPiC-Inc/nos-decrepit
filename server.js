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

  // Auth
  socket.on('auth', function(data){
    var user = data[0];
    var pwd = data[1];
    uData = authList[user];
    console.log(data);
    console.log(uData);
    if (uData == undefined || uData.pass !== pwd) {
      io.to(socket.id).emit('err', "Error: Username / password not recognized");
    } else if (!uData.active) {
      io.to(socket.id).emit('err', "Error: You have been banned!");
    } else {
      io.to(socket.id).emit('err', "Logging in...");
    }
  });
});


// Start the server
http.listen(port, function(){
  console.log('Listening on port:'+port);
});
