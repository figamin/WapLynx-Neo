if (!DISABLE_JS) {

  var postingLink = document.getElementById('navPosting');

  var divider = document.createElement('span');
  divider.innerHTML = '/';

  var referenceNode = postingLink.nextSibling;

  postingLink.parentNode.insertBefore(divider, referenceNode);

  var watcherButton = document.createElement('span');
  watcherButton.innerHTML = 'watched threads';
  watcherButton.id = 'watcherButton';
  watcherButton.setAttribute('class', 'navClickable');

  postingLink.parentNode.insertBefore(watcherButton, referenceNode);

  var watchedMenu = document.createElement('div');
  watchedMenu.innerHTML = 'Watched threads';

  var showingWatched = false;

  var closeWatcherMenuButton = document.createElement('span');
  closeWatcherMenuButton.id = 'closeWatcherMenuButton';
  closeWatcherMenuButton.onclick = function() {
    if (!showingWatched) {
      return;
    }

    showingWatched = false;
    watchedMenu.style.display = 'none';

  };

  watchedMenu.appendChild(closeWatcherMenuButton);

  watchedMenu.appendChild(document.createElement('hr'));

  watchedMenu.id = 'watchedMenu';
  watchedMenu.style.display = 'none';
  watchedMenu.style.position = 'absolute';

  document.body.appendChild(watchedMenu);

  watcherButton.onclick = function() {

    if (showingWatched) {
      return;
    }

    showingWatched = true;
    var rect = watcherButton.getBoundingClientRect();

    var previewOrigin = {
      x : rect.right + 10 + window.scrollX,
      y : rect.top + window.scrollY
    };

    watchedMenu.style.left = previewOrigin.x + 'px';
    watchedMenu.style.top = previewOrigin.y + 'px';
    watchedMenu.style.display = 'inline';

  }

  document.addEventListener('scroll', function() {
    closeWatcherMenuButton.onclick();
  });

  var ops = document.getElementsByClassName('opHead');

  for (var i = 0; i < ops.length; i++) {
    processOP(ops[i]);
  }

}

function processOP(op) {

  // TODO
  return;

  var checkBox = op.getElementsByClassName('deletionCheckBox')[0];

  var nameParts = checkBox.name.split('-');

  var board = nameParts[0];
  var thread = nameParts[1];

  var watchButton = document.createElement('span');

  watchButton.setAttribute('class', 'watchButton');

}
