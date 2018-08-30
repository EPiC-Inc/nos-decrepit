# nos / NOrSe (Formerly NOS-ALPHA)

This is a web-based chat client that will be slowly evolving. There is a demo at http://nos-cli.tk

(Congrats to whoever can read my poorly documented code)


# Requirements
* Node.js
* NPM

# Downloading
`git clone https://github.com/EPiC-Inc/nos-alpha.git`

# Installing Dependencies
`npm install --save express socket.io sanitize-html`

# Starting server

To start the server, you can use

`bash ./start_nos.sh [port]` or `./start_nos.bat [port]` <br>
[port] is optional and will default to 80

`bash ./start_nos.sh test` or `./start_nos.bat test` to quickly start on port 8080

or you could use the old method:

`node server.js [port]`<br>
[port] is optional, defaults to 80

`npm test` to quickly start on port 8080

`npm start` starts it on port 80

this method may require the creation of some files if they do not exist.

# Updating
`git pull origin master`

# Themes

To add a color theme to the default list you can find in the options menu, first, open up 'themes.js' in the 'static' directory. Scroll to the bottom of the document. You will find the function `darkTheme()` present. Copy this entire function and paste it at the bottom of the file.

Customize the color values for each field as you will, replacing the rgb values with anything HTML supports (rgb, HEX, or just saying 'white' or 'gray'). Rename function from darkTheme() to whatever you wish.

Then, open the file 'coms.html' in the 'static' directory. Use ctrl-f to find 'darkTheme()', and, on a line below it, paste the following: 

`<a href="#" onclick="darkTheme()">Dark Theme</a>`

Replace 'darkTheme()' with your function name, and the words 'Dark Theme' with the name of your new theme. Reload the page and you will be good!
