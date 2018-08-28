// Dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var fs = require('fs');
var sanitize = require('sanitize-html');
var stdin = process.openStdin();

// Variables
var command = require("./commands.js");
var cmdHelp = "?llamafy @[username] : Turns the user into a llama! (it's a joke)<br>?color [color / hex code] : Sets your name color<br>?img [link to image] : Inserts an image";
var adminHelp = cmdHelp + "<br>?rmuser [user] : Removes a user<br>?broadcast [msg] : Sends msg to everyone on<br>?ban [user] : Bans a user from the chat<br>?unban [user] : Unbans a banned user<br>?kick [user] : Temporarily disconnects a user";
var users = {};
var authList = require('./users.json');
var registered_rooms = require('./registered_rooms.json');
console.log(registered_rooms);

// This is so that the last 20 messages sent to 'lobby' will be recorded.
// (mostly for liability issues)
var msgs = [];
function saveMessage(msg) {
  if (msgs.length < 20) {
    msgs.push(msg);
  }
  else {
    msgs.splice(0, 1);
    msgs.push(msg);
  }
}

// Function for date/time
var toLocalTime = function() {
  var d = new Date();
  var offset = (new Date().getTimezoneOffset() / 60) * -1;
  var n = new Date(d.getTime() + offset);
  return n;
};

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
app.get('/googleb7532997be74f84b.html', function(req, res){
  res.sendFile(__dirname + '/googleb7532997be74f84b.html');
});

