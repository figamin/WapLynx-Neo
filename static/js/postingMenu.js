var postingMenu = {};

postingMenu.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  postingMenu.banLabels = [ 'Regular ban', 'Range ban (1/2 octects)',
      'Range ban (3/4 octects)' ];
  postingMenu.deletionOptions = [ 'Do not delete', 'Delete post',
      'Delete post and media', 'Delete by ip' ];
  postingMenu.threadSettingsList = [ {
    label : 'Toggle Lock',
    field : 'locked',
    parameter : 'lock'
  }, {
    label : 'Toggle Pin',
    field : 'pinned',
    parameter : 'pin'
  }, {
    label : 'Toggle Cyclic',
    field : 'cyclic',
    parameter : 'cyclic'
  } ];

  document.body.addEventListener('click', function clicked() {

    if (postingMenu.shownPostingMenu) {
      postingMenu.shownPostingMenu.remove();
      delete postingMenu.shownPostingMenu;
    }

  }, true);

  api.localRequest('/account.js?json=1', function gotLoginData(error, data) {

    if (!data) {
      return;
    }

    try {
      data = JSON.parse(data);
    } catch (error) {
      return;
    }

    postingMenu.loggedIn = true;

    postingMenu.globalRole = data.globalRole;

    postingMenu.moddedBoards = [];

    for (var i = 0; i < data.ownedBoards.length; i++) {
      postingMenu.moddedBoards.push(data.ownedBoards[i]);
    }

    for (i = 0; i < data.volunteeredBoards.length; i++) {
      postingMenu.moddedBoards.push(data.volunteeredBoards[i]);
    }

  });

  var checkboxes = document.getElementsByClassName('deletionCheckBox');

  for (var i = 0; i < checkboxes.length; i++) {
    postingMenu.setExtraMenu(checkboxes[i]);
  }

};

