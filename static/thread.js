var boardUri;
var threadId;
var board = false;
var replyButton;
var refreshButton;
var lastReplyId = 0;
var lastRefreshWaiting = 0;
var refreshLabel;
var autoRefresh;
var refreshTimer;
var lastRefresh;
var currentRefresh;
var manualRefresh;
var foundPosts;
var hiddenCaptcha = !document.getElementById('captchaDiv');
var markedPosting;
var limitRefreshWait = 10 * 60;
var originalButtonText;

var postCellTemplate = '<div class="innerPost"><input type="checkbox" '
    + 'class="deletionCheckBox"> <span class="labelSubject"></span>'
    + '<a class="linkName"></a> <img class="imgFlag"> '
    + '<span class="labelRole"></span> <span class="labelCreated"></span>'
    + '<span class="spanId"> Id: <span class="labelId"></span></span>'
    + ' <a class="linkPreview">[Preview]</a> <a class="linkSelf">No.</a>'
    + ' <a class="linkQuote"></a> <span class="panelBacklinks"> </span>'
    + '<div class="panelUploads"></div><div class="divMessage" /></div>'
    + '<div class="divBanMessage"></div><div class="labelLastEdit"></div><br></div>';

var uploadCell = '<a class="nameLink" target="blank"></a>'
    + ' ( <span class="sizeLabel"></span> '
    + '<span class="dimensionLabel"></span> '
    + '<a class="originalNameLink"></a> )<br>'
    + '<a class="imgLink" target="blank"></a>';

var sizeOrders = [ 'B', 'KB', 'MB', 'GB', 'TB' ];

var guiEditInfo = 'Edited last time by {$login} on {$date}.';

if (!DISABLE_JS) {

  boardUri = document.getElementById('boardIdentifier').value;
  var divPosts = document.getElementsByClassName('divPosts')[0];

  document.getElementsByClassName('divRefresh')[0].style.display = 'inline';

  refreshLabel = document.getElementById('labelRefresh');

  refreshButton = document.getElementById('refreshButton');

  threadId = document.getElementsByClassName('opCell')[0].id;

  if (document.getElementById('controlThreadIdentifier')) {
    document.getElementById('settingsJsButon').style.display = 'inline';
    document.getElementById('settingsFormButon').style.display = 'none';

    if (document.getElementById('ipDeletionForm')) {
      document.getElementById('deleteFromIpJsButton').style.display = 'inline';

      document.getElementById('deleteFromIpFormButton').style.display = 'none';
    }

    if (document.getElementById('formTransfer')) {
      document.getElementById('transferJsButton').style.display = 'inline';

      document.getElementById('transferFormButton').style.display = 'none';
    }

  }

  var savedPassword = getSavedPassword();

  if (savedPassword && savedPassword.length) {
    document.getElementById('fieldPostingPassword').value = savedPassword;
    document.getElementById('deletionFieldPassword').value = savedPassword;
  }

  replyButton = document.getElementById('jsButton');
  replyButton.style.display = 'inline';
  replyButton.disabled = false;

  if (document.getElementById('captchaDiv')) {
    document.getElementById('reloadCaptchaButton').style.display = 'inline';
  }

  document.getElementById('reloadCaptchaButtonReport').style.display = 'inline';

  document.getElementById('formButton').style.display = 'none';

  var replies = document.getElementsByClassName('postCell');

  if (replies && replies.length) {
    lastReplyId = replies[replies.length - 1].id;
  }

  changeRefresh();

  var hash = window.location.hash.substring(1);

  if (hash.indexOf('q') === 0 && hash.length > 1) {
    document.getElementById('fieldMessage').value = '>>' + hash.substring(1)
        + '\n';
  } else if (hash.length > 1) {
    markPost(hash);
  }

  var postingQuotes = document.getElementsByClassName('linkQuote');

  for (var i = 0; i < postingQuotes.length; i++) {
    processPostingQuote(postingQuotes[i]);
  }

}

