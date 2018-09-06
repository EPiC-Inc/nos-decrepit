function changeCSS(cssFile, cssLinkIndex) {

    var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", cssFile);

    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

function defaultTheme(){
  document.cookie= 'theme=default';
  changeCSS("/static/style.css", 1);
}
function darkTheme(){
  document.cookie='theme=dark';
  changeCSS("/static/darktheme.css", 1);
}
