var hiding = {};

hiding.init = function() {

  hiding.updateHidingData();

  hiding.filtered = [];

  document.body.addEventListener('click', function clicked() {

    if (hiding.shownMenu) {
      hiding.shownMenu.remove();
      delete hiding.shownMenu;
    }

  }, true);

  var links = document.getElementsByClassName('linkSelf');

  for (var i = 0; i < links.length; i++) {
    hiding.setHideMenu(links[i]);
  }

};

hiding.updateHidingData = function() {

  var storedHidingData = localStorage.hidingData;

  if (!storedHidingData) {
    hiding.storedHidingData = {};
    return;
  }

  hiding.storedHidingData = JSON.parse(storedHidingData);

};

hiding.filterMatches = function(string, filter) {

  var toRet;

  if (!filter.regex) {
    toRet = string.indexOf(filter.filter) >= 0;
  } else {
    toRet = string.match(new RegExp(filter.filter)) ? true : false;
  }

  return toRet;

};

hiding.hideForFilter = function(linkSelf) {

  var toHide = linkSelf.parentNode.parentNode.parentNode;

  toHide.style.display = 'none';
  hiding.filtered.push(toHide);

  return true;

};

hiding.checkFilters = function() {

  for (var i = 0; i < hiding.filtered.length; i++) {
    hiding.filtered[i].style.display = 'block';
  }

  hiding.filtered = [];

  var links = document.getElementsByClassName('linkSelf');

  for (var i = 0; i < links.length; i++) {
    hiding.checkFilterHiding(links[i]);
  }

};

hiding.checkFilterHiding = function(linkSelf) {

  for (var i = 0; i < settingsMenu.loadedFilters.length; i++) {

    var filter = settingsMenu.loadedFilters[i];

    if (filter.type < 2) {
      var name = linkSelf.parentNode.getElementsByClassName('linkName')[0].innerHTML;

      if (name.indexOf('#') >= 0) {

        var trip = name.substring(name.lastIndexOf('#') + 1);

        name = name.substring(0, name.indexOf('#'));

      }

    }

    switch (filter.type) {

    case 0: {
      if (hiding.filterMatches(name, filter)) {
        return hiding.hideForFilter(linkSelf);
      }
      break;
    }

    case 1: {
      if (trip && hiding.filterMatches(trip, filter)) {
        return hiding.hideForFilter(linkSelf);
      }
      break;
    }

    case 2: {
      var subjectLabel = linkSelf.parentNode
          .getElementsByClassName('labelSubject')[0];

      if (subjectLabel && filterMatches(subjectLabel.innerHTML, filter)) {
        return hiding.hideForFilter(linkSelf);
      }
      break;
    }

    case 3: {
      if (filterMatches(linkSelf.parentNode.parentNode
          .getElementsByClassName('divMessage')[0].innerHTML, filter)) {
        return hiding.hideForFilter(linkSelf);
      }
      break;
    }

    }

  }

};

hiding.registerHiding = function(board, thread, post, unhiding) {

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

  hiding.storedHidingData = hidingData;

};

