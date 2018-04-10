// Dependencies
var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var fs = require('fs');

// Variables
var cmdHelp = "?adduser [user] [hash] : Adds a user<br>?rmuser [user] : Removes a user<br>?broadcast [msg] : Sends msg under _System<br>?ban [user] : Bans a user from the chat"
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
    if (users[socket.id] !== undefined) {
      header='> User [';
      if (authList[users[socket.id].name]['admin']) {
        header = "> Admin [<img src='/static/admin.png'> "}
      io.to(users[socket.id].room).emit('message', header+"<span style='"+authList[users[socket.id].name]['nameStyle']+"'>"+users[socket.id].name+"</span>] has left");
      delete users[socket.id];
    }
  });

  // Message upon joining a room and room switching script
  socket.on('join', function(data){
    users[socket.id] = {
      name:data[0],
      room:data[1]
    };
    socket.join(data[1]);
    header='> User [';
    if (authList[data[0]]['admin']) {
      header = "> Admin [<img src='/static/admin.png'> "}
    io.to(data[1]).emit('message', header+"<span style='"+authList[data[0]]['nameStyle']+"'>"+data[0]+"</span>] has joined!");
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
    var send = true;
    if (users[socket.id] !== undefined) {
      var senderName = users[socket.id].name;
      if (data.startsWith("?")) {
        if (data.startsWith("?adduser ") && authList[senderName] !== undefined &&authList[senderName]['admin']) {
          splitData = data.split(" ");
          if (splitData.length > 2 && !isNaN(splitData[2]) && authList[splitData[1]] == undefined) {
            newUser = {
              "active":true,
              "admin":false,
              "nameStyle":"",
              "pass":parseInt(splitData[2])
            };
            authList[splitData[1]] = newUser;
            // Write to users.json
            content = JSON.stringify(authList);
            fs.writeFile("users.json", content, 'utf8', function (err) {
              if (err) {return console.log(err);} else {io.to(socket.id).emit('message', "> User successfully added!");}
              console.log(splitData[1]+" was added!");});
          }
        } else if (data.startsWith("?rmuser ") && authList[senderName] !== undefined && authList[senderName]['admin']){
          // Remove a user
          splitData = data.split(" ");
          if (splitData.length > 1) {
            if (authList[splitData[1]] == undefined && authList[splitData[1]] !== "_System") {
              io.to(socket.id).emit('message', "> User not found!");
            } else {
              for (key in users) {
                if (users[key].name == splitData[1]) {
                  delete users[key];
                }
              }
              delete authList[splitData[1]];
              content = JSON.stringify(authList);
              fs.writeFile("users.json", content, 'utf8', function (err) {
                if (err) {return console.log(err);} else {io.to(socket.id).emit('message', "> User successfully removed!");}
                console.log(splitData[1]+" was removed!");});
            }
          }
        } else if (data.startsWith("?broadcast ") && authList[senderName] !== undefined && authList[senderName]['admin']) {
          send = false;
          var packet = "<span style='background:cyan;'>[_System] "+data.substring(11)+"</span>";
          io.emit("message", packet);
        } else if (data == '?help' && authList[senderName]['admin']) {
          io.to(socket.id).emit('message', cmdHelp);
        // Promotion / demotion / ban code
        } else if (data.startsWith("?promote ") && authList[senderName] !== undefined && authList[senderName]['admin']) {
          // Promote
          splitData = data.split(" ");
          if (authList[splitData[1]] == undefined && authList[splitData[1]] !== "_System") {
              io.to(socket.id).emit('message', "> User not found!");
            } else {
              authList[splitData[1]]['admin'] = true;
              content = JSON.stringify(authList);
              fs.writeFile("users.json", content, 'utf8', function (err) {
                if (err) {return console.log(err);} else {io.to(socket.id).emit('message', "> User successfully promoted!");}
                console.log(splitData[1]+" was promoted!");});
            }

        } else if (data.startsWith("?demote ") && authList[senderName] !== undefined && authList[senderName]['admin']) {
          // Demote
          splitData = data.split(" ");
          if (authList[splitData[1]] == undefined && authList[splitData[1]] !== "_System") {
              io.to(socket.id).emit('message', "> User not found!");
            } else {
              authList[splitData[1]]['admin'] = false;
              content = JSON.stringify(authList);
              fs.writeFile("users.json", content, 'utf8', function (err) {
                if (err) {return console.log(err);} else {io.to(socket.id).emit('message', "> User successfully demoted!");}
                console.log(splitData[1]+" was demoted!");});
            }
          
        } else if (data.startsWith("?ban ") && authList[senderName] !== undefined && authList[senderName]['admin']) {
          // Ban
          splitData = data.split(" ");
          if (authList[splitData[1]] == undefined && authList[splitData[1]] !== "_System") {
            io.to(socket.id).emit('message', "> User not found!");
            } else {
              for (key in users) {
                if (users[key].name == splitData[1]) {
                  delete users[key];
                }
              }
              authList[splitData[1]]['active'] = false;
              content = JSON.stringify(authList);
              fs.writeFile("users.json", content, 'utf8', function (err) {
                if (err) {return console.log(err);} else {io.to(socket.id).emit('message', "> User successfully banned!");}
                console.log(splitData[1]+" was banned!!!");});
            }
        } else if (data.startsWith("?unban ") && authList[senderName] !== undefined && authList[senderName]['admin']) {
          // Un-ban
          splitData = data.split(" ");
          if (authList[splitData[1]] == undefined && authList[splitData[1]] !== "_System") {
              io.to(socket.id).emit('message', "> User not found!");
            } else {
              authList[splitData[1]]['active'] = true;
              content = JSON.stringify(authList);
              fs.writeFile("users.json", content, 'utf8', function (err) {
                if (err) {return console.log(err);} else {io.to(socket.id).emit('message', "> User successfully unbanned!");}
                console.log(splitData[1]+" was unbanned!");});
            }
        }
      }
      if (send) {
        var header = '';
        if (authList[senderName]['admin']) {
          header = "<img src='/static/admin.png'> "}

        // Graft together an unnecessarily complicated packet =)
        var packet = "["+header+"<span style='"+authList[senderName]['nameStyle']+"'>"+senderName+"</span>] "+data;
        io.to(users[socket.id].room).emit('message', packet);
      }
    }
  });

  // User querying
  socket.on('query', function(){
    if (users[socket.id] !== undefined) {
      var rep = [];
      var cRoom = users[socket.id].room;
      for (id in users) {
        if (users[id].room == cRoom) {
          rep.push(users[id].name);
        }
      }
      io.to(socket.id).emit('users online', rep);
    }
  });

  // Log a new user account request
  socket.on('new user', function(data){
    if (data[0] == '' || data[1] == 0) {
      io.to(socket.id).emit('err', "Error: Username / password can not be blank!");
    } else if (authList[data[0]] !== undefined) {
      io.to(socket.id).emit('err', "Error: Username already in use!");
    } else {
      console.log("New account request:"+data[0]+" "+data[1]);
      io.to(socket.id).emit('err', "Success! Your account has been requested for creation. It may take some time to manually activate.");
    }
  });
});


// Start the server
http.listen(port, function(){
  console.log('Listening on port:'+port);
});
