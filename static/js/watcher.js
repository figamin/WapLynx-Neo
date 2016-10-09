var watchedMenu;

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

  watchedMenu = document.createElement('div');

  var watchedMenuLabel = document.createElement('span');
  watchedMenuLabel.innerHTML = 'Watched threads';
  watchedMenuLabel.setAttribute('class', 'watchedMenuLabel');

  watchedMenu.appendChild(watchedMenuLabel);

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

  var storedWatchedData = localStorage.watchedData;

  if (storedWatchedData) {
    storedWatchedData = JSON.parse(storedWatchedData);

    for ( var board in storedWatchedData) {

      if (storedWatchedData.hasOwnProperty(board)) {

        var threads = storedWatchedData[board];

        for ( var thread in threads) {
          if (threads.hasOwnProperty(thread)) {
            addWatchedCell(board, thread, threads[thread]);
          }
        }
      }

    }
  }

}

function addWatchedCell(board, thread, watchData) {

  var cellWrapper = document.createElement('div');

  var cell = document.createElement('div');
  cell.setAttribute('class', 'watchedCell');

  var label = document.createElement('span');
  label.setAttribute('class', 'watchedCellLabel watchedMenuLabel');
  label.innerHTML = board + '/' + thread;
  cell.appendChild(label);

  var button = document.createElement('span');
  button.setAttribute('class', 'watchedCellCloseButton');
  cell.appendChild(button);

  button.onclick = function() {

    watchedMenu.removeChild(cellWrapper);

    var storedWatchedData = localStorage.watchedData;

    if (!storedWatchedData) {
      return;
    }

    storedWatchedData = JSON.parse(storedWatchedData);

    var boardThreads = storedWatchedData[board];

    if (!boardThreads || !boardThreads[thread]) {
      return;
    }

    delete boardThreads[thread];

    localStorage.watchedData = JSON.stringify(storedWatchedData);

  }

  cellWrapper.appendChild(cell);
  cellWrapper.appendChild(document.createElement('hr'));
  watchedMenu.appendChild(cellWrapper);

}

function processOP(op) {

  var checkBox = op.getElementsByClassName('deletionCheckBox')[0];

  var nameParts = checkBox.name.split('-');

  var board = nameParts[0];
  var thread = nameParts[1];

  var watchButton = document.createElement('span');
  watchButton.setAttribute('class', 'watchButton');

  checkBox.parentNode.insertBefore(watchButton,
      checkBox.nextSibling.nextSibling);

  watchButton.onclick = function() {

    var storedWatchedData = localStorage.watchedData;

    if (storedWatchedData) {
      storedWatchedData = JSON.parse(storedWatchedData);
    } else {
      storedWatchedData = {};
    }

    var boardThreads = storedWatchedData[board] || {};

    if (boardThreads[thread]) {
      return;
    }

    boardThreads[thread] = {
      lastSeen : new Date()
    };

    storedWatchedData[board] = boardThreads;

    localStorage.watchedData = JSON.stringify(storedWatchedData);

    addWatchedCell(board, thread, boardThreads[thread]);

  };

}