function transfer() {

  var informedBoard = document.getElementById("fieldDestinationBoard").value
      .trim();

  var originThread = document.getElementById("transferThreadIdentifier").value;
  var originBoard = document.getElementById("transferBoardIdentifier").value;

  apiRequest('transferThread', {
    boardUri : boardUri,
    threadId : threadId,
    boardUriDestination : informedBoard
  }, function setLock(status, data) {

    if (status === 'ok') {

      alert('Thread moved.');

      var redirect = '/' + informedBoard + '/res/';

      window.location.pathname = redirect + data + '.html';

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function markPost(id) {

  if (isNaN(id)) {
    return;
  }

  if (markedPosting && markedPosting.className === 'markedPost') {
    markedPosting.setAttribute('class', 'innerPost');
  }

  var container = document.getElementById(id);

  if (!container || container.className !== 'postCell') {
    return;
  }

  markedPosting = container.getElementsByClassName('innerPost')[0];

  if (markedPosting) {
    markedPosting.setAttribute('class', 'markedPost');
  }
}

function processPostingQuote(link) {

  link.onclick = function() {
    var toQuote = link.href.match(/#q(\d+)/);

    document.getElementById('fieldMessage').value += '>>' + toQuote[1] + '\n';

  };

}

function reloadCaptcha() {
  document.cookie = 'captchaid=; path=/;';

  if (document.getElementById('captchaDiv')) {
    document.getElementById('captchaImage').src = '/captcha.js#'
        + new Date().toString();
  }

  document.getElementById('captchaImageReport').src = '/captcha.js#'
      + new Date().toString();
}

function saveThreadSettings() {

  apiRequest('changeThreadSettings', {
    boardUri : boardUri,
    threadId : threadId,
    pin : document.getElementById('checkboxPin').checked,
    lock : document.getElementById('checkboxLock').checked,
    cyclic : document.getElementById('checkboxCyclic').checked
  }, function setLock(status, data) {

    if (status === 'ok') {

      alert('Settings saved.');

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

var replyCallback = function(status, data) {

  if (status === 'ok') {
    document.getElementById('fieldMessage').value = '';
    document.getElementById('fieldSubject').value = '';
    document.getElementById('files').type = 'text';
    document.getElementById('files').type = 'file';

    setTimeout(function() {
      refreshPosts();
    }, 2000);
  } else {
    alert(status + ': ' + JSON.stringify(data));
  }
};

replyCallback.stop = function() {
  replyButton.innerHTML = originalButtonText;
  replyButton.disabled = false;

  if (!hiddenCaptcha) {
    reloadCaptcha();
    document.getElementById('fieldCaptcha').value = '';
  }
};

replyCallback.progress = function(info) {

  if (info.lengthComputable) {
    var newText = 'Uploading ' + Math.floor((info.loaded / info.total) * 100)
        + '%';
    replyButton.innerHTML = newText;
  }
};

function padDateField(value) {
  if (value < 10) {
    value = '0' + value;
  }

  return value;
}

function formatDateToDisplay(d) {
  var day = padDateField(d.getUTCDate());

  var weekDays = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

  var month = padDateField(d.getUTCMonth() + 1);

  var year = d.getUTCFullYear();

  var weekDay = weekDays[d.getUTCDay()];

  var hour = padDateField(d.getUTCHours());

  var minute = padDateField(d.getUTCMinutes());

  var second = padDateField(d.getUTCSeconds());

  var toReturn = month + '/' + day + '/' + year;

  return toReturn + ' (' + weekDay + ') ' + hour + ':' + minute + ':' + second;
}

function formatFileSize(size) {

  var orderIndex = 0;

  while (orderIndex < sizeOrders.length - 1 && size > 1024) {

    orderIndex++;
    size /= 1024;

  }

  return size.toFixed(2) + ' ' + sizeOrders[orderIndex];

}

function removeElement(element) {
  element.parentNode.removeChild(element);
}

function setLastEditedLabel(post, cell) {

  var editedLabel = cell.getElementsByClassName('labelLastEdit')[0];

  if (post.lastEditTime) {

    var formatedDate = formatDateToDisplay(new Date(post.lastEditTime));

    editedLabel.innerHTML = guiEditInfo.replace('{$date}', formatedDate)
        .replace('{$login}', post.lastEditLogin);

  } else {
    removeElement(editedLabel);
  }

}

function setUploadLinks(cell, file) {
  var thumbLink = cell.getElementsByClassName('imgLink')[0];
  thumbLink.href = file.path;

  thumbLink.setAttribute('data-filemime', file.mime);

  var img = document.createElement('img');
  img.src = file.thumb;

  thumbLink.appendChild(img);

  var nameLink = cell.getElementsByClassName('nameLink')[0];
  nameLink.href = file.path;
  nameLink.innerHTML = file.name;

  var originalLink = cell.getElementsByClassName('originalNameLink')[0];
  originalLink.innerHTML = file.originalName;
  originalLink.href = file.path + '/alias/' + file.originalName;
}

function getUploadCellBase() {
  var cell = document.createElement('div');
  cell.innerHTML = uploadCell;
  cell.setAttribute('class', 'uploadCell');

  return cell;
}

function setUploadCell(node, files) {

  if (!files) {
    return;
  }

  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    var cell = getUploadCellBase();

    setUploadLinks(cell, file);

    var sizeString = formatFileSize(file.size);
    cell.getElementsByClassName('sizeLabel')[0].innerHTML = sizeString;

    var dimensionLabel = cell.getElementsByClassName('dimensionLabel')[0];

    if (file.width) {
      dimensionLabel.innerHTML = file.width + 'x' + file.height;
    } else {
      removeElement(dimensionLabel);
    }

    node.appendChild(cell);
  }

}

function setPostHideableElements(postCell, post) {
  var subjectLabel = postCell.getElementsByClassName('labelSubject')[0];
  if (post.subject) {
    subjectLabel.innerHTML = post.subject;
  } else {
    removeElement(subjectLabel);
  }

  if (post.id) {
    postCell.getElementsByClassName('labelId')[0].innerHTML = post.id;
  } else {
    var spanId = postCell.getElementsByClassName('spanId')[0];
    spanId.parentNode.removeChild(spanId);
  }

  var banMessageLabel = postCell.getElementsByClassName('divBanMessage')[0];

  if (!post.banMessage) {
    banMessageLabel.parentNode.removeChild(banMessageLabel);
  } else {
    banMessageLabel.innerHTML = post.banMessage;
  }

  setLastEditedLabel(post, postCell);

  var imgFlag = postCell.getElementsByClassName('imgFlag')[0];

  if (post.flag) {
    imgFlag.src = post.flag;
    imgFlag.title = post.flagName;
  } else {
    removeElement(imgFlag);
  }

}

function setPostLinks(postCell, post, boardUri, link, threadId, linkQuote,
    deletionCheckbox) {
  var linkStart = '/' + boardUri + '/res/' + threadId + '.html#';
  link.href = linkStart + post.postId;
  linkQuote.href = linkStart + 'q' + post.postId;

  var checkboxName = boardUri + '-' + threadId + '-' + post.postId;
  deletionCheckbox.setAttribute('name', checkboxName);

  var linkPreview = '/' + boardUri + '/preview/' + post.postId + '.html';

  postCell.getElementsByClassName('linkPreview')[0].href = linkPreview;
}

function setRoleSignature(postingCell, posting) {
  var labelRole = postingCell.getElementsByClassName('labelRole')[0];

  if (posting.signedRole) {
    labelRole.innerHTML = posting.signedRole;
  } else {
    labelRole.parentNode.removeChild(labelRole);
  }
}

function setPostComplexElements(postCell, post, boardUri, threadId) {

  setRoleSignature(postCell, post);

  var link = postCell.getElementsByClassName('linkSelf')[0];

  var linkQuote = postCell.getElementsByClassName('linkQuote')[0];
  linkQuote.innerHTML = post.postId;

  var deletionCheckbox = postCell.getElementsByClassName('deletionCheckBox')[0];

  setPostLinks(postCell, post, boardUri, link, threadId, linkQuote,
      deletionCheckbox);

  setUploadCell(postCell.getElementsByClassName('panelUploads')[0], post.files);
}

function setPostInnerElements(boardUri, threadId, post, postCell) {

  var linkName = postCell.getElementsByClassName('linkName')[0];

  linkName.innerHTML = post.name;

  if (post.email) {
    linkName.href = 'mailto:' + post.email;
  } else {
    linkName.className += ' noEmailName';
  }

  var labelCreated = postCell.getElementsByClassName('labelCreated')[0];

  labelCreated.innerHTML = formatDateToDisplay(new Date(post.creation));

  postCell.getElementsByClassName('divMessage')[0].innerHTML = post.markdown;

  setPostHideableElements(postCell, post);

  setPostComplexElements(postCell, post, boardUri, threadId);
}

function addPost(post) {

  var postCell = document.createElement('div');
  postCell.innerHTML = postCellTemplate;

  postCell.id = post.postId;
  postCell.setAttribute('class', 'postCell');

  if (post.files && post.files.length > 1) {
    postCell.className += ' multipleUploads';
  }

  setPostInnerElements(boardUri, threadId, post, postCell);

  var links = postCell.getElementsByClassName('imgLink');

  var fuckYou = [];

  for (var i = 0; i < links.length; i++) {
    fuckYou.push(links[i]);
  }

  for (var i = 0; i < fuckYou.length; i++) {

    processImageLink(fuckYou[i]);
  }

  divPosts.appendChild(postCell);

  postCell.setAttribute('data-boarduri', boardUri);

  addToKnownPostsForBackLinks(postCell);

  var quotes = postCell.getElementsByClassName('quoteLink');

  for (var i = 0; i < quotes.length; i++) {
    var quote = quotes[i];

    processQuote(quote);
  }

  processPostingQuote(postCell.getElementsByClassName('linkQuote')[0]);

}

var refreshCallback = function(error, data) {

  if (error) {
    return;
  }

  var receivedData = JSON.parse(data);

  var posts = receivedData.posts;

  foundPosts = false;

  if (posts && posts.length) {
    var lastPost = posts[posts.length - 1];

    if (lastPost.postId > lastReplyId) {
      foundPosts = true;

      for (var i = 0; i < posts.length; i++) {

        var post = posts[i];

        if (post.postId > lastReplyId) {
          addPost(post);
          lastReplyId = post.postId;
        }

      }
    }
  }

  if (autoRefresh) {
    startTimer(manualRefresh || foundPosts ? 5 : lastRefresh * 2);
  }

};

refreshCallback.stop = function() {
  refreshButton.style.display = 'inline';

};

function refreshPosts(manual) {

  manualRefresh = manual;

  if (autoRefresh) {
    clearInterval(refreshTimer);
  }

  refreshButton.style.display = 'none';

  localRequest('/' + boardUri + '/res/' + threadId + '.json', refreshCallback);

}

function sendReplyData(files, captchaId) {

  var forcedAnon = !document.getElementById('fieldName');
  var hiddenFlags = !document.getElementById('flagsDiv');

  if (!hiddenFlags) {
    var combo = document.getElementById('flagCombobox');

    var selectedFlag = combo.options[combo.selectedIndex].value;
  }

  if (!forcedAnon) {
    var typedName = document.getElementById('fieldName').value.trim();
  }

  var typedEmail = document.getElementById('fieldEmail').value.trim();
  var typedMessage = document.getElementById('fieldMessage').value.trim();
  var typedSubject = document.getElementById('fieldSubject').value.trim();
  var typedPassword = document.getElementById('fieldPostingPassword').value
      .trim();

  var threadId = document.getElementById('threadIdentifier').value;

  if (!typedMessage.length && !files.length) {
    alert('A message or a file is mandatory.');
    return;
  } else if (!forcedAnon && typedName.length > 32) {
    alert('Name is too long, keep it under 32 characters.');
    return;
  } else if (typedMessage.length > 2048) {
    alert('Message is too long, keep it under 2048 characters.');
    return;
  } else if (typedEmail.length > 64) {
    alert('E-mail is too long, keep it under 64 characters.');
    return;
  } else if (typedSubject.length > 128) {
    alert('Subject is too long, keep it under 128 characters.');
    return;
  } else if (typedPassword.length > 8) {
    alert('Password is too long, keep it under 8 characters.');
    return;
  }

  if (typedPassword.length) {
    savePassword(typedPassword);
  }

  originalButtonText = replyButton.innerHTML;
  replyButton.innerHTML = 'Uploading 0%';
  replyButton.disabled = true;

  apiRequest('replyThread', {
    name : forcedAnon ? null : typedName,
    flag : hiddenFlags ? null : selectedFlag,
    captcha : captchaId,
    subject : typedSubject,
    spoiler : document.getElementById('checkboxSpoiler').checked,
    password : typedPassword,
    message : typedMessage,
    email : typedEmail,
    files : files,
    boardUri : boardUri,
    threadId : threadId
  }, replyCallback);

}

function iterateSelectedFiles(currentIndex, files, fileChooser, captchaId) {

  if (currentIndex < fileChooser.files.length) {
    var reader = new FileReader();

    reader.onloadend = function(e) {

      files.push({
        name : fileChooser.files[currentIndex].name,
        content : reader.result
      });

      iterateSelectedFiles(currentIndex + 1, files, fileChooser, captchaId);

    };

    reader.readAsDataURL(fileChooser.files[currentIndex]);
  } else {
    sendReplyData(files, captchaId);
  }

}

function processFilesToPost(captchaId) {
  iterateSelectedFiles(0, [], document.getElementById('files'), captchaId);
}

function postReply() {

  if (hiddenCaptcha) {
    processFilesToPost();
  } else {
    var typedCaptcha = document.getElementById('fieldCaptcha').value.trim();

    if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
      alert('Captchas are exactly 6 (24 if no cookies) characters long.');
      return;
    } else if (/\W/.test(typedCaptcha)) {
      alert('Invalid captcha.');
      return;
    }

    var parsedCookies = getCookies();

    apiRequest('solveCaptcha', {

      captchaId : parsedCookies.captchaid,
      answer : typedCaptcha
    }, function solvedCaptcha(status, data) {

      processFilesToPost(parsedCookies.captchaid);

    });

  }

}

function startTimer(time) {

  if (time > limitRefreshWait) {
    time = limitRefreshWait;
  }

  currentRefresh = time;
  lastRefresh = time;
  labelRefresh.innerHTML = currentRefresh;
  refreshTimer = setInterval(function checkTimer() {
    currentRefresh--;

    if (!currentRefresh) {
      clearInterval(refreshTimer);
      refreshPosts();
      labelRefresh.innerHTML = '';
    } else {
      labelRefresh.innerHTML = currentRefresh;
    }

  }, 1000);
}

function changeRefresh() {

  if (autoRefresh) {
    labelRefresh.innerHTML = '';
    clearInterval(refreshTimer);
  } else {
    startTimer(5);
  }

  autoRefresh = !autoRefresh;

}

function deleteFromIp() {

  var typedIp = document.getElementById('ipField').value.trim();
  var typedBoards = document.getElementById('fieldBoards').value.trim();

  if (!typedIp.length) {
    alert('An ip is mandatory');
    return;
  }

  apiRequest('deleteFromIp', {
    ip : typedIp,
    boards : typedBoards
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      document.getElementById('ipField').value = '';
      document.getElementById('fieldBoards').value = '';

      alert('Postings deleted.');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}