// Upon a connection, keep it open via this callback
io.on('connection', function(socket){
  // Message upon disconnection
  socket.on('disconnect', function(){
    if (users[socket.id] !== undefined) {
      header='> User [';
      if (authList[users[socket.id].name]['admin']) {
        header = "> Admin [<img src='/static/admin.png'>"}
      msg = Buffer.from(header+"<span style='"+authList[users[socket.id].name]['nameStyle']+"'>"+users[socket.id].name+"</span>] has left").toString('base64');
      datetimestring = toLocalTime().toLocaleString()
      //io.to(users[socket.id].room).emit('message', [datetimestring, msg]);
      //saveMessage([datetimestring, msg]);
      if (users[socket.id] !== undefined) {
      var rep = [];
      var cRoom = users[socket.id].room;
      for (id in users) {
        if (users[id].room == cRoom) {
          rep.push(users[id].name);
        }
      }
      io.to(users[socket.id].room).emit('users online', rep);
    }
      delete users[socket.id];
    }
  });

  // Message upon joining a room and room switching script
  socket.on('join', function(data){
    if (authList[data[0]] !== undefined) {
    users[socket.id] = {
      name:data[0],
      room:data[1]
    };
    socket.join(data[1]);
    header='> User [';
    if (authList[data[0]] !== undefined && authList[data[0]]['admin']) {
      header = "> Admin [<img src='/static/admin.png'>"
    }
    msg = Buffer.from(header+"<span style='"+authList[data[0]]['nameStyle']+"'>"+data[0]+"</span>] has joined!").toString('base64');
    datetimestring = toLocalTime().toLocaleString()
    //setTimeout(function(){io.to(data[1]).emit('message', [datetimestring, msg]);}, 1000);
    if (data[1] == 'lobby') {
      //io.to(socket.id).emit('message', msgs);
      for (i in msgs) {
        io.to(socket.id).emit('message', msgs[i]);
      }
      //saveMessage([datetimestring, msg]);
    }
      if (users[socket.id] !== undefined) {
      var rep = [];
      var cRoom = users[socket.id].room;
      for (id in users) {
        if (users[id].room == cRoom) {
          rep.push(users[id].name);
        }
      }
      io.to(users[socket.id].room).emit('users online', rep);
    }
    }});

  // Auth
  socket.on('auth', function(data){
    var user = data[0];
    var pwd = data[1];
    for (stored_user in authList) {
      //console.log(stored_user, user);
      if (stored_user.toLowerCase() == user.toLowerCase()) {
        user = stored_user;
      }
    }
    var uData = authList[user];
    //console.log(data);
    //console.log(uData);
    if (uData !== undefined && !uData.active) {
      io.to(socket.id).emit('err', "Error: You have been banned!");
    } else if (uData == undefined) {
      io.to(socket.id).emit('err', "Error: Username not found.");
    } else if (uData.pass !== pwd) {
      io.to(socket.id).emit('err', "Error: Incorrect password.");
    } else {
      io.to(socket.id).emit('a-ok', user);
    }
  });

  // Message sending script allowing for username colors
  socket.on("message", function(data){
    data = Buffer.from(data, 'base64').toString('utf8');
    var send = true;
    if (users[socket.id] !== undefined && data !== undefined && data !== null) {
      datetimestring = toLocalTime().toLocaleString() ///datetime
      var senderName = users[socket.id].name;
      if(command.isCommand(data)) {
        /*if (data.startsWith("?adduser ") && authList[senderName] !== undefined &&authList[senderName]['admin']) {
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
              if (err) {return console.log(err);} else {io.emit('message', [datetimestring, Buffer.from("> User successfully added!").toString('base64')]);}
              console.log(splitData[1]+" was added by "+senderName+"!");});
          }
        } else */
        
        var cmd = command.getCommand(data);
        // rmuser command
        if (command.getCommandID(cmd) == 0 && authList[senderName] !== undefined && authList[senderName]['admin']){
          // Remove a user
          splitData = data.split(" ");
          if (splitData.length > 1) {
            if (splitData[1].startsWith('@')) {splitData[1] = splitData[1].substr(1);}
            if (authList[splitData[1]] == undefined || splitData[1] == "_System") {
              io.to(socket.id).emit('message', [datetimestring, Buffer.from("> User not found!").toString('base64')]);
            } else {
              for (key in users) {
                if (users[key].name == splitData[1]) {
                  delete users[key];
                }
              }
              delete authList[splitData[1]];
              content = JSON.stringify(authList);
              fs.writeFile("users.json", content, 'utf8', function (err) {
                if (err) {return console.log(err);} else {io.to(users[socket.id].room).emit('message', [datetimestring, Buffer.from("> User successfully removed!").toString('base64')]);}
                console.log(splitData[1]+" was removed by "+senderName+"!");});
            }
          }
        }
        // broadcast command
        else if (command.getCommandID(cmd) == 50 && authList[senderName] !== undefined && authList[senderName]['admin']) {
          send = false;
          var packet = "<span style='background:cyan;'>> "+data.substring(11)+"</span>";
          msg = Buffer.from(packet).toString('base64');
          io.emit("message", [datetimestring, msg]);
          saveMessage([datetimestring, msg]);

        }
        // help command
        else if (command.getCommandID(cmd) == 100) {
          if(authList[senderName]['admin']) {
          	var helpmsg = "";
          	var c;
          	for(var c_name in command.getCommandList()) {
          		c = command.getRawCommand(c_name);
          		if(c.alias === undefined) {
          			helpmsg = helpmsg + command.getCommandLabel() + command.getCommandHelp(c);
          			helpmsg = helpmsg + " : " + command.getCommandDescription(c);
          			helpmsg = helpmsg + "<br />"
           		}
          	}
          	io.to(socket.id).emit('message', [datetimestring, Buffer.from(helpmsg).toString('base64')]);
          }
          else {
          	var helpmsg = "";
          	var c;
          	for(var c_name in command.getCommandList()) {
          		c = command.getRawCommand(c_name);
          		if(c.alias === undefined && c.scope != -1) {
          			helpmsg = helpmsg + command.getCommandLabel() + command.getCommandHelp(c);
          			helpmsg = helpmsg + " : " + command.getCommandDescription(c);
          			helpmsg = helpmsg + "<br />"
           		}
          	}
          	io.to(socket.id).emit('message', [datetimestring, Buffer.from(helpmsg).toString('base64')]);
          }

        }
        // promote command
        else if (command.getCommandID(cmd) == 4 && authList[senderName] !== undefined && authList[senderName]['admin']) {
          // Promote
          splitData = data.split(" ");
          if (splitData[1].startsWith('@')) {splitData[1] = splitData[1].substr(1);}
          if (authList[splitData[1]] == undefined || splitData[1] == "_System") {
              io.to(socket.id).emit('message', [datetimestring, Buffer.from("> User not found!").toString('base64')]);
            } else {
              authList[splitData[1]]['admin'] = true;
              content = JSON.stringify(authList);
              fs.writeFile("users.json", content, 'utf8', function (err) {
                if (err) {return console.log(err);} else {io.to(users[socket.id].room).emit('message', [datetimestring, Buffer.from("> User successfully promoted!").toString('base64')]);}
                console.log(splitData[1]+" was promoted by "+senderName+"!");});
            }

        }
        // demote command
        else if (command.getCommandID(cmd) == 5 && authList[senderName] !== undefined && authList[senderName]['admin']) {
          // Demote
          splitData = data.split(" ");
          if (splitData[1].startsWith('@')) {splitData[1] = splitData[1].substr(1);}
          if (authList[splitData[1]] == undefined || splitData[1] == "_System") {
              io.to(socket.id).emit('message', [datetimestring, Buffer.from("> User not found!").toString('base64')]);
            } else {
              authList[splitData[1]]['admin'] = false;
              content = JSON.stringify(authList);
              fs.writeFile("users.json", content, 'utf8', function (err) {
                if (err) {return console.log(err);} else {io.to(users[socket.id].room).emit('message', [datetimestring, Buffer.from("> User successfully demoted!").toString('base64')]);}
                console.log(splitData[1]+" was demoted by "+senderName+"!");});
            }

        }
        // ban command
        else if (command.getCommandID(cmd) == 1 && authList[senderName] !== undefined && authList[senderName]['admin']) {
          // Ban
          splitData = data.split(" ");
          if (splitData[1].startsWith('@')) {splitData[1] = splitData[1].substr(1);}
          if (authList[splitData[1]] == undefined || splitData[1] == "_System") {
            io.to(socket.id).emit('message', [datetimestring, Buffer.from("> User not found!").toString('base64')]);
          } else {
            for (key in users) {
              if (users[key].name == splitData[1]) {
                delete users[key];
              }
            }
            authList[splitData[1]]['active'] = false;
            content = JSON.stringify(authList);
            fs.writeFile("users.json", content, 'utf8', function (err) {
              if (err) {
                return console.log(err);
              } else {
                io.to(users[socket.id].room).emit('message', [datetimestring, Buffer.from("> User successfully banned!").toString('base64')]);
              }
              console.log(splitData[1]+" was banned by "+senderName+"!!!");
            });
          }
        }
        // kick command
        else if (command.getCommandID(cmd) == 3 && authList[senderName] !== undefined && authList[senderName]['admin']) {
          // Kick
          splitData = data.split(" ");
          if (splitData[1].startsWith('@')) {splitData[1] = splitData[1].substr(1);}
          if (authList[splitData[1]] == undefined || authList[splitData[1]] == "_System") {
              io.to(socket.id).emit('message', [datetimestring, Buffer.from("> User not found!").toString('base64')]);
            } else {
              for (i in users) {
                if (users[i].name == splitData[1] && users[i].room == users[socket.id].room) {
                  io.to(i).emit('disconnect', 'get kicked bro');
                  console.log(splitData[1]+" was kicked by "+senderName+"!");
                  delete users[i];
                }
              }
              io.to(users[socket.id].room).emit('message', [datetimestring, Buffer.from("> User kicked!").toString('base64')]);
            }
        }
        // unban command
        else if (command.getCommandID(cmd) == 2 && authList[senderName] !== undefined && authList[senderName]['admin']) {
          // Un-ban
          splitData = data.split(" ");
          if (splitData[1].startsWith('@')) {splitData[1] = splitData[1].substr(1);}
          if (authList[splitData[1]] == undefined || splitData[1] == "_System") {
            io.to(socket.id).emit('message', [datetimestring, Buffer.from("> User not found!").toString('base64')]);
          } else {
            authList[splitData[1]]['active'] = true;
            content = JSON.stringify(authList);
            fs.writeFile("users.json", content, 'utf8', function (err) {
              if (err) {
                return console.log(err);
              } else {
                io.to(users[socket.id].room).emit('message', [datetimestring, Buffer.from("> User successfully unbanned!").toString('base64')]);
                console.log(splitData[1]+" was unbanned by "+senderName+"!");
              }
            });
          }
        }
        // pm command
        else if (command.getCommandID(cmd) == 103) {
          send = false;
          splitData = data.split(" ");
          if (splitData[1].startsWith('@')) {splitData[1] = splitData[1].substr(1);}
          online=false;
          recvid='';
          for (socketid in users){
            if (users[socketid].name == splitData[1]) {online=true;recvid=socketid;}
          }
          if (splitData.length < 3 || !online || users[recvid] == undefined) {
            io.to(socket.id).emit('message', [datetimestring, Buffer.from("> User doesn't exist or isn't online!").toString('base64')]);
          } else {
            var header = '[PRIVATE MESSAGE FROM ';
            var header2= '[MESSAGE TO ';
            if (authList[senderName]['admin']) {
              header = "[PRIVATE MESSAGE FROM <img src='/static/admin.png'>";
            }
            if (authList[splitData[1]]['admin']) {
              header2 = "[MESSAGE TO <img src='/static/admin.png'>";
            }
            toField = splitData[1];
            splitData.splice(0, 2);
            packet = header+users[socket.id].name+"] : "+splitData.join(' ');
            packet2 = header2+toField+"] : "+splitData.join(' ');
            io.to(recvid).emit('message', [datetimestring, Buffer.from(packet).toString("base64")]);
            io.to(socket.id).emit('message', [datetimestring, Buffer.from(packet2).toString("base64")]);
          }
          
        }
        // color command
        else if (command.getCommandID(cmd) == 102 && authList[senderName] !== undefined) {
          // Set the name color of the person running the command
          splitData = data.split(" "); 
          if (authList[senderName] == undefined) {
            io.to(socket.id).emit('message', [datetimestring, Buffer.from("> User not found!").toString('base64')]);
          } else {
            authList[senderName]['nameStyle'] = "color:"+splitData[1];
            content = JSON.stringify(authList);
            fs.writeFile("users.json", content, 'utf8', function (err) {
              if (err) {
                return console.log(err);
              } else {
                io.to(users[socket.id].room).emit('message', [datetimestring, Buffer.from("> Color changed!").toString('base64')]);
              }
            });
          }
          
        }
        // llamafy command
        else if (command.getCommandID(cmd) == 101 && authList[senderName] !== undefined) {
          // Llamafy
          send = false;
          splitData = data.split(" ");
          var packet = "<span style='background:cyan;'>> "+splitData[1]+" has been turned into a llama by "+senderName+"!</span>";
          io.emit("message", [datetimestring, Buffer.from(packet).toString('base64')]);
        }
        // img command
        else if (command.getCommandID(cmd) == 104) {
          splitData = data.split(" ");
          var imgpacket = "<img src='"+splitData[1]+"' /><a></a>";
          io.to(users[socket.id].room).emit('message', [datetimestring, Buffer.from(imgpacket).toString('base64')]);
          saveMessage([datetimestring, Buffer.from(imgpacket).toString('base64')]);
        }
        // register command
        else if (command.getCommandID(cmd) == 200) {
          // register room, but not if already taken
          userRoom = users[socket.id].room
          if (registered_rooms[userRoom]) {
            // notify user of registration
            io.to(socket.id).emit('message', [datetimestring, Buffer.from('> Sorry, room is already registered by '+registered_rooms[userRoom]['owner']).toString('base64')]);
          } else {
            io.to(socket.id).emit('message', [datetimestring, Buffer.from('> test').toString('base64')]);
          }
        }
      }
      if (send) {
        var header = '';
        if (authList[senderName]['admin']) {
          header = "<img src='/static/admin.png'>"}

        // Graft together an unnecessarily complicated packet =)
        //console.log('test1');
        if (senderName !== '_System') { // If the user isn't _System, sanitize their input
          data = data.split('>').join('&gt;');
          data = data.split('<').join('&lt;');
          //console.log('test');
        }
        data = data.substring(0, 256);
        var packet = "["+header+"<span style='"+authList[senderName]['nameStyle']+"'>"+senderName+"</span>] "+data;
        if(users[socket.id] !== undefined) {
          msg = Buffer.from(packet).toString('base64');
          io.to(users[socket.id].room).emit('message', [datetimestring, msg]);
          if (users[socket.id].room == 'lobby') {
            saveMessage([datetimestring, msg]);
          }
        }
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
    } else if (data[0].indexOf(' ') !== -1) {
      io.to(socket.id).emit('err', "Please no spaces in usernames, it's hard on my code")
    } else if (authList[data[0]] !== undefined) {
      io.to(socket.id).emit('err', "Error: Username already in use!");
    } else {
      is_taken = false
      for (stored_user in authList) {
        //console.log(stored_user, user);
        if (stored_user.toLowerCase() == data[0].toLowerCase()) {
          io.to(socket.id).emit('err', "Error: Username already in use!");
          is_taken = true
        }
      }
      if (!is_taken) {
        newUser = {
              "active":true,
              "admin":false,
              "nameStyle":"",
              "pass":data[1]
            };
            authList[data[0]] = newUser;
            // Write to users.json
            content = JSON.stringify(authList);
            fs.writeFile("users.json", content, 'utf8', function (err) {
              if (err) {return console.log(err);} else {
              console.log(data[0]+" has signed up!");}});
        io.to(socket.id).emit('err', "<span style='color:blue'>Success! You may now log in.</span>");
      }
    }
  });
});

stdin.addListener("data", function(d) {
  datetimestring = toLocalTime().toLocaleString() ///datetime
  packet = "<span style='background:cyan;'><span class='alert'>SERVER ALERT</span> > "+d.toString().trim()+"</span>";
  msg = Buffer.from(packet).toString('base64');
  io.emit("message", [datetimestring, msg]);
  saveMessage([datetimestring, msg]);
});

// Start the server
http.listen(port, function(){
  console.log('Listening on port:'+port);
});
