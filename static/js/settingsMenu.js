var settingsMenu;
var settingsDragInfo = {}

function stopMovingSettings() {

  if (!settingsDragInfo.shouldMove) {
    return;
  }

  settingsDragInfo.shouldMove = false
  lockedDrag = false

  var body = document.getElementsByTagName('body')[0];

  body.onmouseup = settingsDragInfo.originalMouseUp;
}

function startMovingSettings(evt) {

  if (settingsDragInfo.shouldMove || (typeof (lockedDrag) != 'undefined')
      && lockedDrag) {
    return;
  }

  evt.preventDefault();

  lockedDrag = true;

  var body = document.getElementsByTagName('body')[0];

  settingsDragInfo.originalMouseUp = body.onmouseup;

  body.onmouseup = function() {
    stopMovingSettings();
  };

  settingsDragInfo.shouldMove = true;

  evt = evt || window.event;

  var rect = settingsMenu.getBoundingClientRect();

  settingsDragInfo.diffX = evt.clientX - rect.right;
  settingsDragInfo.diffY = evt.clientY - rect.top;

}

var moveSettings = function(evt) {

  if (!settingsDragInfo.shouldMove) {
    return;
  }

  evt = evt || window.event;

  var newX = (window.innerWidth - evt.clientX) + settingsDragInfo.diffX;
  var newY = evt.clientY - settingsDragInfo.diffY;

  if (newX < 0) {
    newX = 0;
  }

  if (newY < 0) {
    newY = 0;
  }

  var upperXLimit = document.body.clientWidth - settingsMenu.offsetWidth;

  if (newX > upperXLimit) {
    newX = upperXLimit;
  }

  var upperYLimit = window.innerHeight - settingsMenu.offsetHeight;

  if (newY > upperYLimit) {
    newY = upperYLimit;
  }

  settingsMenu.style.right = newX + 'px';
  settingsMenu.style.top = newY + 'px';

};

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

  settingsMenu = document.createElement('div');

  var settingsMenuLabel = document.createElement('label');
  settingsMenuLabel.innerHTML = 'Settings';

  settingsMenuLabel.onmousedown = function(event) {
    startMovingSettings(event);
  };

  settingsMenu.appendChild(settingsMenuLabel);

  var showingSettings = false;

  var closeSettingsMenuButton = document.createElement('span');
  closeSettingsMenuButton.id = 'closeSettingsMenuButton';
  closeSettingsMenuButton.setAttribute('class', 'coloredIcon');
  closeSettingsMenuButton.onclick = function() {

    if (!showingSettings) {
      return;
    }

    var body = document.getElementsByTagName('body')[0];
    body.removeEventListener('mousemove', moveSettings);

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

    var body = document.getElementsByTagName('body')[0];

    body.addEventListener('mousemove', moveSettings);

    showingSettings = true;

    settingsMenu.style.display = 'block';

  }
}