hiding.buildHideMenu = function(linkSelf, hideMenu) {

  var href = linkSelf.href;

  var parts = href.split('/');

  var board = parts[3];

  var finalParts = parts[5].split('.');

  var thread = finalParts[0];

  var post = finalParts[1].split('#')[1];

  if (post === thread) {
    post = undefined;
  }

  var postHideButton;
  postHideButton = document.createElement('div');

  if (post) {

    postHideButton.innerHTML = 'Hide post';
    hideMenu.appendChild(postHideButton);

  } else {

    postHideButton.innerHTML = 'Hide OP';
    hideMenu.appendChild(postHideButton);

    hideMenu.appendChild(document.createElement('hr'));

    var threadHideButton = document.createElement('div');
    threadHideButton.innerHTML = 'Hide thread';
    hideMenu.appendChild(threadHideButton);

  }

  hideMenu.appendChild(document.createElement('hr'));

  var name = linkSelf.parentNode.getElementsByClassName('linkName')[0].innerHTML;

  var trip;

  if (name.indexOf('#') >= 0) {
    trip = name.substring(name.lastIndexOf('#') + 1);
    name = name.substring(0, name.indexOf('#'));
  }

  var filterNameButton = document.createElement('div');
  filterNameButton.innerHTML = 'Filter name';
  filterNameButton.onclick = function() {
    settingsMenu.createFilter(name, false, 0);
  };
  hideMenu.appendChild(filterNameButton);

  hideMenu.appendChild(document.createElement('hr'));

  if (trip) {

    var filterTripButton = document.createElement('div');
    filterTripButton.innerHTML = 'Filter tripcode';
    filterTripButton.onclick = function() {
      settingsMenu.createFilter(trip, false, 1);
    };
    hideMenu.appendChild(filterTripButton);

    hideMenu.appendChild(document.createElement('hr'));
  }

  var unhidePostButton;

  postHideButton.onclick = function() {

    hiding.toggleHidden(linkSelf.parentNode.parentNode, true);

    hiding.registerHiding(board, thread, post || thread);

    unhidePostButton = document.createElement('span');

    var unhideHTML = '[Unhide ' + (post ? 'post' : 'OP') + ' ' + board + '/'
        + (post || thread) + ']';

    unhidePostButton.innerHTML = unhideHTML;
    unhidePostButton.className = 'unhideButton glowOnHover';

    linkSelf.parentNode.parentNode.parentNode.insertBefore(unhidePostButton,
        linkSelf.parentNode.parentNode);

    unhidePostButton.onclick = function() {

      hiding.registerHiding(board, thread, post || thread, true);
      unhidePostButton.remove();
      hiding.toggleHidden(linkSelf.parentNode.parentNode, false);

    };
  };

  if (!post) {

    var unhideThreadButton;

    threadHideButton.onclick = function() {
      hiding.toggleHidden(linkSelf.parentNode.parentNode.parentNode, true);
      unhideThreadButton = document.createElement('span');

      unhideThreadButton.innerHTML = '[Unhide thread ' + board + '/' + thread
          + ']';
      unhideThreadButton.className = 'unhideButton glowOnHover';
      linkSelf.parentNode.parentNode.parentNode.parentNode.insertBefore(
          unhideThreadButton, linkSelf.parentNode.parentNode.parentNode);

      hiding.registerHiding(board, thread);

      unhideThreadButton.onclick = function() {
        hiding.toggleHidden(linkSelf.parentNode.parentNode.parentNode, false);
        unhideThreadButton.remove();
        hiding.registerHiding(board, thread, null, true);
      }

    }

  }

  hiding.checkFilterHiding(linkSelf);

  var boardData = hiding.storedHidingData[board];

  if (!boardData) {
    return;
  }

  if (boardData.posts.indexOf(post || thread) > -1) {
    postHideButton.onclick();
  }

  if (!post && boardData.threads.indexOf(thread) > -1) {
    threadHideButton.onclick();
  }

};

hiding.toggleHidden = function(element, hide) {

  var className = element.className;

  if (hide) {
    element.className += ' hidden';
  } else {
    element.className = className.replace(' hidden', '');
  }

};

hiding.setHideMenu = function(linkSelf) {

  var hideButton = document.createElement('span');
  hideButton.className = 'hideButton glowOnHover coloredIcon';
  hideButton.title = "Hide";

  var parentNode = linkSelf.parentNode;

  var checkbox = parentNode.getElementsByClassName('deletionCheckBox')[0];

  parentNode.insertBefore(hideButton, checkbox ? checkbox.nextSibling
      : parentNode.childNodes[0]);

  hideButton.onclick = function() {

    var rect = hideButton.getBoundingClientRect();

    var previewOrigin = {
      x : rect.right + 10 + window.scrollX,
      y : rect.top + window.scrollY
    };

    var hideMenu = document.createElement('div');
    hideMenu.className = 'floatingMenu hideMenu';
    hideMenu.style.display = 'none';
    hideMenu.style.position = 'absolute';

    document.body.appendChild(hideMenu);

    hideMenu.style.left = previewOrigin.x + 'px';
    hideMenu.style.top = previewOrigin.y + 'px';
    hideMenu.style.display = 'inline';

    hiding.shownMenu = hideMenu;

    hiding.buildHideMenu(linkSelf, hideMenu);

  };

};

hiding.init();
