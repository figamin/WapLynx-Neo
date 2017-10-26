var shownPostingMenu;
var banLabels = [ 'Regular ban', 'Range ban (1/2 octects)',
    'Range ban (3/4 octects)' ];
var deletionOptions = [ 'Do not delete', 'Delete post',
    'Delete post and media', 'Delete by ip' ];

function showReport(board, thread, post, global) {

  var outerPanel = getCaptchaModal(global ? 'Global report' : 'Report');

  var reasonField = document.createElement('input');
  reasonField.type = 'text';
  reasonField.setAttribute('placeholder', 'reason');

  var decorationPanel = outerPanel
      .getElementsByClassName('modalDecorationPanel')[0];

  var okButton = outerPanel.getElementsByClassName('modalOkButton')[0];

  decorationPanel.insertBefore(reasonField, okButton.parentNode);

  okButton.onclick = function() {

    var typedCaptcha = outerPanel.getElementsByClassName('modalAnswer')[0].value
        .trim();

    if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
      alert('Captchas are exactly 6 (24 if no cookies) characters long.');
      return;
    } else if (/\W/.test(typedCaptcha)) {
      alert('Invalid captcha.');
      return;
    }

    apiRequest('reportContent', {
      captcha : typedCaptcha,
      reason : reasonField.value.trim(),
      global : global,
      postings : [ {
        board : board,
        thread : thread,
        post : post
      } ]
    }, function requestComplete(status, data) {

      if (status === 'ok') {
        outerPanel.remove();
      } else {
        alert(status + ': ' + JSON.stringify(data));
      }

    });

  };

}

function deleteSinglePost(boardUri, thread, post, fromIp, wipeMedia,
    forcedPassword) {

  var key = boardUri + '/' + thread

  if (post) {
    key += '/' + post;
  }

  var storedData = JSON.parse(localStorage.postingPasswords || '{}');

  var password = forcedPassword || storedData[key]
      || localStorage.deletionPassword
      || document.getElementById('deletionFieldPassword').value.trim()
      || Math.random().toString(36).substring(2, 10);

  apiRequest(
      fromIp ? 'deleteFromIpOnBoard' : 'deleteContent',
      {
        password : password,
        deleteMedia : wipeMedia,
        postings : [ {
          board : boardUri,
          thread : thread,
          post : post
        } ]
      },
      function requestComplete(status, data) {

        if (status === 'ok') {

          if (!fromIp && !board && data.removedPosts) {
            refreshPosts(true, true);
          } else if (fromIp || data.removedThreads || data.removedPosts) {
            window.location.pathname = '/' + boardUri + '/';
          } else {

            var newPass = prompt('Could not delete. Would you like to try another password?');

            if (newPass) {
              deleteSinglePost(boardUri, thread, post, fromIp, wipeMedia,
                  newPass);
            }

          }

        } else {
          alert(status + ': ' + JSON.stringify(data));
        }
      });

}

