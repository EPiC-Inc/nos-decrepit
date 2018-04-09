// Dependenies
var socket=io();

// Document elements
var messages = document.getElementById("messages");
var m = document.getElementById("messageSender");
var users = document.getElementById("onlineUsers");

// Variables
var room = '';
var menuOpen = false;

//Functions
function getUrlVars() {
    var vars = {};
    var parts = window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var rmCookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

function logout() {
  rmCookie('user');
  rmCookie('key');
  window.location.replace("/");
}

function sendMsg() {
  if (room !== undefined && m.value.trim() !== '') {
    socket.emit('message', m.value);
    m.value = '';
  }
}

function menu() {
  menuOpen = !menuOpen;
  if (menuOpen) {
    socket.emit('query');
    document.getElementById("menuBtn").innerHTML = 'X';
    document.getElementById("menu").hidden = false;
  } else {
    document.getElementById("menuBtn").innerHTML = 'Ξ';
    document.getElementById("menu").hidden = true;
  }
}

function changeRoom() {
  var toGo = document.getElementById('roomSelect').value;
  if (toGo == '' || toGo == undefined) {toGo = 'lobby';}
  window.location.href = '/static/coms.html?room='+toGo;
}

// On page load
//console.log(getCookie('user'));
if (getCookie('user') !== "" && getCookie('user') !== undefined) {
  socket.emit('auth', [getCookie("user"), parseInt(getCookie("key"))]);
  var username = getCookie("user");
}

// Callbacks
// Error logging
socket.on('err', function(data){
  console.log(data);
});

socket.on('a-ok', function(){
  console.log("A-OK recieved!");
  document.getElementById("logout").hidden = false;
  room = getUrlVars()['room'];
  if (room == undefined) {room = 'lobby';}
  //console.log(room);
  socket.emit('join', [getCookie("user"), room]);
  document.getElementById("roomName").innerHTML = "Room : "+room;
});

socket.on('users online', function(data){
  users.innerHTML = '';
  for (i in data) {
    users.innerHTML += '<div>'+data[i]+'</div>';
  }
});

socket.on("message", function(data){
  // Add message
  // console.log(data);
  var start='<div>'
  if (data.includes('@'+username)) {
    start = '<div class="alert">';
  }
  messages.innerHTML += start+data+"</div>";
  window.scrollTo(0,document.body.scrollHeight);
});
