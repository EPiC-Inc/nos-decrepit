# nos / NOrSe (Formerly NOS-ALPHA)

This is a web-based chat client that will be slowly evolving.

(Congrats to whoever can read my poorly documented code)


# Requirements
* Node.js
* NPM

# Downloading
`git clone https://github.com/EPiC-Inc/nos-alpha.git`

# Installing Dependencies
`npm install --save express socket.io sanitize-html`

# Starting server

Make sure to create a users.json file in the same directory as server.js. This is where all new accounts will be located (passwords will be encrypted).

`node server.js [port]`<br>
[port] is optional, defaults to 80

`npm test` to quickly start on port 8080

`npm start` starts it on port 80

# Updating
`git pull origin master`

# Themes

To add a color theme to the default list you can find in the options menu, first, open up 'themes.js' in the 'static' directory. Scroll to the bottom of the document. You will find the function `darkTheme()` present. Copy this entire function and paste it at the bottom of the file.

Customize the color values for each field as you will, replacing the rgb values with anything HTML supports (rgb, HEX, or just saying 'white' or 'gray'). Rename function from darkTheme() to whatever you wish.

Then, open the file 'coms.html' in the 'static' directory. Use ctrl-f to find 'darkTheme()', and, on a line below it, paste the following: 

`<a href="#" onclick="darkTheme()">Dark Theme</a>`

Replace 'darkTheme()' with your function name, and the words 'Dark Theme' with the name of your new theme. Reload the page and you will be good!
