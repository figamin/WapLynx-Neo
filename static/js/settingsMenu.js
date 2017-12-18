if (!DISABLE_JS) {

  var postingLink = document.getElementById('navPosting');
  var referenceNode = postingLink.nextSibling;

  postingLink.parentNode.insertBefore(document.createTextNode(' '),
      referenceNode);

  var divider = document.createElement('span');
  divider.innerHTML = '/';
  postingLink.parentNode.insertBefore(divider, referenceNode);

  postingLink.parentNode.insertBefore(document.createTextNode(' '),
      referenceNode);

  var settingsButton = document.createElement('a');
  settingsButton.innerHTML = 'settings';
  settingsButton.id = 'settingsButton';
  settingsButton.setAttribute('class', 'coloredIcon');
  postingLink.parentNode.insertBefore(settingsButton, referenceNode);

  var settingsMenu = document.createElement('div');

  var settingsMenuLabel = document.createElement('label');
  settingsMenuLabel.innerHTML = 'Settings';

  settingsMenu.appendChild(settingsMenuLabel);

  var showingSettings = false;

  var closeSettingsMenuButton = document.createElement('span');
  closeSettingsMenuButton.id = 'closeSettingsMenuButton';
  closeSettingsMenuButton.setAttribute('class', 'coloredIcon');
  closeSettingsMenuButton.onclick = function() {

    if (!showingSettings) {
      return;
    }

    showingSettings = false;
    settingsMenu.style.display = 'none';

  };

  settingsMenu.appendChild(closeSettingsMenuButton);

  settingsMenu.appendChild(document.createElement('hr'));

  settingsMenu.id = 'settingsMenu';
  settingsMenu.setAttribute('class', 'floatingMenu');
  settingsMenu.style.display = 'none';

  document.body.appendChild(settingsMenu);

  settingsButton.onclick = function() {

    if (showingSettings) {
      return;
    }

    showingSettings = true;
    settingsMenu.style.display = 'block';

  }

  setDraggable(settingsMenu, settingsMenuLabel);
}