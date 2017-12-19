var watchedMenu;

var isInThread = document.getElementById('threadIdentifier') ? true : false;
var watcherAlertCounter = 0;
var elementRelation = {};

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

  var watcherButton = document.createElement('a');
  watcherButton.innerHTML = 'watched threads';
  watcherButton.id = 'watcherButton';
  watcherButton.className = 'coloredIcon';

  var watcherCounter = document.createElement('span');

  watcherButton.appendChild(watcherCounter);

  postingLink.parentNode.insertBefore(watcherButton, referenceNode);

  watchedMenu = document.createElement('div');

  var watchedMenuLabel = document.createElement('label');
  watchedMenuLabel.innerHTML = 'Watched threads';

  watchedMenu.appendChild(watchedMenuLabel);

  var showingWatched = false;

  var closeWatcherMenuButton = document.createElement('span');
  closeWatcherMenuButton.id = 'closeWatcherMenuButton';
  closeWatcherMenuButton.className = 'coloredIcon glowOnHover';
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
  watchedMenu.className = 'floatingMenu';
  watchedMenu.style.display = 'none';

  document.body.appendChild(watchedMenu);

  watcherButton.onclick = function() {

    if (showingWatched) {
      return;
    }

    showingWatched = true;
    watchedMenu.style.display = 'block';

  }

  var ops = document.getElementsByClassName('innerOP');

  for (var i = 0; i < ops.length; i++) {
    processOP(ops[i]);
  }

  var storedWatchedData = getStoredWatchedData();

  for ( var currentBoard in storedWatchedData) {

    if (storedWatchedData.hasOwnProperty(currentBoard)) {

      var threads = storedWatchedData[currentBoard];

      for ( var thread in threads) {
        if (threads.hasOwnProperty(thread)) {

          if (isInThread && currentBoard == boardUri && thread == threadId) {
            threads[thread].lastSeen = new Date().getTime();
            localStorage.watchedData = JSON.stringify(storedWatchedData);
          }

          addWatchedCell(currentBoard, thread, threads[thread]);
        }
      }
    }

  }

  updateWatcherCounter();

  scheduleWatchedThreadsCheck();

  setDraggable(watchedMenu, watchedMenuLabel);

}

function updateWatcherCounter() {
  watcherCounter.innerHTML = watcherAlertCounter ? '(' + watcherAlertCounter
      + ')' : '';
}

function getStoredWatchedData() {

  var storedWatchedData = localStorage.watchedData;

  if (storedWatchedData) {
    storedWatchedData = JSON.parse(storedWatchedData);
  } else {
    storedWatchedData = {};
  }

  return storedWatchedData;

}

function iterateWatchedThreads(urls, index) {

  index = index || 0;

  if (index >= urls.length) {
    updateWatcherCounter();
    scheduleWatchedThreadsCheck();
    return;
  }

  var url = urls[index];

  localRequest('/' + url.board + '/res/' + url.thread + '.json',
      function gotThreadInfo(error, data) {

        if (error) {
          iterateWatchedThreads(urls, ++index);
          return;
        }

        data = JSON.parse(data);

        var posts = data.posts;

        if (posts && posts.length) {

          var lastPost = posts[posts.length - 1];

          var parsedCreation = new Date(lastPost.creation);

          var storedWatchedData = getStoredWatchedData();

          var watchData = storedWatchedData[url.board][url.thread];

          if (parsedCreation.getTime() > watchData.lastReplied) {
            watchData.lastReplied = parsedCreation.getTime();
            localStorage.watchedData = JSON.stringify(storedWatchedData);
          }

          if (!elementRelation[url.board]
              || !elementRelation[url.board][url.thread]) {
            addWatchedCell(url.board, url.thread, watchData);
          } else if (watchData.lastSeen >= watchData.lastReplied) {
            elementRelation[url.board][url.thread].style.display = 'none';
          } else {
            watcherAlertCounter++;
            elementRelation[url.board][url.thread].style.display = 'inline';
          }

        }

        iterateWatchedThreads(urls, ++index);

      });

}

function runWatchedThreadsCheck() {

  watcherAlertCounter = 0;

  localStorage.lastWatchCheck = new Date().getTime();

  var urls = [];

  var storedWatchedData = getStoredWatchedData();

  for ( var board in storedWatchedData) {

    if (storedWatchedData.hasOwnProperty(board)) {

      var threads = storedWatchedData[board];

      for ( var thread in threads) {
        if (threads.hasOwnProperty(thread)) {

          if (isInThread && board == boardUri && thread == threadId) {
            threads[thread].lastSeen = new Date().getTime();
            localStorage.watchedData = JSON.stringify(storedWatchedData);
          }

          urls.push({
            board : board,
            thread : thread
          });
        }
      }
    }

  }

  iterateWatchedThreads(urls);
}

function scheduleWatchedThreadsCheck() {

  var lastCheck = localStorage.lastWatchCheck;

  if (!lastCheck) {
    runWatchedThreadsCheck();
    return;
  }

  lastCheck = new Date(+lastCheck);

  lastCheck.setUTCMinutes(lastCheck.getUTCMinutes() + 5);

  setTimeout(function() {
    runWatchedThreadsCheck();
  }, lastCheck.getTime() - new Date().getTime());

}

function addWatchedCell(board, thread, watchData) {

  var cellWrapper = document.createElement('div');

  var cell = document.createElement('div');
  cell.className = 'watchedCell';

  var labelWrapper = document.createElement('label');
  labelWrapper.className = 'watchedCellLabel';

  var label = document.createElement('a');
  label.innerHTML = watchData.label || (board + '/' + thread);
  label.href = '/' + board + '/res/' + thread + '.html';
  labelWrapper.appendChild(label);

  var notification = document.createElement('span');
  notification.className = 'watchedNotification';

  if (!elementRelation[board]) {
    elementRelation[board] = {};
  }

  elementRelation[board][thread] = notification;

  if (watchData.lastSeen >= watchData.lastReplied) {
    notification.style.display = 'none';
  } else {
    watcherAlertCounter++;
  }

  labelWrapper.appendChild(notification);

  cell.appendChild(labelWrapper);

  var button = document.createElement('span');
  button.className = 'watchedCellCloseButton glowOnHover coloredIcon';
  cell.appendChild(button);

  button.onclick = function() {

    watchedMenu.removeChild(cellWrapper);

    var storedWatchedData = getStoredWatchedData();

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
  watchButton.className = 'watchButton glowOnHover coloredIcon';
  watchButton.title = "Watch Thread";

  checkBox.parentNode.insertBefore(watchButton,
      checkBox.nextSibling.nextSibling);

  watchButton.onclick = function() {

    var storedWatchedData = getStoredWatchedData();

    var boardThreads = storedWatchedData[board] || {};

    if (boardThreads[thread]) {
      return;
    }

    var subject = op.getElementsByClassName('labelSubject');
    var message = op.getElementsByClassName('divMessage')[0];

    var label = (subject.length ? subject[0].innerHTML : null)
        || message.innerHTML.substr(0, 16).trim();

    if (!label.length) {
      label = null;
    }

    boardThreads[thread] = {
      lastSeen : new Date().getTime(),
      lastReplied : new Date().getTime(),
      label : label
    };

    storedWatchedData[board] = boardThreads;

    localStorage.watchedData = JSON.stringify(storedWatchedData);

    addWatchedCell(board, thread, boardThreads[thread]);

  };

}
