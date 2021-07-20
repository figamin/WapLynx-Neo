var themeLoader = {};

themeLoader.load = function(init) {

  var body = document.getElementsByTagName('body')[0];

  if (body.className && init && body.className.indexOf('theme_') >= 0) {
    localStorage.defaultTheme = body.className.substring(6);
  } else {
    delete localStorage.defaultTheme;
  }

  if (init && !localStorage.selectedTheme && !localStorage.manualDefault) {
    return;
  }

  if (localStorage.selectedTheme) {

    if (themeLoader.customCss && themeLoader.customCss.parentNode) {
      themeLoader.customCss.remove();
    }
    body.className = 'theme_' + localStorage.selectedTheme;
  } else {

    if (themeLoader.customCss && !themeLoader.customCss.parentNode) {
      document.head.appendChild(themeLoader.customCss);
    }
    body.removeAttribute('class');
  }

};

var linkedCss = document.getElementsByTagName('link');

for (var i = 0; i < linkedCss.length; i++) {

  var ending = '/custom.css';

  if (linkedCss[i].href.indexOf(ending) === linkedCss[i].href.length
      - ending.length) {
    themeLoader.customCss = linkedCss[i];
    break;
  }
}

themeLoader.load(true);