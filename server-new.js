// Refactored version of server.js

// Dependencies - don't need to worry too much about these
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var fs = require('fs');
var sanitize = require('sanitize-html');
var stdin = process.openStdin();
// End dependencies

// Vars
var commands = require('./commands.js');
var users = {};
var authList = require('./users.json');
var rooms = require('./rooms.json');
