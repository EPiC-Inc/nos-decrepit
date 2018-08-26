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
function defaultTheme() {
     window.location.reload();
}
