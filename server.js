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
    delete users[socket.id];
  });

  // Message upon joining a room and room switching script
  socket.on('join', function(data){
    users[socket.id] = {
      name:data[0],
      room:data[1]
    };
    socket.join(data[1]);
  });

  // Auth
  socket.on('auth', function(data){
    var user = data[0];
    var pwd = data[1];
    var uData = authList[user];
    //console.log(data);
    //console.log(uData);
    if (uData == undefined || uData.pass !== pwd) {
      io.to(socket.id).emit('err', "Error: Username / password not recognized");
    } else if (!uData.active) {
      io.to(socket.id).emit('err', "Error: You have been banned!");
    } else {
      io.to(socket.id).emit('a-ok');
    }
  });

  // Message sending script allowing for username colors
  socket.on("message", function(data){
    if (users[socket.id] !== undefined) {
      var senderName = users[socket.id].name;
      // Graft together an unnecessarily complicated packet =)
      var packet = "[<span style='"+authList[senderName]['nameStyle']+"'>"+senderName+"</span>] "+data;
      io.to(users[socket.id].room).emit('message', packet);
    }
  });
});


// Start the server
http.listen(port, function(){
  console.log('Listening on port:'+port);
});
