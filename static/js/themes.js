var themes = {};

themes.init = function() {

  themes.themes = [ {
    file : 'clear.css',
    label : 'Clear',
    id : 'clear'
  }, {
    file : 'jungle.css',
    label : 'Jungle',
    id : 'jungle'
  } ];

  for (var i = 0; i < themes.themes.length; i++) {
    themes.themes[i].element = document.createElement('link');
    themes.themes[i].element.type = 'text/css';
    themes.themes[i].element.rel = 'stylesheet';
    themes.themes[i].element.href = '/.static/css/' + themes.themes[i].file;
  }

  if (api.boardUri) {

    var linkedCss = document.getElementsByTagName('link');

    for (var i = 0; i < linkedCss.length; i++) {

      var ending = '/' + api.boardUri + '/custom.css';

      if (linkedCss[i].href.indexOf(ending) === linkedCss[i].href.length
          - ending.length) {
        themes.customCss = linkedCss[i];
        break;
      }
    }

  }

  themes.updateCss();

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

    for (i = 0; i < themes.themes.length; i++) {

      var theme = themes.themes[i];

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

          themes.updateCss();
        }

        return;
      }

      var selectedTheme = themes.themes[themeSelector.selectedIndex - 1];

      if (selectedTheme.id === localStorage.selectedTheme) {
        return;
      }

      localStorage.selectedTheme = selectedTheme.id;

      themes.updateCss();

    };

    postingLink.parentNode.insertBefore(themeSelector, referenceNode);

  }

};

themes.updateCss = function() {

  if (themes.addedTheme) {

    if (themes.customCss && !themes.customCss.parentNode) {
      document.head.appendChild(themes.customCss);
    }

    themes.addedTheme.remove();
    themes.addedTheme = null;
  }

  for (var i = 0; i < themes.themes.length; i++) {
    var theme = themes.themes[i];

    if (theme.id === localStorage.selectedTheme) {
      themes.addedTheme = theme.element;

      if (themes.customCss && themes.customCss.parentNode) {
        themes.customCss.remove();
      }

      document.head.appendChild(theme.element);
    }
  }

};

themes.init();