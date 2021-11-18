var thread = {};

thread.init = function() {

  api.mod = !!document.getElementById('divMod');

  api.hiddenCaptcha = !document.getElementById('captchaDiv');

  document.getElementById('checkboxChangeRefresh').onchange = thread.changeRefresh;

  document.getElementsByTagName('body')[0].onscroll = function() {

    if (!thread.unreadPosts) {
      return;
    }

    var rect = thread.lastPost.getBoundingClientRect();

    if (rect.bottom < window.innerHeight) {
      thread.unreadPosts = 0;

      document.title = thread.originalTitle;
    }

  };

  api.boardUri = document.getElementById('boardIdentifier').value;
  thread.divPosts = document.getElementsByClassName('divPosts')[0];

  thread.initThread();

  document.getElementsByClassName('divRefresh')[0].style.display = 'block';

  thread.messageLimit = +document.getElementById('labelMessageLength').innerHTML;
  thread.refreshLabel = document.getElementById('labelRefresh');

  thread.refreshButton = document.getElementById('refreshButton');

  thread.refreshButton.onclick = function() {
    thread.refreshPosts(true)
  };

  if (document.getElementById('divArchive')) {
    api.convertButton('archiveFormButon', thread.archiveThread, 'archiveField');
  }

  if (document.getElementById('divMerge')) {
    api.convertButton('mergeFormButton', thread.mergeThread, 'mergeField');
  }

  if (document.getElementById('controlThreadIdentifier')) {

    api.convertButton('settingsFormButon', thread.saveThreadSettings,
        'threadSettingsField');

    if (document.getElementById('ipDeletionForm')) {
      api.convertButton('deleteFromIpFormButton', thread.deleteFromIp,
          'ipDeletionField');
    }

    if (document.getElementById('formTransfer')) {
      api.convertButton('transferFormButton', thread.transfer, 'transferField');
    }

    api.convertButton('inputBan', posting.banPosts, 'banField');
    api.convertButton('inputIpDelete', posting.deleteFromIpOnBoard);
    api.convertButton('inputThreadIpDelete', posting.deleteFromIpOnThread);
    api.convertButton('inputSpoil', posting.spoilFiles);

  }

  thread.replyButton = document.getElementById('formButton');
  thread.replyButton.disabled = false;

  api.convertButton(thread.replyButton, thread.postReply);

  var replies = document.getElementsByClassName('postCell');

  if (replies && replies.length) {
    thread.lastReplyId = replies[replies.length - 1].id;
  }

  api.localRequest('/' + api.boardUri + '/res/' + api.threadId + '.json',
      function(error, data) {

        if (error) {
          return thread.changeRefresh();
        }

        try {
          data = JSON.parse(data);
        } catch (error) {
          return thread.changeRefresh();
        }

        thread.wssPort = data.wssPort;
        thread.wsPort = data.wsPort;
        thread.changeRefresh();

      });

  var postingQuotes = document.getElementsByClassName('linkQuote');

  for (var i = 0; i < postingQuotes.length; i++) {
    thread.processPostingQuote(postingQuotes[i]);
  }

};

thread.initThread = function() {

  if (thread.retryTimer) {
    clearInterval(thread.retryTimer);
    delete thread.retryTimer;
  }
  thread.expectedPosts = [];
  thread.lastReplyId = 0;
  thread.originalTitle = document.title;
  posting.highLightedIds = [];
  posting.idsRelation = {};

  var ids = document.getElementsByClassName('labelId');

  for (i = 0; i < ids.length; i++) {
    posting.processIdLabel(ids[i]);
  }

  thread.unreadPosts = 0;
  api.threadId = +document.getElementsByClassName('opCell')[0].id;
  thread.refreshURL = '/' + api.boardUri + '/res/' + api.threadId + '.json';
  thread.refreshParameters = {
    boardUri : api.boardUri,
    threadId : api.threadId
  };

};

thread.transfer = function() {

  var informedBoard = document.getElementById("fieldDestinationBoard").value
      .trim();

  api.formApiRequest('transferThread', {
    boardUri : api.boardUri,
    threadId : api.threadId,
    boardUriDestination : informedBoard
  },
      function setLock(status, data) {

        if (status === 'ok') {
          window.location.pathname = '/' + informedBoard + '/res/' + data
              + '.html';
        } else {
          alert(status + ': ' + JSON.stringify(data));
        }
      });

};

