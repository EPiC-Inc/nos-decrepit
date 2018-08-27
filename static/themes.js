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

function darkTheme() {
    document.cookie='theme=dark';
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
}
function painTheme() {
    document.cookie='theme=pain';
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
}
