var shownMenu;

var postHideContent = '<label class="hidePostButton">Hide post</label>';
var threadHideContent = '<label class="hidePostButton">Hide OP</label><hr>';
threadHideContent += '<label class="hideThreadButton">Hide thread</label>';

function registerHiding(board, thread, post, unhiding) {

  var storedData = localStorage.hidingData;

  var hidingData = storedData ? JSON.parse(storedData) : {};

  var boardData = hidingData[board] || {
    threads : [],
    posts : []
  };

  var listToUse = post ? boardData.posts : boardData.threads;

  if (!unhiding) {
    if (listToUse.indexOf(post || thread) < 0) {
      listToUse.push(post || thread);
    }
  } else {
    listToUse.splice(listToUse.indexOf(post || thread), 1);
  }

  hidingData[board] = boardData;

  localStorage.hidingData = JSON.stringify(hidingData);

}

function setHideMenu(checkbox) {

  var name = checkbox.name;

  var parts = name.split('-');

  var board = parts[0];

  var thread = parts[1];

  var post = parts[2];

  var hideButton = document.createElement('span');
  hideButton.className = 'hideButton';
  hideButton.title = "Hide";

  checkbox.parentNode.insertBefore(hideButton, checkbox.nextSibling);

  var hideMenu = document.createElement('div');
  hideMenu.className = 'hideMenu';
  hideMenu.style.display = 'none';
  hideMenu.style.position = 'absolute';

  var menuHTML = post ? postHideContent : threadHideContent;

  hideMenu.innerHTML = menuHTML;

  document.body.appendChild(hideMenu);

  hideButton.onclick = function() {

    var rect = hideButton.getBoundingClientRect();

    var previewOrigin = {
      x : rect.right + 10 + window.scrollX,
      y : rect.top + window.scrollY
    };

    hideMenu.style.left = previewOrigin.x + 'px';
    hideMenu.style.top = previewOrigin.y + 'px';
    hideMenu.style.display = 'inline';

    shownMenu = hideMenu;
  };

  var unhidePostButton = document.createElement('span');

  var unhideHTML = '[Unhide ' + (post ? 'post' : 'OP') + ' ' + board + '/'
      + (post || thread) + ']';

  unhidePostButton.innerHTML = unhideHTML;
  unhidePostButton.className = 'unhideButton';
  unhidePostButton.style.display = 'none';
  checkbox.parentNode.parentNode.parentNode.insertBefore(unhidePostButton,
      checkbox.parentNode.parentNode);

  unhidePostButton.onclick = function() {

    registerHiding(board, thread, post || thread, true);

    checkbox.parentNode.parentNode.style.display = post ? 'inline-block'
        : 'inline';
    unhidePostButton.style.display = 'none';

  };

  var postHideButton = hideMenu.getElementsByClassName('hidePostButton')[0];

  postHideButton.onclick = function() {
    checkbox.parentNode.parentNode.style.display = 'none';
    unhidePostButton.style.display = 'inline';

    registerHiding(board, thread, post || thread);
  };

  if (!post) {
    var threadHideButton = hideMenu.getElementsByClassName('hideThreadButton')[0];

    var unhideThreadButton = document.createElement('span');

    unhideThreadButton.innerHTML = '[Unhide thread ' + board + '/' + thread
        + ']';
    unhideThreadButton.className = 'unhideButton';
    unhideThreadButton.style.display = 'none';
    checkbox.parentNode.parentNode.parentNode.parentNode.insertBefore(
        unhideThreadButton, checkbox.parentNode.parentNode.parentNode);

    threadHideButton.onclick = function() {
      checkbox.parentNode.parentNode.parentNode.style.display = 'none';
      unhideThreadButton.style.display = 'inline';

      registerHiding(board, thread);
    }

    unhideThreadButton.onclick = function() {
      checkbox.parentNode.parentNode.parentNode.style.display = 'block';
      unhideThreadButton.style.display = 'none';
      registerHiding(board, thread, null, true);
    }

  }

  var storedHidingData = localStorage.hidingData;

  if (!storedHidingData) {
    return;
  }

  storedHidingData = JSON.parse(storedHidingData);

  var boardData = storedHidingData[board];

  if (!boardData) {
    return;
  }

  if (boardData.posts.indexOf(post || thread) > -1) {
    postHideButton.onclick();
  }

  if (!post && boardData.threads.indexOf(thread) > -1) {
    threadHideButton.onclick();
  }

}

if (!DISABLE_JS) {

  document.body.addEventListener('click', function clicked() {

    if (shownMenu) {
      shownMenu.style.display = 'none';
      shownMenu = null;
    }

  }, true);

  var checkboxes = document.getElementsByClassName('deletionCheckBox');

  for (var i = 0; i < checkboxes.length; i++) {
    setHideMenu(checkboxes[i]);
  }

}