function banSinglePost(innerPart, boardUri, thread, post, global) {

  var outerPanel = getCaptchaModal(global ? 'Global ban' : 'Ban');

  var decorationPanel = outerPanel
      .getElementsByClassName('modalDecorationPanel')[0];

  var okButton = outerPanel.getElementsByClassName('modalOkButton')[0];

  var reasonField = document.createElement('input');
  reasonField.type = 'text';
  reasonField.setAttribute('placeholder', 'reason');
  decorationPanel.insertBefore(reasonField, okButton.parentNode);

  var durationField = document.createElement('input');
  durationField.type = 'text';
  durationField.setAttribute('placeholder', 'duration');
  decorationPanel.insertBefore(durationField, okButton.parentNode);

  var messageField = document.createElement('input');
  messageField.type = 'text';
  messageField.setAttribute('placeholder', 'message');
  decorationPanel.insertBefore(messageField, okButton.parentNode);

  var typeCombo = document.createElement('select');
  decorationPanel.insertBefore(typeCombo, okButton.parentNode);

  for (var i = 0; i < banLabels.length; i++) {

    var option = document.createElement('option');
    option.innerHTML = banLabels[i];
    typeCombo.appendChild(option);

  }

  var deletionCombo = document.createElement('select');
  decorationPanel.insertBefore(deletionCombo, okButton.parentNode);

  for (var i = 0; i < deletionOptions.length; i++) {

    var option = document.createElement('option');
    option.innerHTML = deletionOptions[i];
    deletionCombo.appendChild(option);

  }

  deletionCombo.selectedIndex = +localStorage.autoDeletionOption;

  var captchaField = outerPanel.getElementsByClassName('modalAnswer')[0];
  captchaField.setAttribute('placeholder', 'answer (only for board staff)');

  okButton.onclick = function() {

    var typedMessage = messageField.value.trim();

    var selectedDeletionOption = deletionCombo.selectedIndex;

    localStorage.setItem('autoDeletionOption', selectedDeletionOption);

    apiRequest('banUsers', {
      reason : reasonField.value.trim(),
      captcha : captchaField.value.trim(),
      banType : typeCombo.selectedIndex,
      duration : durationField.value.trim(),
      banMessage : typedMessage,
      global : global,
      postings : [ {
        board : boardUri,
        thread : thread,
        post : post
      } ]
    }, function requestComplete(status, data) {

      if (status === 'ok') {

        var banMessageDiv = document.createElement('div');
        banMessageDiv.innerHTML = typedMessage
            || '(USER WAS BANNED FOR THIS POST)';
        banMessageDiv.setAttribute('class', 'divBanMessage');
        innerPart.appendChild(banMessageDiv);

        outerPanel.remove();

        if (selectedDeletionOption) {
          deleteSinglePost(boardUri, thread, post,
              selectedDeletionOption === 3, selectedDeletionOption === 2);
        }

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  };

}

function spoilSinglePost(boardUri, thread, post) {

  apiRequest('spoilFiles', {
    postings : [ {
      board : boardUri,
      thread : thread,
      post : post
    } ]
  }, function requestComplete(status, data) {
    location.reload(true);
  });

}

function transferThread(boardUri, thread) {

  var destination = prompt('Transfer to which board?',
      'Board uri without slashes');

  if (!destination) {
    return;
  }

  destination = destination.trim();

  apiRequest('transferThread', {
    boardUri : boardUri,
    threadId : thread,
    boardUriDestination : destination
  }, function setLock(status, data) {

    if (status === 'ok') {
      window.location.pathname = '/' + destination + '/res/' + data + '.html';
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function editPost(board, thread, post) {

  var url = '/edit.js?json=1&boardUri=' + board + '&threadId=' + thread;

  if (post) {
    url += '&postId=' + post;
  }

  var editData = localRequest(url, function gotData(error, data) {

    if (error) {
      alert(error);
    } else {

      data = JSON.parse(data);

      var outerPanel = getCaptchaModal('Edit', true);

      var decorationPanel = outerPanel
          .getElementsByClassName('modalDecorationPanel')[0];

      var okButton = outerPanel.getElementsByClassName('modalOkButton')[0];

      var subjectField = document.createElement('input');
      subjectField.type = 'text';
      subjectField.value = data.subject || '';
      subjectField.setAttribute('placeholder', 'subject');
      decorationPanel.insertBefore(subjectField, okButton.parentNode);

      var messageArea = document.createElement('textarea');
      messageArea.setAttribute('placeholder', 'message');
      messageArea.defaultValue = data.message || '';
      decorationPanel.insertBefore(messageArea, okButton.parentNode);

      okButton.onclick = function() {

        var typedSubject = subjectField.value.trim();
        var typedMessage = messageArea.value.trim();

        if (typedSubject.length > 128) {
          alert('Subject too long, keep it under 128 characters.');
        } else if (!typedMessage.length) {
          alert('A message is mandatory.');
        } else {

          var parameters = {
            boardUri : board,
            message : typedMessage,
            subject : typedSubject
          };

          if (post) {
            parameters.postId = post;
          } else {
            parameters.threadId = thread;
          }

          apiRequest('saveEdit', parameters, function requestComplete(status,
              data) {

            if (status === 'ok') {
              location.reload(true);
            } else {
              alert(status + ': ' + JSON.stringify(data));
            }
          });

        }

      };

    }

  });

}

function setExtraMenuMod(checkbox, extraMenu, board, thread, post) {

  extraMenu.appendChild(document.createElement('hr'));

  var deleteMediaButton = document.createElement('label');
  deleteMediaButton.innerHTML = 'Delete Post And Media';
  extraMenu.appendChild(deleteMediaButton);
  deleteMediaButton.onclick = function() {
    deleteSinglePost(board, thread, post, false, true);
  };

  extraMenu.appendChild(document.createElement('hr'));

  var innerPart = checkbox.parentNode.parentNode;

  var deleteByIpButton = document.createElement('label');
  deleteByIpButton.innerHTML = 'Delete By Ip';
  deleteByIpButton.onclick = function() {
    deleteSinglePost(board, thread, post, true);
  };
  extraMenu.appendChild(deleteByIpButton);

  extraMenu.appendChild(document.createElement('hr'));

  var banButton = document.createElement('label');
  banButton.innerHTML = 'Ban';
  banButton.onclick = function() {
    banSinglePost(innerPart, board, thread, post);
  };
  extraMenu.appendChild(banButton);

  extraMenu.appendChild(document.createElement('hr'));

  var globalBanButton = document.createElement('label');
  globalBanButton.innerHTML = 'Global Ban';
  globalBanButton.onclick = function() {
    banSinglePost(innerPart, board, thread, post, true);
  };
  extraMenu.appendChild(globalBanButton);

  extraMenu.appendChild(document.createElement('hr'));

  var spoilButton = document.createElement('label');
  spoilButton.innerHTML = 'Spoil Files';
  spoilButton.onclick = function() {
    spoilSinglePost(board, thread, post);
  };
  extraMenu.appendChild(spoilButton);

  if (!post) {

    extraMenu.appendChild(document.createElement('hr'));

    var transferButton = document.createElement('label');
    transferButton.innerHTML = 'Transfer Thread';
    transferButton.onclick = function() {
      transferThread(board, thread);
    };
    extraMenu.appendChild(transferButton);
  }

  extraMenu.appendChild(document.createElement('hr'));

  var editButton = document.createElement('label');
  editButton.innerHTML = 'Edit';
  editButton.onclick = function() {
    editPost(board, thread, post);
  };
  extraMenu.appendChild(editButton);

}

function setExtraMenu(checkbox) {

  var name = checkbox.name;

  var parts = name.split('-');

  var board = parts[0];

  var thread = parts[1];

  var post = parts[2];

  var extraMenuButton = document.createElement('span');
  extraMenuButton.setAttribute('class', 'extraMenuButton');
  extraMenuButton.title = 'Post Menu';
  checkbox.parentNode.insertBefore(extraMenuButton, checkbox.nextSibling);

  var extraMenu = document.createElement('div');
  extraMenu.className = 'floatingMenu';
  extraMenu.style.display = 'none';
  extraMenu.style.position = 'absolute';

  document.body.appendChild(extraMenu);

  extraMenuButton.onclick = function() {

    var rect = extraMenuButton.getBoundingClientRect();

    var previewOrigin = {
      x : rect.right + 10 + window.scrollX,
      y : rect.top + window.scrollY
    };

    extraMenu.style.left = previewOrigin.x + 'px';
    extraMenu.style.top = previewOrigin.y + 'px';
    extraMenu.style.display = 'inline';

    shownPostingMenu = extraMenu;
  };

  var reportButton = document.createElement('label');
  reportButton.innerHTML = 'Report';
  reportButton.onclick = function() {
    showReport(board, thread, post);
  };
  extraMenu.appendChild(reportButton);

  extraMenu.appendChild(document.createElement('hr'));

  var globalReportButton = document.createElement('label');
  globalReportButton.innerHTML = 'Global Report';
  globalReportButton.onclick = function() {
    showReport(board, thread, post, true);
  };
  extraMenu.appendChild(globalReportButton);

  extraMenu.appendChild(document.createElement('hr'));

  var deleteButton = document.createElement('label');
  deleteButton.innerHTML = 'Delete Post';
  extraMenu.appendChild(deleteButton);
  deleteButton.onclick = function() {
    deleteSinglePost(board, thread, post);
  };

  if (getCookies().hash) {
    setExtraMenuMod(checkbox, extraMenu, board, thread, post);
  }

}

if (!DISABLE_JS) {

  document.body.addEventListener('click', function clicked() {

    if (shownPostingMenu) {
      shownPostingMenu.style.display = 'none';
      shownPostingMenu = null;
    }

  }, true);

  var checkboxes = document.getElementsByClassName('deletionCheckBox');

  for (var i = 0; i < checkboxes.length; i++) {
    setExtraMenu(checkboxes[i]);
  }

}