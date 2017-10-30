var themes = [ {
  file : 'clear.css',
  label : 'Clear',
  id : 'clear'
}, {
  file : 'jungle.css',
  label : 'Jungle',
  id : 'jungle'
} ];

var customCss;
var addedTheme;

function updateCss() {

  if (addedTheme) {
    addedTheme.parentNode.removeChild(addedTheme);
    addedTheme = null;
  }

  for (var i = 0; i < themes.length; i++) {
    var theme = themes[i];

    if (theme.id === localStorage.selectedTheme) {
      addedTheme = theme.element;
      document.head.insertBefore(theme.element, customCss);
    }
  }

}

if (!DISABLE_JS) {

  for (var i = 0; i < document.head.children.length; i++) {
    var element = document.head.children[i];

    if (element.rel === 'stylesheet'
        && element.href.indexOf('/custom.css') > -1) {

      customCss = element;
      break;
    }

  }

  for (var i = 0; i < themes.length; i++) {
    themes[i].element = document.createElement('link');
    themes[i].element.type = 'text/css';
    themes[i].element.rel = 'stylesheet';
    themes[i].element.href = '/.static/css/' + themes[i].file;
  }

  updateCss();

  var postingLink = document.getElementById('navPosting');

  if (postingLink) {

    var referenceNode = postingLink.nextSibling;

    postingLink.parentNode.insertBefore(document.createTextNode(' '),
        referenceNode);

    var divider = document.createElement('span');
    divider.innerHTML = '/';
    postingLink.parentNode.insertBefore(divider, referenceNode);

    postingLink.parentNode.insertBefore(document.createTextNode(' '),
        referenceNode);

    var themeSelector = document.createElement('select');
    themeSelector.id = 'themeSelector';

    var vanillaOption = document.createElement('option');
    vanillaOption.innerHTML = 'Default';
    themeSelector.appendChild(vanillaOption);

    for (i = 0; i < themes.length; i++) {

      var theme = themes[i];

      var themeOption = document.createElement('option');
      themeOption.innerHTML = theme.label;

      if (theme.id === localStorage.selectedTheme) {
        themeOption.selected = true;
      }

      themeSelector.appendChild(themeOption);

    }

    themeSelector.onchange = function() {

      if (!themeSelector.selectedIndex) {

        if (localStorage.selectedTheme) {

          delete localStorage.selectedTheme;

          updateCss();
        }

        return;
      }

      var selectedTheme = themes[themeSelector.selectedIndex - 1];

      if (selectedTheme.id === localStorage.selectedTheme) {
        return;
      }

      localStorage.selectedTheme = selectedTheme.id;

      updateCss();

    };

    postingLink.parentNode.insertBefore(themeSelector, referenceNode);

  }

}