var boardUri;
var threadId;
var board = false;
var replyButton;
var fullRefresh = false;
var refreshButton;
var lastReplyId;
var refreshLabel;
var autoRefresh;
var refreshTimer;
var lastRefresh;
var currentRefresh;
var manualRefresh;
var foundPosts;
var refreshingThread;
var hiddenCaptcha = !document.getElementById('captchaDiv');
var markedPosting;
var limitRefreshWait = 10 * 60;
var originalButtonText;
var messageLimit;
var unreadPosts;
var originalTitle;
var lastPost;
var highLightedIds;
var idsRelation;
var refreshURL;

function initThread() {

  lastPost = null;
  lastReplyId = 0;
  originalTitle = document.title;
  highLightedIds = [];
  idsRelation = {};
  unreadPosts = 0;
  threadId = +document.getElementsByClassName('opCell')[0].id;
  refreshURL = document.getElementById('divMod') ? '/mod.js?boardUri='
      + boardUri + '&threadId=' + threadId + '&json=1' : '/' + boardUri
      + '/res/' + threadId + '.json';

}

if (!DISABLE_JS) {

  document.getElementById('mainPanel').onscroll = function() {

    if (!unreadPosts) {
      return;
    }

    var rect = lastPost.getBoundingClientRect();

    if (rect.bottom < window.innerHeight) {
      unreadPosts = 0;

      document.title = originalTitle;
    }

  };

  boardUri = document.getElementById('boardIdentifier').value;
  var divPosts = document.getElementsByClassName('divPosts')[0];

  initThread();

  document.getElementsByClassName('divRefresh')[0].style.display = 'block';

  messageLimit = +document.getElementById('labelMessageLength').innerHTML;
  refreshLabel = document.getElementById('labelRefresh');

  refreshButton = document.getElementById('refreshButton');

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

  var postingQuotes = document.getElementsByClassName('linkQuote');

  for (var i = 0; i < postingQuotes.length; i++) {
    processPostingQuote(postingQuotes[i]);
  }

  var ids = document.getElementsByClassName('labelId');

  for (i = 0; i < ids.length; i++) {
    processIdLabel(ids[i]);
  }
}

function processIdLabel(label) {

  var id = label.innerHTML;

  var array = idsRelation[id] || [];
  idsRelation[id] = array;

  var cell = label.parentNode.parentNode.parentNode;

  array.push(cell);

  label.onmouseover = function() {
    label.innerHTML = id + ' (' + array.length + ')';
  }

  label.onmouseout = function() {
    label.innerHTML = id;
  }

  label.onclick = function() {

    var index = highLightedIds.indexOf(id);

    if (index > -1) {
      highLightedIds.splice(index, 1);
    } else {
      highLightedIds.push(id);
    }

    for (var i = 0; i < array.length; i++) {
      var cellToChange = array[i];

      if (cellToChange.className === 'innerOP') {
        continue;
      }

      cellToChange.className = index > -1 ? 'innerPost' : 'markedPost';
    }

  };

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
    markedPosting.className = 'innerPost';
  }

  var container = document.getElementById(id);

  if (!container || container.className !== 'postCell') {
    return;
  }

  markedPosting = container.getElementsByClassName('innerPost')[0];

  if (markedPosting) {
    markedPosting.className = 'markedPost';
  }
}

function processPostingQuote(link) {

  link.onclick = function() {
    var toQuote = link.href.match(/#q(\d+)/)[1];

    showQr(link, toQuote);

    document.getElementById('fieldMessage').value += '>>' + toQuote + '\n';

  };

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

    storeUsedPostingPassword(boardUri, threadId, data);

    document.getElementById('fieldMessage').value = '';
    document.getElementById('fieldSubject').value = '';
    clearQRAfterPosting();
    clearSelectedFiles();

    refreshPosts(true);

  } else {
    alert(status + ': ' + JSON.stringify(data));
  }
};

replyCallback.stop = function() {
  replyButton.innerHTML = originalButtonText;

  setQRReplyText(originalButtonText);

  replyButton.disabled = false;
  setQRReplyEnabled(true);
};

replyCallback.progress = function(info) {

  if (info.lengthComputable) {
    var newText = 'Uploading ' + Math.floor((info.loaded / info.total) * 100)
        + '%';
    replyButton.innerHTML = newText;

    setQRReplyText(newText);
  }
};

