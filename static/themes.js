function changecss(theClass, element, value) {
    //Last Updated on July 4, 2011
    //documentation for this script at
    //http://www.shawnolson.net/a/503/altering-css-class-attributes-with-javascript.html
    //all credit is due to Shawn Olson for the css modifer script
    var cssRules;


    for (var S = 0; S < document.styleSheets.length; S++) {


        try {
            document.styleSheets[S].insertRule(theClass + ' { ' + element + ': ' + value + '; }', document.styleSheets[S][cssRules].length);

        } catch (err) {
            try {
                document.styleSheets[S].addRule(theClass, element + ': ' + value + ';');

            } catch (err) {

                try {
                    if (document.styleSheets[S]['rules']) {
                        cssRules = 'rules';
                    } else if (document.styleSheets[S]['cssRules']) {
                        cssRules = 'cssRules';
                    } else {
                        //no rules found... browser unknown
                    }

                    for (var R = 0; R < document.styleSheets[S][cssRules].length; R++) {
                        if (document.styleSheets[S][cssRules][R].selectorText == theClass) {
                            if (document.styleSheets[S][cssRules][R].style[element]) {
                                document.styleSheets[S][cssRules][R].style[element] = value;
                                break;
                            }
                        }
                    }
                } catch (err) {}
            }
        }
    }
}

// theme setters are here as to not include junk in coms.html


//Making a new theme? Ask Fred18295 for some info first so you don't break anything
function minimalLightTheme(){
  document.cookie='theme=minimalLight';
  //defaultTheme();
  changecss('body','background-color','white');
  changecss('header','background-color', 'white');
  changecss('#menu', 'background-color', 'white');
  changecss('#menu', 'color', 'black');
  changecss('.userbtn', 'background-color', 'white');
  changecss('.userbtn','color','black'); //NID
  changecss('button', 'background-color', 'white');
  changecss('button', 'border', '2px solid black');
  changecss('button','color','black'); //NID
  changecss('h1','color','black');
  changecss('#messages','color','black');
  changecss('.msg', 'color', 'black');
  changecss('.msgSender', 'background-color', 'white');
  changecss('.dropbtn', 'background-color', 'white');
  changecss('.dropbtn', 'border', '2px solid black'); //NID
  changecss('.dropbtn', 'color', 'black'); //NID
  changecss('span', 'color', 'white');
  changecss('input', 'background-color', 'white');
  changecss('.msgSender', 'color', 'black'); //NID
  changecss('.userbtn', 'border', '2px solid black'); //NID
  changecss('.msgSender button','border','2px solid black'); //NID
  changecss('.msgSender input','color','black'); //NID
  changecss('.msgSender input','border','2px solid black'); //NID
  changecss('input','border','2px solid black'); //NID
  //Fix for Min Dark Theme
  chagecss('.userbtn', 'color', 'black');
  changecss('button', 'color', 'black')
  changecss('.msgSender', 'color', 'black');
  changecss('.userbtn', 'border', '2px solid black');
  changecss('.msgSender input','color','black');
  changecss('.msgSender input','border','2px solid black');
  changecss('input','border','2px solid black');
}

