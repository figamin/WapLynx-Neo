var themes = {};

themes.init = function() {

  themes.themes = [ {
    label : 'Wapanese (for /wap/)',
    id : 'wap'
  }, {
    label : 'Shrine (for /cel/)',
    id : 'cel'
  }, {
    label : 'Yotsuba (for /digi/)',
    id : 'digi'
  }, {
    label : 'PC-98 (for /pixl/)',
    id : 'pixl'
  }, {
    label : 'Rumic (for /rumi/)',
    id : 'rumi'
  }, {
    label : 'Scarlet (for /th/)',
    id : 'th'
  }, {
    label : 'Serenity (for /art/)',
    id : 'art'
  }, {
    label : 'Bricks (for /hob/)',
    id : 'hob'
  }, {
    label : 'Book (for /lit/)',
    id : 'lit'
  }, {
    label : 'Walkman (for /mu/)',
    id : 'mu'
  }, {
    label : 'Workbench (for /tech/)',
    id : 'tech'
  }, {
    label : 'Sandbox (for /chill/)',
    id : 'chill'
  }, {
    label : 'Wapchan Classic',
    id : 'wc'
  }, {
    label : 'Yotsuba B',
    id : 'digi theme_digi2'
  }, {
    label : 'Kind',
    id : 'kind'
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