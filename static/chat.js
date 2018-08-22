// Dependenies
var socket=io();

// Document elements
var messages = document.getElementById("messages");
var m = document.getElementById("messageSender");
var users = document.getElementById("onlineUsers");
var scroll = document.getElementById("scroll");
var online = true;

// Variables
var room = '';
var menuOpen = false;
var online = []
var alertWaiting = false;

// Query users upon login, may cause lag but better for aesthetics
socket.emit('query');

//Functions
//Change favicon
function changeIco(ref) {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = ref;
    document.getElementsByTagName('head')[0].appendChild(link);
}

// See if the page is visible (for favicon changing)
var vis = (function(){
    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();

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
    socket.emit('message', btoa(unescape(encodeURIComponent(m.value))));
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

function cUrl(str) {
	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	var text1=str.replace(exp, "<a href='$1' target='_blank'>$1</a>");
	var exp2 =/(^|[^\/])(www\.[\S]+(\b|$))/gim;
	return text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
}

var toLocalTime = function() {
  var d = new Date();
  var offset = (new Date().getTimezoneOffset() / 60) * -1;
  var n = new Date(d.getTime() + offset);
  return n;
};

// On page load
//console.log(getCookie('user'));
if (getCookie('user') !== "" && getCookie('user') !== undefined) {
  socket.emit('auth', [getCookie("user"), parseInt(getCookie("key"))]);
  var username = getCookie("user");
}

// Callbacks
vis(function(){
    if (vis()) {changeIco('/static/favicon.png');
                alertWaiting = false;}
    //changeIco(vis() ? '/static/favicon.png' : '/static/alert.png');
});

// Error logging
socket.on('err', function(data){
  console.log(data);
});

socket.on('a-ok', function(){
  console.log("A-OK recieved!");
  document.getElementById("logout").hidden = false;
  document.getElementById("login").hidden = true;
  room = getUrlVars()['room'];
  if (room == undefined) {room = 'lobby';}
  //console.log(room);
  socket.emit('join', [getCookie("user"), room]);
  document.getElementById("roomName").innerHTML = "Room : "+room;
});

socket.on('users online', function(data){
  users.innerHTML = '';
  for (i in data) {
    users.innerHTML += '<br><div class="user"><button style="background:lightcyan;border:none;font-size:15px;" onclick="m.value+=\'@'+data[i]+'\';menu()">'+data[i]+'</button><span class="tooltiptext"><button style="background:black;border:none;font-size:15px;color:white;" onclick="m.value+=\'?pm @'+data[i]+'\';menu()">Message</button></span></div>';
  }
});

socket.on("message", function(supadata){
  if (online) {
    console.log(supadata);
    data = decodeURIComponent(escape(atob(String(supadata[1]))));
    // Add message
    var start='<div>'
    if (!alertWaiting) {
      if (!vis()) {changeIco('/static/msg.png');}
    }
    if (data.includes('@'+username) || data.includes('@everyone')) {
      if (!vis()) {changeIco('/static/alert.png');}
      alertWaiting = true;
      start = '<div class="alert">';
    }
    var ds = data.split(' ');
    dataSplit = [ds.shift(), ds.join(' ')];
  	if (!data.startsWith('>') && !dataSplit[1].includes('<iframe') && !dataSplit[1].includes('<img') && !dataSplit[1].includes('<a')) {
    	dataSplit[1] = cUrl(dataSplit[1]);
  	}
    data = dataSplit.join(' ');
    $("#messages").append(supadata[0]+" "+start+data+"</div>");
    if (scroll.checked) {
      window.scrollTo(0,document.body.scrollHeight);
    }
  }
});

socket.on("disconnect", function(reason){
  if (online) {
    online = false;
    $("#messages").append("<div>> Connection terminated. <</div>");
    window.scrollTo(0,document.body.scrollHeight);
  	changeIco('/static/disconnect.png');
    console.log(reason);
  }
});