function darkTheme() {
  document.cookie='theme=dark';
  //defaultTheme();
  changecss('body','background-color','rgb(13, 13, 13)');
  changecss('header','background-color', 'rgb(77, 77, 77)');
  changecss('#menu', 'background-color', 'rgb(77, 77, 77)');
  changecss('#menu', 'color', 'rgb(217, 217, 217)');
  changecss('.userbtn', 'background-color', 'rgb(140, 140, 140)');
  changecss('button', 'background-color', 'rgb(140, 140, 140)');
  changecss('button', 'border', '2px solid rgb(166, 166, 166)');
  changecss('h1','color','rgb(217, 217, 217)');
  changecss('#messages','color','rgb(179, 179, 179)');
  changecss('.msg', 'color', 'rgb(191, 191, 191)');
  changecss('.msgSender', 'background-color', 'rgb(77, 77, 77)');
  changecss('.dropbtn', 'background-color', 'rgb(140, 140, 140)');
  changecss('span', 'color', 'white');
  changecss('input', 'background-color', 'rgb(128, 128, 128)');
  //Fix for Min Dark Theme
  chagecss('.userbtn', 'color', 'black');
  changecss('button', 'color', 'black')
  changecss('.msgSender', 'color', 'black');
  changecss('.userbtn', 'border', '2px solid black');
  changecss('.msgSender input','color','black');
  changecss('.msgSender input','border','2px solid black');
  changecss('input','border','2px solid black');
  //Fix for Min Lt Theme
  changecss('.dropbtn', 'border', '');
  changecss('.dropbtn', 'color', 'white');
}
function minimalDarkTheme() {
  document.cookie='theme=minimalDark';
  //defaultTheme();
  changecss('body','background-color','black');
  changecss('header','background-color', 'black');
  changecss('#menu', 'background-color', 'black');
  changecss('#menu', 'color', 'white');
  changecss('.userbtn', 'background-color', 'black');
  changecss('.userbtn','color','white'); //NID
  changecss('button', 'background-color', 'black');
  changecss('button', 'border', '2px solid white');
  changecss('button','color','white'); //NID
  changecss('h1','color','white');
  changecss('#messages','color','white');
  changecss('.msg', 'color', 'white');
  changecss('.msgSender', 'background-color', 'black');
  changecss('.dropbtn', 'background-color', 'black');
  changecss('span', 'color', 'black');
  changecss('input', 'background-color', 'black');
  changecss('.msgSender', 'color', 'rgb(0, 0, 0)'); //NID
  changecss('.userbtn', 'border', '2px solid white'); //NID
  changecss('.msgSender button','border','2px solid white'); //NID
  changecss('.msgSender input','color','white'); //NID
  changecss('.msgSender input','border','2px solid white'); //NID
  changecss('input','border','2px solid white'); //NID
  //Fix for Min Lt Theme
  changecss('.dropbtn', 'border', '');
  changecss('.dropbtn', 'color', 'white');
}
function painTheme() {
  document.cookie='theme=pain';
  //defaultTheme();
  changecss('body','background-color','rgb(56, 16, 16)'); //
  changecss('header','background-color', 'rgb(136, 133, 0)'); //
  changecss('#menu', 'background-color', 'rgb(39, 97, 64)'); //
  changecss('#menu', 'color', 'rgb(255, 153, 0)'); //
  changecss('.userbtn', 'background-color', 'rgb(204, 0, 204)'); //
  changecss('button', 'background-color', 'rgb(142, 62, 92)'); //
  changecss('button', 'border', '2px solid rgb(210, 255, 228)'); //
  changecss('h1','color','rgb(64, 65, 41)'); //
  changecss('#messages','color','rgb(153, 102, 51)'); //
  changecss('.msg', 'color', 'rgb(191, 191, 191)'); //
  changecss('.msgSender', 'background-color', 'rgb(13, 191, 66)'); //
  changecss('.dropbtn', 'background-color', 'rgb(105, 255, 204)'); //
  changecss('span', 'color', 'white'); //
  changecss('input', 'background-color', 'rgb(153, 153, 102)'); //
  //Fix for Min Dark Theme
  chagecss('.userbtn', 'color', 'black');
  changecss('button', 'color', 'black')
  changecss('.msgSender', 'color', 'black');
  changecss('.userbtn', 'border', '2px solid black');
  changecss('.msgSender input','color','black');
  changecss('.msgSender input','border','2px solid black');
  changecss('input','border','2px solid black');
  //Fix for Min Lt Theme
  changecss('.dropbtn', 'border', '');
  changecss('.dropbtn', 'color', 'white');
}
function defaultTheme() {
  document.cookie='theme=default';
  changecss('body','background-color','white');
  changecss('header','background-color', '#33ccff');
  changecss('#menu', 'background-color', 'lightcyan');
  changecss('#menu', 'color', 'black');
  changecss('.userbtn', 'background-color', 'lightcyan');
  changecss('button', 'background-color', 'cyan');
  changecss('button', 'border', '2px solid darkcyan');
  changecss('h1','color','black');
  changecss('#messages','color','black');
  changecss('.msg', 'color', 'black');
  changecss('.msgSender', 'background-color', 'white');
  changecss('.dropbtn', 'background-color', '#3498DB');
  changecss('span', 'color', 'black');
  changecss('input', 'background-color', 'white');
  //Fix for Min Dark Theme
  chagecss('.userbtn', 'color', 'black');
  changecss('button', 'color', 'black')
  changecss('.msgSender', 'color', 'black');
  changecss('.userbtn', 'border', '2px solid black');
  changecss('.msgSender input','color','black');
  changecss('.msgSender input','border','2px solid black');
  changecss('input','border','2px solid black');
  //Fix for Min Lt Theme
  changecss('.dropbtn', 'border', '');
  changecss('.dropbtn', 'color', 'white');
}
