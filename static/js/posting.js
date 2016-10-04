function processLinkForEmbed(link) {

  if (link.href.indexOf('youtube.com/watch') < 0) {
    return;
  }

  var videoId = link.href.split('v=')[1];

  if (!videoId) {
    return;
  }

  var ampersandPosition = videoId.indexOf('&');
  videoId = videoId.substring(0, ampersandPosition < 0 ? videoId.length
      : ampersandPosition);

  link.style.display = 'inline';

  var finalHTML = embedHTML.replace('{$id}', videoId);

  var div = document.createElement('div');
  div.innerHTML = finalHTML;

  div.style.display = 'none';

  var embedButton = document.createElement('span');

  embedButton.innerHTML = '[Embed]';
  embedButton.setAttribute('class', 'embedButton');

  embedButton.onclick = function() {

    var embedDisplay = div.style.display;

    div.style.display = link.style.display;
    link.style.display = embedDisplay;

    embedButton.innerHTML = embedDisplay === 'none' ? '[Remove embed]'
        : '[Embed]';

  };

  link.parentNode.insertBefore(embedButton, link.nextSibling);
  link.parentNode.insertBefore(div, link.nextSibling);

}

if (!DISABLE_JS) {

  if (document.getElementById('deleteJsButton')) {
    document.getElementById('deleteJsButton').style.display = 'inline';
    document.getElementById('reportJsButton').style.display = 'inline';
    document.getElementById('reportFormButton').style.display = 'none';
    document.getElementById('deleteFormButton').style.display = 'none';

    if (document.getElementById('divMod')) {

      document.getElementById('banJsButton').style.display = 'inline';
      document.getElementById('spoilJsButton').style.display = 'inline';
      document.getElementById('ipDeletionJsButton').style.display = 'inline';

      document.getElementById('inputIpDelete').style.display = 'none';
      document.getElementById('inputBan').style.display = 'none';
      document.getElementById('inputSpoil').style.display = 'none';
    }

  }

  var messages = document.getElementsByClassName('divMessage');

  var embedHTML = '<iframe width="400" height="305" src="https://www.youtube.com/embed/{$id}" frameborder="0" allowfullscreen></iframe>';

  for (var i = 0; i < messages.length; i++) {

    var links = messages[i].getElementsByTagName('a');

    for (var j = 0; j < links.length; j++) {
      processLinkForEmbed(links[j]);
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
  var typedDuration = document.getElementById('fieldDuration').value.trim();
  var typedMessage = document.getElementById('fieldbanMessage').value.trim();
  var banType = document.getElementById('comboBoxBanTypes').selectedIndex;

  var toBan = getSelectedContent();

  apiRequest('banUsers', {
    reason : typedReason,
    captcha : captcha,
    banType : banType,
    duration : typedDuration,
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

  if (!document.getElementsByClassName('panelRange').length) {
    applyBans();
    return;
  }

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

    apiRequest('solveCaptcha', {

      captchaId : parsedCookies.captchaid,
      answer : typedCaptcha
    }, function solvedCaptcha(status, data) {

      applyBans(parsedCookies.captchaid);

      reloadCaptcha();
    });
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

      alert(data.removedThreads + ' threads and ' + data.removedPosts
          + ' posts were successfully deleted.');

      window.location.pathname = redirect;

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function deleteFromIpOnBoard() {

  var selected = getSelectedContent();

  var redirect = '/' + selected[0].board + '/';

  apiRequest('deleteFromIpOnBoard', {
    postings : selected
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      alert('Content deleted');

      window.location.pathname = redirect;

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}
