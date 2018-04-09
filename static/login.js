// Dependencies
var socket = io();

// Variables
var usr = document.getElementById("username");
var pwd = document.getElementById("password");
var username = '';
var password = '';

// Functions
hashCode = function(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
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

function login() {
  username = usr.value;
  password = hashCode(pwd.value);
  console.log("test");
  socket.emit('auth', [username, password]);
}

// Upon page load:
if (getCookie("user") != "" && getCookie("user") !== undefined) {
  username = getCookie("user");
  password = getCookie("key");
  socket.emit('auth', [getCookie("user"), parseInt(getCookie("key"))]);
}

// Callbacks
socket.on('err', function(data){
  document.getElementById("errors").innerHTML = data;
  console.log('err : '+data);
  pwd.value='';
});

socket.on('a-ok', function(){
  document.cookie='user='+username;
  document.cookie='key='+password;
  window.location.replace("/static/coms.html");
});