postingMenu.showReport = function(board, thread, post, global) {

  var outerPanel = captchaModal.getCaptchaModal(global ? 'Global report'
      : 'Report');

  var reasonField = document.createElement('input');
  reasonField.type = 'text';

  captchaModal.addModalRow('Reason', reasonField);

  var okButton = outerPanel.getElementsByClassName('modalOkButton')[0];

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

    api.apiRequest('reportContent', {
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

};

postingMenu.deleteSinglePost = function(boardUri, thread, post, fromIp,
    unlinkFiles, wipeMedia, forcedPassword) {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  var key = boardUri + '/' + thread

  if (post) {
    key += '/' + post;
  }

  var storedData = JSON.parse(localStorage.postingPasswords || '{}');

  var password = forcedPassword || storedData[key]
      || localStorage.deletionPassword
      || document.getElementById('deletionFieldPassword').value.trim()
      || Math.random().toString(36).substring(2, 10);

  api
      .apiRequest(
          fromIp ? 'deleteFromIpOnBoard' : 'deleteContent',
          {
            confirmation : true,
            password : password,
            deleteUploads : unlinkFiles,
            deleteMedia : wipeMedia,
            postings : [ {
              board : boardUri,
              thread : thread,
              post : post
            } ]
          },
          function requestComplete(status, data) {

            if (status === 'ok') {

              if (!fromIp && !api.isBoard && data.removedPosts) {
                refreshPosts(true, true);
              } else if (fromIp || data.removedThreads || data.removedPosts) {

                if (api.isBoard) {
                  location.reload(true);
                } else {
                  window.location.pathname = '/' + boardUri + '/';
                }

              } else {

                var newPass = prompt('Could not delete. Would you like to try another password?');

                if (newPass) {
                  postingMenu.deleteSinglePost(boardUri, thread, post, fromIp,
                      unlinkFiles, wipeMedia, newPass);
                }

              }

            } else {
              alert(status + ': ' + JSON.stringify(data));
            }
          });

};

postingMenu.banSinglePost = function(innerPart, boardUri, thread, post, global) {

  var outerPanel = captchaModal.getCaptchaModal(global ? 'Global ban' : 'Ban');

  var decorationPanel = outerPanel
      .getElementsByClassName('modalDecorationPanel')[0];

  var okButton = outerPanel.getElementsByClassName('modalOkButton')[0];

  var reasonField = document.createElement('input');
  reasonField.type = 'text';
  captchaModal.addModalRow('Reason', reasonField);

  var durationField = document.createElement('input');
  durationField.type = 'text';
  captchaModal.addModalRow('Duration', durationField);

  var messageField = document.createElement('input');
  messageField.type = 'text';
  captchaModal.addModalRow('Message', messageField);

  var typeCombo = document.createElement('select');
  captchaModal.addModalRow('Type', typeCombo);

  for (var i = 0; i < postingMenu.banLabels.length; i++) {

    var option = document.createElement('option');
    option.innerHTML = postingMenu.banLabels[i];
    typeCombo.appendChild(option);

  }

  var deletionCombo = document.createElement('select');

  captchaModal.addModalRow('Deletion action', deletionCombo);

  for (var i = 0; i < postingMenu.deletionOptions.length; i++) {

    var option = document.createElement('option');
    option.innerHTML = postingMenu.deletionOptions[i];
    deletionCombo.appendChild(option);

  }

  deletionCombo.selectedIndex = +localStorage.autoDeletionOption;

  var captchaField = outerPanel.getElementsByClassName('modalAnswer')[0];
  captchaField.setAttribute('placeholder', 'only for board staff)');

  okButton.onclick = function() {

    var typedMessage = messageField.value.trim();

    var selectedDeletionOption = deletionCombo.selectedIndex;

    localStorage.setItem('autoDeletionOption', selectedDeletionOption);

    api.apiRequest('banUsers', {
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
        banMessageDiv.className = 'divBanMessage';
        innerPart.appendChild(banMessageDiv);

        outerPanel.remove();

        if (selectedDeletionOption) {
          postingMenu
              .deleteSinglePost(boardUri, thread, post,
                  selectedDeletionOption === 3, false,
                  selectedDeletionOption === 2);
        }

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  };

};

postingMenu.spoilSinglePost = function(boardUri, thread, post) {

  api.apiRequest('spoilFiles', {
    postings : [ {
      board : boardUri,
      thread : thread,
      post : post
    } ]
  }, function requestComplete(status, data) {
    location.reload(true);
  });

};

postingMenu.transferThread = function(boardUri, thread) {

  var destination = prompt('Transfer to which board?',
      'Board uri without slashes');

  if (!destination) {
    return;
  }

  destination = destination.trim();

  api.apiRequest('transferThread', {
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

};

postingMenu.editPost = function(board, thread, post) {

  var url = '/edit.js?json=1&boardUri=' + board + '&threadId=' + thread;

  if (post) {
    url += '&postId=' + post;
  }

  var editData = api.localRequest(url, function gotData(error, data) {

    if (error) {
      alert(error);
    } else {

      data = JSON.parse(data);

      var outerPanel = captchaModal.getCaptchaModal('Edit', true);

      var okButton = outerPanel.getElementsByClassName('modalOkButton')[0];

      var subjectField = document.createElement('input');
      subjectField.type = 'text';
      subjectField.value = data.subject || '';
      captchaModal.addModalRow('Subject', subjectField);

      var messageArea = document.createElement('textarea');
      messageArea.setAttribute('placeholder', 'message');
      messageArea.defaultValue = data.message || '';
      captchaModal.addModalRow('Message', messageArea);

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

          api.apiRequest('saveEdit', parameters, function requestComplete(
              status, data) {

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

};

postingMenu.toggleThreadSetting = function(boardUri, thread, settingIndex) {

  api.localRequest('/' + boardUri + '/res/' + thread + '.json',
      function gotData(error, data) {

        if (error) {
          alert(error);
          return;
        }

        var data = JSON.parse(data);

        var parameters = {
          boardUri : boardUri,
          threadId : thread
        };

        for (var i = 0; i < postingMenu.threadSettingsList.length; i++) {

          var field = postingMenu.threadSettingsList[i];

          parameters[field.parameter] = settingIndex === i ? !data[field.field]
              : data[field.field];

        }

        api.apiRequest('changeThreadSettings', parameters,
            function requestComplete(status, data) {

              if (status === 'ok') {
                location.reload(true);
              } else {
                alert(status + ': ' + JSON.stringify(data));
              }
            });

      });

};

postingMenu.addToggleSettingButton = function(extraMenu, board, thread, index) {

  extraMenu.appendChild(document.createElement('hr'));

  var toggleButton = document.createElement('div');
  toggleButton.innerHTML = postingMenu.threadSettingsList[index].label;
  toggleButton.onclick = function() {
    postingMenu.toggleThreadSetting(board, thread, index);
  };

  extraMenu.appendChild(toggleButton);

};

postingMenu.setExtraMenuThread = function(extraMenu, board, thread) {

  if (postingMenu.globalRole <= 1) {

    extraMenu.appendChild(document.createElement('hr'));

    var transferButton = document.createElement('div');
    transferButton.innerHTML = 'Transfer Thread';
    transferButton.onclick = function() {
      postingMenu.transferThread(board, thread);
    };
    extraMenu.appendChild(transferButton);

  }

  for (var i = 0; i < postingMenu.threadSettingsList.length; i++) {
    postingMenu.addToggleSettingButton(extraMenu, board, thread, i);
  }

};

postingMenu.setModFileOptions = function(extraMenu, board, thread, post) {

  extraMenu.appendChild(document.createElement('hr'));

  var spoilButton = document.createElement('div');
  spoilButton.innerHTML = 'Spoil Files';
  spoilButton.onclick = function() {
    postingMenu.spoilSinglePost(board, thread, post);
  };
  extraMenu.appendChild(spoilButton);

  if (postingMenu.globalRole > 3) {
    return;
  }

  extraMenu.appendChild(document.createElement('hr'));

  var deleteMediaButton = document.createElement('div');
  deleteMediaButton.innerHTML = 'Delete Post And Media';
  extraMenu.appendChild(deleteMediaButton);
  deleteMediaButton.onclick = function() {
    postingMenu.deleteSinglePost(board, thread, post, false, false, true);
  };

};

postingMenu.setExtraMenuMod = function(checkbox, extraMenu, board, thread,
    post, hasFiles) {

  if (hasFiles) {
    postingMenu.setModFileOptions(extraMenu, board, thread, post);
  }

  extraMenu.appendChild(document.createElement('hr'));

  var innerPart = checkbox.parentNode.parentNode;

  var deleteByIpButton = document.createElement('div');
  deleteByIpButton.innerHTML = 'Delete By Ip';
  deleteByIpButton.onclick = function() {

    if (confirm("Are you sure you wish to delete all posts on this board made by this ip?")) {
      postingMenu.deleteSinglePost(board, thread, post, true);
    }

  };
  extraMenu.appendChild(deleteByIpButton);

  extraMenu.appendChild(document.createElement('hr'));

  var banButton = document.createElement('div');
  banButton.innerHTML = 'Ban';
  banButton.onclick = function() {
    postingMenu.banSinglePost(innerPart, board, thread, post);
  };
  extraMenu.appendChild(banButton);

  if (postingMenu.globalRole <= 2) {

    extraMenu.appendChild(document.createElement('hr'));

    var globalBanButton = document.createElement('div');
    globalBanButton.innerHTML = 'Global Ban';
    globalBanButton.onclick = function() {
      postingMenu.banSinglePost(innerPart, board, thread, post, true);
    };
    extraMenu.appendChild(globalBanButton);

  }

  extraMenu.appendChild(document.createElement('hr'));

  var editButton = document.createElement('div');
  editButton.innerHTML = 'Edit';
  editButton.onclick = function() {
    postingMenu.editPost(board, thread, post);
  };
  extraMenu.appendChild(editButton);

  if (!post) {
    postingMenu.setExtraMenuThread(extraMenu, board, thread);
  }

};

postingMenu.buildMenu = function(checkbox, extraMenu) {

  var name = checkbox.name;

  var parts = name.split('-');

  var board = parts[0];

  var thread = parts[1];

  var post = parts[2];

  var reportButton = document.createElement('div');
  reportButton.innerHTML = 'Report';
  reportButton.onclick = function() {
    postingMenu.showReport(board, thread, post);
  };
  extraMenu.appendChild(reportButton);

  extraMenu.appendChild(document.createElement('hr'));

  var globalReportButton = document.createElement('div');
  globalReportButton.innerHTML = 'Global Report';
  globalReportButton.onclick = function() {
    postingMenu.showReport(board, thread, post, true);
  };
  extraMenu.appendChild(globalReportButton);

  extraMenu.appendChild(document.createElement('hr'));

  var deleteButton = document.createElement('div');
  deleteButton.innerHTML = 'Delete Post';
  extraMenu.appendChild(deleteButton);
  deleteButton.onclick = function() {
    postingMenu.deleteSinglePost(board, thread, post);
  };

  var hasFiles = checkbox.parentNode.parentNode
      .getElementsByClassName('panelUploads')[0];

  hasFiles = hasFiles && hasFiles.children.length > 0;

  if (hasFiles) {

    extraMenu.appendChild(document.createElement('hr'));

    var unlinkButton = document.createElement('div');
    unlinkButton.innerHTML = 'Unlink Files';
    extraMenu.appendChild(unlinkButton);
    unlinkButton.onclick = function() {
      postingMenu.deleteSinglePost(board, thread, post, false, true);
    };

  }

  if (postingMenu.loggedIn
      && (postingMenu.globalRole < 4 || postingMenu.moddedBoards.indexOf(board) >= 0)) {
    postingMenu.setExtraMenuMod(checkbox, extraMenu, board, thread, post,
        hasFiles);
  }

};

postingMenu.setExtraMenu = function(checkbox) {

  var extraMenuButton = document.createElement('span');
  extraMenuButton.className = 'extraMenuButton glowOnHover coloredIcon';
  extraMenuButton.title = 'Post Menu';
  checkbox.parentNode.insertBefore(extraMenuButton, checkbox.nextSibling);

  extraMenuButton.onclick = function() {

    var rect = extraMenuButton.getBoundingClientRect();

    var previewOrigin = {
      x : rect.right + 10 + window.scrollX,
      y : rect.top + window.scrollY
    };

    var extraMenu = document.createElement('div');
    extraMenu.className = 'floatingMenu extraMenu';
    extraMenu.style.display = 'none';
    extraMenu.style.position = 'absolute';

    document.body.appendChild(extraMenu);

    extraMenu.style.left = previewOrigin.x + 'px';
    extraMenu.style.top = previewOrigin.y + 'px';
    extraMenu.style.display = 'inline';

    postingMenu.shownPostingMenu = extraMenu;

    postingMenu.buildMenu(checkbox, extraMenu);

  };

};

postingMenu.init();