thread.markPost = function(id) {

  if (isNaN(id)) {
    return;
  }

  if (thread.markedPosting && thread.markedPosting.className === 'markedPost') {
    thread.markedPosting.className = 'innerPost';
  }

  var container = document.getElementById(id);

  if (!container || container.className !== 'postCell') {
    return;
  }

  thread.markedPosting = container.getElementsByClassName('innerPost')[0];

  if (thread.markedPosting) {
    thread.markedPosting.className = 'markedPost';
  }

};

thread.processPostingQuote = function(link) {

  link.onclick = function() {
    qr.showQr(link.href.match(/#q(\d+)/)[1]);
  };

};

thread.mergeThread = function() {

  var informedThread = document.getElementById("fieldDestinationThread").value
      .trim();

  var destinationThread = document.getElementById("fieldDestinationThread").value;

  api.formApiRequest('mergeThread', {
    boardUri : api.boardUri,
    threadSource : api.threadId,
    threadDestination : destinationThread
  }, function setLock(status, data) {

    if (status === 'ok') {
      window.location.pathname = '/' + api.boardUri + '/res/'
          + destinationThread + '.html';
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

thread.archiveThread = function() {

  if (!document.getElementById('checkboxArchive').checked) {
    alert('You must confirm that you wish to archive this thread.');
    return;
  }

  api.formApiRequest('archiveThread', {
    confirmation : true,
    boardUri : api.boardUri,
    threadId : api.threadId
  }, function archived(status, data) {

    if (status === 'ok') {

      api.resetIndicators({
        locked : document.getElementsByClassName('lockIndicator').length,
        pinned : document.getElementsByClassName('pinIndicator').length,
        cyclic : document.getElementsByClassName('cyclicIndicator').length,
        archived : true
      });

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  });

};

thread.saveThreadSettings = function() {

  var pinned = document.getElementById('checkboxPin').checked;
  var locked = document.getElementById('checkboxLock').checked;
  var cyclic = document.getElementById('checkboxCyclic').checked;

  api.formApiRequest('changeThreadSettings', {
    boardUri : api.boardUri,
    threadId : api.threadId,
    pin : pinned,
    lock : locked,
    cyclic : cyclic
  }, function setLock(status, data) {

    if (status === 'ok') {

      api.resetIndicators({
        locked : locked,
        pinned : pinned,
        cyclic : cyclic,
        archived : document.getElementsByClassName('archiveIndicator').length
      });

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

thread.replyCallback = function(status, data) {

  if (status === 'ok') {

    postCommon.storeUsedPostingPassword(api.boardUri, api.threadId, data);

    document.getElementById('fieldMessage').value = '';
    document.getElementById('fieldSubject').value = '';
    qr.clearQRAfterPosting();
    postCommon.clearSelectedFiles();

    if (!thread.autoRefresh || !thread.socket) {
      thread.refreshPosts(true);
    }

  } else {
    alert(status + ': ' + JSON.stringify(data));
  }

};

thread.replyCallback.stop = function() {

  thread.replyButton.innerHTML = thread.originalButtonText;

  qr.setQRReplyText(thread.originalButtonText);

  thread.replyButton.disabled = false;
  qr.setQRReplyEnabled(true);

};

thread.replyCallback.progress = function(info) {

  if (info.lengthComputable) {
    var newText = 'Uploading ' + Math.floor((info.loaded / info.total) * 100)
        + '%';
    thread.replyButton.innerHTML = newText;

    qr.setQRReplyText(newText);
  }

};

thread.refreshCallback = function(error, receivedData) {

  if ((api.mod && (error !== 'ok')) || (!api.mod && error)) {
    return;
  }

  if (!api.mod) {
    receivedData = JSON.parse(receivedData);
  }

  if (receivedData.threadId !== api.threadId) {

    window.location.href = '/' + receivedData.boardUri + '/res/'
        + receivedData.threadId + '.html';

    return;
  }

  if (thread.fullRefresh) {
    thread.lastReplyId = 0;
    thread.unreadPosts = 0;
    while (thread.divPosts.firstChild) {
      thread.divPosts.removeChild(thread.divPosts.firstChild);
    }

    document.title = thread.originalTitle;

  }

  thread.wsPort = receivedData.wsPort;
  thread.wssPort = receivedData.wssPort;
  tooltips.cacheData(receivedData);

  var posts = receivedData.posts;

  var foundPosts = false;

  if (posts && posts.length) {
    var lastReceivedPost = posts[posts.length - 1];

    if (lastReceivedPost.postId > thread.lastReplyId) {
      foundPosts = true;

      for (var i = 0; i < posts.length; i++) {

        var post = posts[i];

        if (post.postId > thread.lastReplyId) {
          thread.unreadPosts++;

          if (thread.expectedPosts.indexOf(post.postId) >= 0) {
            thread.expectedPosts.splice(thread.expectedPosts
                .indexOf(post.postId), 1);

          }

          var postCell = posting.addPost(post, api.boardUri, api.threadId);

          thread.divPosts.appendChild(postCell);

          thread.lastPost = postCell;

          thread.lastReplyId = post.postId;
        }

      }

      if (!thread.fullRefresh) {
        document.title = '(' + thread.unreadPosts + ') ' + thread.originalTitle;
      }

    }

    if (thread.expectedPosts.length && !thread.retryTimer) {

      thread.expectedPosts = [];

      thread.retryTimer = setTimeout(function() {

        delete thread.retryTimer;

        if (!thread.refreshingThread) {
          thread.refreshPosts();
        }

      }, 10000);
    }
  }

  if (thread.autoRefresh
      && !(!JSON.parse(localStorage.noWs || 'false') && (thread.wsPort || thread.wssPort))) {
    thread.startTimer(thread.manualRefresh || foundPosts ? 5
        : thread.lastRefresh * 2);
  }

};

thread.refreshCallback.stop = function() {

  thread.refreshButton.disabled = false;

  thread.refreshingThread = false;

  if (sideCatalog.waitingForRefreshData) {
    sideCatalog.loadThread(sideCatalog.waitingForRefreshData.cell,
        sideCatalog.waitingForRefreshData.thread);
    delete sideCatalog.waitingForRefreshData;
  }

};

thread.refreshPosts = function(manual, full) {

  if (thread.refreshingThread || (manual && sideCatalog.loadingThread)) {
    return;
  }

  thread.manualRefresh = manual;
  thread.fullRefresh = full;

  if (thread.autoRefresh && manual) {
    clearInterval(thread.refreshTimer);
  }

  thread.refreshButton.disabled = true;

  thread.refreshingThread = true;

  if (api.mod) {
    api.formApiRequest('mod', {}, thread.refreshCallback, true,
        thread.refreshParameters);
  } else {
    api.localRequest(thread.refreshURL, thread.refreshCallback);
  }

};

thread.sendReplyData = function(files, captchaId) {

  var forcedAnon = !document.getElementById('fieldName');
  var hiddenFlags = !document.getElementById('flagsDiv');

  if (!hiddenFlags) {
    var combo = document.getElementById('flagCombobox');

    var selectedFlag = combo.options[combo.selectedIndex].value;

    postCommon.savedSelectedFlag(selectedFlag);

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

  if (!typedMessage.length && !files.length) {
    alert('A message or a file is mandatory.');
    return;
  } else if (!forcedAnon && typedName.length > 32) {
    alert('Name is too long, keep it under 32 characters.');
    return;
  } else if (typedMessage.length > thread.messageLimit) {
    alert('Message is too long, keep it under ' + thread.messageLimit
        + ' characters.');
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

  thread.originalButtonText = thread.replyButton.innerHTML;
  thread.replyButton.innerHTML = 'Uploading 0%';
  qr.setQRReplyText(thread.replyButton.innerHTML);
  thread.replyButton.disabled = true;
  qr.setQRReplyEnabled(false);

  api.formApiRequest('replyThread', {
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
    boardUri : api.boardUri,
    threadId : api.threadId
  }, thread.replyCallback);

};

thread.processFilesToPost = function(captchaId) {

  postCommon.newGetFilesToUpload(function gotFiles(files) {
    thread.sendReplyData(files, captchaId);
  });

};

thread.postReply = function() {

  if (api.hiddenCaptcha) {
    return bypassUtils.checkPass(thread.processFilesToPost);
  }

  var typedCaptcha = document.getElementById('fieldCaptcha').value.trim();

  if (typedCaptcha.length !== 6 && typedCaptcha.length !== 112) {

    alert('Captchas are exactly 6 (112 if no cookies) characters long.');
    return;
  }

  if (typedCaptcha.length == 112) {
    bypassUtils.checkPass(function() {
      thread.processFilesToPost(typedCaptcha);
    });
  } else {
    var parsedCookies = api.getCookies();

    api.formApiRequest('solveCaptcha', {
      captchaId : parsedCookies.captchaid,
      answer : typedCaptcha
    }, function solvedCaptcha(status, data) {

      if (status !== 'ok') {
        alert(status);
        return;
      }

      bypassUtils.checkPass(function() {
        thread.processFilesToPost(parsedCookies.captchaid);
      });

    });
  }

};

thread.transition = function() {

  if (!thread.autoRefresh) {
    return;
  }

  if (thread.wssPort || thread.wsPort) {
    thread.stopWs();
    thread.startWs();
  } else {
    thread.currentRefresh = 5;
  }

};

thread.startTimer = function(time) {

  if (time > 600) {
    time = 600;
  }

  thread.currentRefresh = time;
  thread.lastRefresh = time;
  thread.refreshLabel.innerHTML = thread.currentRefresh;
  thread.refreshTimer = setInterval(function checkTimer() {

    if (sideCatalog.loadingThread) {
      return;
    }

    thread.currentRefresh--;

    if (!thread.currentRefresh) {
      clearInterval(thread.refreshTimer);
      thread.refreshPosts();
      thread.refreshLabel.innerHTML = '';
    } else {
      thread.refreshLabel.innerHTML = thread.currentRefresh;
    }

  }, 1000);
};

thread.stopWs = function() {

  if (!thread.socket) {
    return;
  }

  thread.socket.close();
  delete thread.socket;

};

thread.startWs = function() {

  if (typeof (sideCatalog) !== 'undefined' && sideCatalog.loadingThread) {
    return;
  }

  var isOnion = window.location.hostname.endsWith('.onion');

  var protocol = (thread.wssPort && !isOnion) ? 'wss' : 'ws';

  var portToUse = (thread.wssPort && !isOnion) ? thread.wssPort : thread.wsPort;
  
  thread.socket = new WebSocket(protocol + '://' + window.location.hostname
      + ':' + portToUse);

  thread.socket.onopen = function(event) {
    thread.socket.send(api.boardUri + '-' + api.threadId);
  };

  thread.socket.onmessage = function(message) {

    message = JSON.parse(message.data);

    switch (message.action) {
    case 'post': {

      thread.expectedPosts.push(message.target[0]);

      setTimeout(function() {

        if (!thread.refreshingThread) {
          thread.refreshPosts();
        }
      }, 200);

      break;
    }
    case 'edit': {
      setTimeout(function() {
        thread.refreshPosts(null, true);
      }, 200);
      break;
    }
    case 'delete': {

      for (var i = 0; i < message.target.length; i++) {

        var post = document.getElementById(message.target[i]);

        if (!post) {
          continue;
        }

        var info = post.getElementsByClassName('postInfo')[0];

        var deletedLabel = document.createElement('span');
        deletedLabel.innerHTML = '(Deleted)';

        info.insertBefore(deletedLabel,
            info.getElementsByClassName('linkName')[0]);

      }

      break;
    }

    }

  };

  thread.socket.onerror = function(error) {
    delete thread.wsPort;
    delete thread.wssPort;
    thread.changeRefresh();
  };

};

thread.changeRefresh = function() {

  thread.autoRefresh = document.getElementById('checkboxChangeRefresh').checked;

  if (!thread.autoRefresh) {
    thread.refreshLabel.innerHTML = '';

    thread.stopWs();

    clearInterval(thread.refreshTimer);
  } else {

    if (!JSON.parse(localStorage.noWs || 'false')
        && (thread.wsPort || thread.wssPort)) {
      thread.startWs();
    } else {
      thread.startTimer(5);
    }

  }

};

thread.deleteFromIp = function() {

  var typedIp = document.getElementById('ipField').value.trim();
  var typedBoards = document.getElementById('fieldBoards').value.trim();

  if (!typedIp.length) {
    alert('An ip is mandatory');
    return;
  }

  api.formApiRequest('deleteFromIp', {
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

};

thread.init();
