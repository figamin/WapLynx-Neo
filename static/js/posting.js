if (!DISABLE_JS) {

  if (document.getElementById('deleteJsButton')) {
    document.getElementById('deleteJsButton').style.display = 'inline';
    document.getElementById('reportJsButton').style.display = 'inline';
    document.getElementById('reportFormButton').style.display = 'none';
    document.getElementById('deleteFormButton').style.display = 'none';

    if (!board && document.getElementById('divMod')) {

      document.getElementById('banJsButton').style.display = 'inline';
      document.getElementById('spoilJsButton').style.display = 'inline';

      document.getElementById('inputBan').style.display = 'none';
      document.getElementById('inputSpoil').style.display = 'none';
    }

  }

}

function spoilFiles() {

  apiRequest('spoilFiles', {
    postings : getSelectedContent()
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      alert('Files spoiled');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function applyBans(captcha) {
  var typedReason = document.getElementById('reportFieldReason').value.trim();
  var typedExpiration = document.getElementById('fieldExpiration').value.trim();
  var typedMessage = document.getElementById('fieldbanMessage').value.trim();
  var expiration = Date.parse(typedExpiration || '');
  var range = document.getElementById('checkboxRange').checked;

  if (isNaN(expiration) && !range) {
    alert('Invalid expiration');

    return;
  }

  var toBan = getSelectedContent();

  apiRequest('banUsers', {
    reason : typedReason,
    captcha : captcha,
    range : range,
    expiration : typedExpiration,
    banMessage : typedMessage,
    global : document.getElementById('checkboxGlobal').checked,
    postings : toBan
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      alert('Bans applied');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
}

function banPosts() {

  var typedCaptcha = document.getElementById('fieldCaptchaReport').value.trim();

  if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
    alert('Captchas are exactly 6 (24 if no cookies) characters long.');
    return;
  } else if (/\W/.test(typedCaptcha)) {
    alert('Invalid captcha.');
    return;
  }

  if (typedCaptcha.length == 24) {
    applyBans(typedCaptcha);
  } else {
    var parsedCookies = getCookies();

    var captchaSolvingCallback = function(status, data) {
      applyBans(parsedCookies.captchaid);
    }

    captchaSolvingCallback.stop = function() {
      reloadCaptcha();
    }

    apiRequest('solveCaptcha', {

      captchaId : parsedCookies.captchaid,
      answer : typedCaptcha
    }, captchaSolvingCallback);
  }

}

function getSelectedContent() {
  var selectedContent = [];

  var checkBoxes = document.getElementsByClassName('deletionCheckBox');

  for (var i = 0; i < checkBoxes.length; i++) {
    var checkBox = checkBoxes[i];

    if (checkBox.checked) {

      var splitName = checkBox.name.split('-');

      var toAdd = {
        board : splitName[0],
        thread : splitName[1]
      };

      if (splitName.length > 2) {
        toAdd.post = splitName[2];
      }

      selectedContent.push(toAdd);

    }
  }

  return selectedContent;

}

var reportCallback = function(status, data) {

  if (status === 'ok') {

    alert('Content reported');

  } else {
    alert(status + ': ' + JSON.stringify(data));
  }
}

reportCallback.stop = function() {
  reloadCaptcha()
};

function reportPosts() {

  var typedReason = document.getElementById('reportFieldReason').value.trim();
  var typedCaptcha = document.getElementById('fieldCaptchaReport').value.trim();

  var toReport = getSelectedContent();

  if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
    alert('Captchas are exactly 6 (24 if no cookies) characters long.');
    return;
  } else if (/\W/.test(typedCaptcha)) {
    alert('Invalid captcha.');
    return;
  }

  apiRequest('reportContent', {
    reason : typedReason,
    captcha : typedCaptcha,
    global : document.getElementById('checkboxGlobal').checked,
    postings : toReport
  }, reportCallback);
}

function deletePosts() {

  var typedPassword = document.getElementById('deletionFieldPassword').value
      .trim();

  var toDelete = getSelectedContent();

  if (!toDelete.length) {
    alert('Nothing selected');
    return;
  }

  var redirect = '/' + toDelete[0].board + '/';

  apiRequest('deleteContent', {
    password : typedPassword,
    deleteMedia : document.getElementById('checkboxMediaDeletion').checked,
    deleteUploads : document.getElementById('checkboxOnlyFiles').checked,
    postings : toDelete
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      alert('Content deleted');

      window.location.pathname = redirect;

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}
