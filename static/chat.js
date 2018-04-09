// Dependenies
var socket=io();

// Document elements
var messages = document.getElementById("messages");
var m = document.getElementById("messageSender");

// Variables
var room = '';

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

// On page load
if (getCookie('user') !== "" && getCookie('user') !== undefined) {
  username = getCookie('user');
  socket.emit('auth', [username, parseInt(getCookie('key'))]);
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
  socket.emit('join', [username, room]);
  document.getElementById("roomName").innerHTML = "Room : "+room;
});

socket.on("message", function(data){
  // Add message
  // console.log(data);
  messages.innerHTML += "<div>"+data+"</div>";
  window.scrollTo(0,document.body.scrollHeight);
});
