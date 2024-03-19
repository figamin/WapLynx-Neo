var themes = {};

themes.init = function() {

  themes.themes = [ {
    label : 'Wapanese',
    id : 'wap'
  }, {
    label : 'Shrine',
    id : 'cel'
  }, {
    label : 'Yotsuba',
    id : 'digi'
  }, {
    label : 'Yotsuba B',
    id : 'digi theme_digi2'
  }, {
    label : 'PC-98',
    id : 'pixl'
  }, {
    label : 'Rumic',
    id : 'rumi'
  }, {
    label : 'Scarlet',
    id : 'th'
  }, {
    label : 'Book',
    id : 'lit'
  }, {
    label : 'Oil',
    id : 'chill'
  }, {
    label : 'Wapchan Classic',
    id : 'wc'
  }, {
    label : 'Kind',
    id : 'kind'
  }, {
    label : 'Ayashii',
    id : 'ayashii'
  }, {
    label : '2channel',
    id : '2channel'
  }, {
    label : 'Mage\'s Tower',
    id : 'tower'
  }];

  var postingLink = document.getElementById('lastHeader');
  if (!postingLink) {
    return;
  }
  var referenceNode = postingLink.nextSibling;
  postingLink.parentNode.insertBefore(document.createTextNode(' '),
      referenceNode);

  /*var divider = document.createElement('span');
  divider.innerHTML = 'Style:';
  postingLink.parentNode.insertBefore(divider, referenceNode);*/

  postingLink.parentNode.insertBefore(document.createTextNode(' '),
      referenceNode);

  var themeSelector = document.createElement('select');
  themeSelector.id = 'themeSelector';

  var vanillaOption = document.createElement('option');
  vanillaOption.innerHTML = 'Board-specific CSS';
  themeSelector.appendChild(vanillaOption);

  for (var i = 0; i < themes.themes.length; i++) {

    var theme = themes.themes[i];

    var themeOption = document.createElement('option');
    themeOption.innerHTML = theme.label;

    if (theme.id === localStorage.selectedTheme
        || (!localStorage.selectedTheme
            && theme.id === localStorage.defaultTheme && !localStorage.manualDefault)) {
      themeOption.selected = true;
    }

    themeSelector.appendChild(themeOption);

  }
  themeSelector.onchange = function() {

    if (!themeSelector.selectedIndex) {

      localStorage.manualDefault = true;

      if (localStorage.selectedTheme) {
        delete localStorage.selectedTheme;
        themeLoader.load();
      }

      return;
    }

    var selectedTheme = themes.themes[themeSelector.selectedIndex - 1];

    if (selectedTheme.id === localStorage.selectedTheme) {
      return;
    }

    delete localStorage.manualDefault;
    localStorage.selectedTheme = selectedTheme.id;

    themeLoader.load();

  };
  themeSelector.title = 'Themes'
  postingLink.parentNode.insertBefore(themeSelector, referenceNode);
};

themes.init();