var refreshCallback = function(error, data) {

  if (error) {
    return;
  }

  if (fullRefresh) {
    lastReplyId = 0;
    unreadPosts = 0;
    while (divPosts.firstChild) {
      divPosts.removeChild(divPosts.firstChild);
    }

    document.title = originalTitle;

  }

  var receivedData = JSON.parse(data);

  var posts = receivedData.posts;

  foundPosts = false;

  if (posts && posts.length) {
    var lastReceivedPost = posts[posts.length - 1];

    if (lastReceivedPost.postId > lastReplyId) {
      foundPosts = true;

      for (var i = 0; i < posts.length; i++) {

        var post = posts[i];

        if (post.postId > lastReplyId) {
          unreadPosts++;

          var postCell = addPost(post, boardUri, threadId);

          divPosts.appendChild(postCell);

          lastPost = postCell;

          lastReplyId = post.postId;
        }

      }

      if (!fullRefresh) {
        document.title = '(' + unreadPosts + ') ' + originalTitle;
      }

    }
  }

  if (autoRefresh) {
    startTimer(manualRefresh || foundPosts ? 5 : lastRefresh * 2);
  }

};

refreshCallback.stop = function() {
  refreshButton.disabled = false;

  refreshingThread = false;

  if (waitingForRefreshData) {
    loadThread(waitingForRefreshData.cell, waitingForRefreshData.thread);
    waitingForRefreshData = false;
  }

};

function refreshPosts(manual, full) {

  if (manual && loadingThread) {
    return;
  }

  manualRefresh = manual;
  fullRefresh = full;

  if (autoRefresh && manual) {
    clearInterval(refreshTimer);
  }

  refreshButton.disabled = true;

  refreshingThread = true;

  localRequest(refreshURL, refreshCallback);

}

function sendReplyData(files, captchaId) {

  var forcedAnon = !document.getElementById('fieldName');
  var hiddenFlags = !document.getElementById('flagsDiv');

  if (!hiddenFlags) {
    var combo = document.getElementById('flagCombobox');

    var selectedFlag = combo.options[combo.selectedIndex].value;

    savedSelectedFlag(selectedFlag);

  }

  if (!forcedAnon) {
    var typedName = document.getElementById('fieldName').value.trim();
    localStorage.setItem('name', typedName);
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
  } else if (typedMessage.length > messageLimit) {
    alert('Message is too long, keep it under ' + messageLimit + ' characters.');
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

  if (!typedPassword) {
    typedPassword = Math.random().toString(36).substring(2, 10);
  }

  localStorage.setItem('deletionPassword', typedPassword);

  var spoilerCheckBox = document.getElementById('checkboxSpoiler');

  var noFlagCheckBox = document.getElementById('checkboxNoFlag');

  originalButtonText = replyButton.innerHTML;
  replyButton.innerHTML = 'Uploading 0%';
  setQRReplyText(replyButton.innerHTML);
  replyButton.disabled = true;
  setQRReplyEnabled(false);

  apiRequest('replyThread', {
    name : forcedAnon ? null : typedName,
    flag : hiddenFlags ? null : selectedFlag,
    captcha : captchaId,
    subject : typedSubject,
    noFlag : noFlagCheckBox ? noFlagCheckBox.checked : false,
    spoiler : spoilerCheckBox ? spoilerCheckBox.checked : false,
    password : typedPassword,
    message : typedMessage,
    email : typedEmail,
    files : files,
    boardUri : boardUri,
    threadId : threadId
  }, replyCallback);

}

function processFilesToPost(captchaId) {

  getFilestToUpload(function gotFiles(files) {
    sendReplyData(files, captchaId);
  });

}

function processReplyRequest() {

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

    if (typedCaptcha.length == 24) {
      processFilesToPost(typedCaptcha);
    } else {
      var parsedCookies = getCookies();

      apiRequest('solveCaptcha', {

        captchaId : parsedCookies.captchaid,
        answer : typedCaptcha
      }, function solvedCaptcha(status, data) {
        processFilesToPost(parsedCookies.captchaid);
      });
    }

  }

}

function postReply() {

  localRequest('/blockBypass.js?json=1',
      function checked(error, response) {

        if (error) {
          alert(error);
          return;
        }

        var data = JSON.parse(response);

        var alwaysUseBypass = document
            .getElementById('alwaysUseBypassCheckBox').checked;

        if (!data.valid
            && (data.mode == 2 || (data.mode == 1 && alwaysUseBypass))) {

          displayBlockBypassPrompt(function() {
            processReplyRequest();
          });

        } else {
          processReplyRequest();
        }

      });

}

function startTimer(time) {

  if (time > limitRefreshWait) {
    time = limitRefreshWait;
  }

  currentRefresh = time;
  lastRefresh = time;
  refreshLabel.innerHTML = currentRefresh;
  refreshTimer = setInterval(function checkTimer() {

    if (loadingThread) {
      return;
    }

    currentRefresh--;

    if (!currentRefresh) {
      clearInterval(refreshTimer);
      refreshPosts();
      refreshLabel.innerHTML = '';
    } else {
      refreshLabel.innerHTML = currentRefresh;
    }

  }, 1000);
}

function changeRefresh() {

  autoRefresh = document.getElementById('checkboxChangeRefresh').checked;

  if (!autoRefresh) {
    refreshLabel.innerHTML = '';
    clearInterval(refreshTimer);
  } else {
    startTimer(5);
  }

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
