var themes = [ {
  file : 'clear.css',
  label : 'Clear',
  id : 'clear'
}, {
  file : 'jungle.css',
  label : 'Jungle',
  id : 'jungle'
} ];

var addedTheme;
var customCss;

function updateCss() {

  if (addedTheme) {

    if (customCss && !customCss.parentNode) {
      document.head.appendChild(customCss);
    }

    addedTheme.remove();
    addedTheme = null;
  }

  for (var i = 0; i < themes.length; i++) {
    var theme = themes[i];

    if (theme.id === localStorage.selectedTheme) {
      addedTheme = theme.element;

      if (customCss && customCss.parentNode) {
        customCss.remove();
      }

      document.head.appendChild(theme.element);
    }
  }

}

if (!DISABLE_JS) {

  for (var i = 0; i < themes.length; i++) {
    themes[i].element = document.createElement('link');
    themes[i].element.type = 'text/css';
    themes[i].element.rel = 'stylesheet';
    themes[i].element.href = '/.static/css/' + themes[i].file;
  }

  if (typeof (boardUri) !== 'undefined') {

    var linkedCss = document.getElementsByTagName('link');

    for (var i = 0; i < linkedCss.length; i++) {

      var ending = '/' + boardUri + '/custom.css';

      if (linkedCss[i].href.indexOf(ending) === linkedCss[i].href.length
          - ending.length) {
        customCss = linkedCss[i];
        break;
      }
    }

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