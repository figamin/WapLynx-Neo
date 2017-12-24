var shownMenu;
var filtered = [];

function filterMatches(string, filter) {

  var toRet;

  if (!filter.regex) {
    toRet = string.indexOf(filter.filter) >= 0;
  } else {
    toRet = string.match(new RegExp(filter.filter)) ? true : false;
  }

  return toRet;

}

function hideForFilter(checkbox) {

  var toHide = checkbox.parentNode.parentNode.parentNode;

  toHide.style.display = 'none';
  filtered.push(toHide);

  return true;
}

function checkFilters() {

  for (var i = 0; i < filtered.length; i++) {
    filtered[i].style.display = 'block';
  }

  filtered = [];

  var checkboxes = document.getElementsByClassName('deletionCheckBox');

  for (var i = 0; i < checkboxes.length; i++) {
    checkFilterHiding(checkboxes[i]);
  }

}

function checkFilterHiding(checkbox) {

  for (var i = 0; i < loadedFilters.length; i++) {

    var filter = loadedFilters[i];

    if (filter.type < 2) {
      var name = checkbox.parentNode.getElementsByClassName('linkName')[0].innerHTML;

      if (name.indexOf('#') >= 0) {

        var trip = name.substring(name.lastIndexOf('#') + 1);

        name = name.substring(0, name.indexOf('#'));

      }

    }

    switch (filter.type) {

    case 0: {
      if (filterMatches(name, filter)) {
        return hideForFilter(checkbox);
      }
      break;
    }

    case 1: {
      if (trip && filterMatches(trip, filter)) {
        return hideForFilter(checkbox);
      }
      break;
    }

    case 2: {
      var subjectLabel = checkbox.parentNode
          .getElementsByClassName('labelSubject')[0];

      if (subjectLabel && filterMatches(subjectLabel.innerHTML, filter)) {
        return hideForFilter(checkbox);
      }
      break;
    }

    case 3: {
      if (filterMatches(checkbox.parentNode.parentNode
          .getElementsByClassName('divMessage')[0].innerHTML, filter)) {
        return hideForFilter(checkbox);
      }
      break;
    }

    }

  }

}

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
  hideButton.className = 'hideButton glowOnHover coloredIcon';
  hideButton.title = "Hide";

  checkbox.parentNode.insertBefore(hideButton, checkbox.nextSibling);

  var hideMenu = document.createElement('div');
  hideMenu.className = 'floatingMenu hideMenu';
  hideMenu.style.display = 'none';
  hideMenu.style.position = 'absolute';

  var postHideButton;
  postHideButton = document.createElement('label');

  if (post) {

    postHideButton.innerHTML = 'Hide post';
    hideMenu.appendChild(postHideButton);

  } else {

    postHideButton.innerHTML = 'Hide OP';
    hideMenu.appendChild(postHideButton);

    hideMenu.appendChild(document.createElement('hr'));

    var threadHideButton = document.createElement('label');
    threadHideButton.innerHTML = 'Hide thread';
    hideMenu.appendChild(threadHideButton);

  }

  hideMenu.appendChild(document.createElement('hr'));

  var name = checkbox.parentNode.getElementsByClassName('linkName')[0].innerHTML;

  var trip;

  if (name.indexOf('#') >= 0) {
    trip = name.substring(name.lastIndexOf('#') + 1);
    name = name.substring(0, name.indexOf('#'));
  }

  var filterNameButton = document.createElement('label');
  filterNameButton.innerHTML = 'Filter name';
  filterNameButton.onclick = function() {
    createFilter(name, false, 0);
  };
  hideMenu.appendChild(filterNameButton);

  hideMenu.appendChild(document.createElement('hr'));

  if (trip) {

    var filterTripButton = document.createElement('label');
    filterTripButton.innerHTML = 'Filter tripcode';
    filterTripButton.onclick = function() {
      createFilter(trip, false, 1);
    };
    hideMenu.appendChild(filterTripButton);

    hideMenu.appendChild(document.createElement('hr'));
  }

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
  unhidePostButton.className = 'unhideButton glowOnHover';
  unhidePostButton.style.display = 'none';
  checkbox.parentNode.parentNode.parentNode.insertBefore(unhidePostButton,
      checkbox.parentNode.parentNode);

  unhidePostButton.onclick = function() {

    registerHiding(board, thread, post || thread, true);

    checkbox.parentNode.parentNode.style.display = post ? 'inline-block'
        : 'inline';
    unhidePostButton.style.display = 'none';

  };

  postHideButton.onclick = function() {
    checkbox.parentNode.parentNode.style.display = 'none';
    unhidePostButton.style.display = 'inline';

    registerHiding(board, thread, post || thread);
  };

  if (!post) {

    var unhideThreadButton = document.createElement('span');

    unhideThreadButton.innerHTML = '[Unhide thread ' + board + '/' + thread
        + ']';
    unhideThreadButton.className = 'unhideButton glowOnHover';
    unhideThreadButton.style.display = 'none';
    checkbox.parentNode.parentNode.parentNode.parentNode.insertBefore(
        unhideThreadButton, checkbox.parentNode.parentNode.parentNode);

    threadHideButton.onclick = function() {
      checkbox.parentNode.parentNode.parentNode.style.display = 'none';
      unhideThreadButton.style.display = 'block';

      registerHiding(board, thread);
    }

    unhideThreadButton.onclick = function() {
      checkbox.parentNode.parentNode.parentNode.style.display = 'block';
      unhideThreadButton.style.display = 'none';
      registerHiding(board, thread, null, true);
    }

  }

  checkFilterHiding(checkbox);

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