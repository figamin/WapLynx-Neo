var board = true;
var originalButtonText;

var identifierElement = document.getElementById('boardIdentifier');
var boardUri = identifierElement ? identifierElement.value : null;

if (!boardUri) {

  var altIdentifierElement = document.getElementById('labelBoard');

  boardUri = altIdentifierElement ? altIdentifierElement.innerHTML.replace(
      /\//g, '') : null;

}

var hiddenCaptcha;
var messageLimit;

if (!DISABLE_JS) {

  hiddenCaptcha = !document.getElementById('captchaDiv');

  if (identifierElement) {

    messageLimit = +document.getElementById('labelMessageLength').innerHTML;

    var postButton = document.getElementById('jsButton');
    postButton.style.display = 'inline';
    postButton.disabled = false;
    document.getElementById('formButton').style.display = 'none';

    if (!hiddenCaptcha) {
      document.getElementById('reloadCaptchaButton').style.display = 'inline';
    }

  }

  if (document.getElementById('reloadCaptchaButtonReport')) {
    document.getElementById('reloadCaptchaButtonReport').style.display = 'inline';
  }

}

var postCallback = function requestComplete(status, data) {

  if (status === 'ok') {

    storeUsedPostingPassword(boardUri, data);

    window.location.pathname = '/' + boardUri + '/res/' + data + '.html';
  } else {
    alert(status + ': ' + JSON.stringify(data));
  }
};

postCallback.stop = function() {
  postButton.innerHTML = originalButtonText;
  postButton.disabled = false;
};

postCallback.progress = function(info) {

  if (info.lengthComputable) {
    var newText = 'Uploading ' + Math.floor((info.loaded / info.total) * 100)
        + '%';
    postButton.innerHTML = newText;
  }
};

function sendThreadData(files, captchaId) {

  var hiddenFlags = !document.getElementById('flagsDiv');

  if (!hiddenFlags) {
    var combo = document.getElementById('flagCombobox');

    var selectedFlag = combo.options[combo.selectedIndex].value;

    savedSelectedFlag(selectedFlag);
  }

  var forcedAnon = !document.getElementById('fieldName');

  if (!forcedAnon) {
    var typedName = document.getElementById('fieldName').value.trim();

    localStorage.setItem('name', typedName);

  }

  var typedEmail = document.getElementById('fieldEmail').value.trim();
  var typedMessage = document.getElementById('fieldMessage').value.trim();
  var typedSubject = document.getElementById('fieldSubject').value.trim();
  var typedPassword = document.getElementById('fieldPostingPassword').value
      .trim();

  if (!typedMessage.length) {
    alert('A message is mandatory.');
    return;
  } else if (!forcedAnon && typedName.length > 32) {
    alert('Name is too long, keep it under 32 characters.');
    return;
  } else if (typedMessage.length > messageLimit) {
    alert('Message is too long, keep it under ' + messageLimit + ' characters.');
    return;
  } else if (typedEmail.length > 64) {
    alert('Email is too long, keep it under 64 characters.');
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

  originalButtonText = postButton.innerHTML;
  postButton.innerHTML = 'Uploading 0%';
  postButton.disabled = true;

  var spoilerCheckBox = document.getElementById('checkboxSpoiler');

  var noFlagCheckBox = document.getElementById('checkboxNoFlag');

  apiRequest('newThread', {
    name : forcedAnon ? null : typedName,
    flag : hiddenFlags ? null : selectedFlag,
    captcha : captchaId,
    password : typedPassword,
    noFlag : noFlagCheckBox ? noFlagCheckBox.checked : false,
    spoiler : spoilerCheckBox ? spoilerCheckBox.checked : false,
    subject : typedSubject,
    message : typedMessage,
    email : typedEmail,
    files : files,
    boardUri : boardUri
  }, postCallback);

}

function processFilesToPost(captchaId) {

  getFilestToUpload(function gotFiles(files) {
    sendThreadData(files, captchaId);
  });

}

function processThreadRequest() {

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

};

function postThread() {

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
            processThreadRequest();
          });

        } else {
          processThreadRequest();
        }

      });

}
