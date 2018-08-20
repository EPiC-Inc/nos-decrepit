// Dependencies
var socket = io();

// Variables
var usr = document.getElementById("username");
var pwd = document.getElementById("password");
var cPwd = document.getElementById("confPassword");
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

function newAcct() {
  if (usr.value.includes(" ")) {
    document.getElementById("errors").innerHTML = "Error: Spaces are not allowed in the username!";
  } else if (pwd.value == cPwd.value) {
    username = usr.value;
    password = hashCode(pwd.value);
    console.log(username);
    console.log(password);
    socket.emit('new user', [username, password]);
  } else {
    document.getElementById("errors").innerHTML = "Error: Both passwords must match!";
  }
}

// Callbacks
socket.on('err', function(data){
  document.getElementById("errors").innerHTML = data;
  console.log('err : '+data);
  pwd.value='';
  cPwd.value='';
});

socket.on('a-ok', function(){
  window.location.replace("/static/coms.html");
});
