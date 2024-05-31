var qr = {};

qr.init = function() {

  qr.setQr();

  var hash = window.location.hash.substring(1);

  if (hash.indexOf('q') === 0 && hash.length > 1) {

    hash = hash.substring(1);

    var post = document.getElementById(hash);

    if (post) {

      post.scrollIntoView();
      qr.showQr(hash);

      thread.markPost(hash);
    }

  } else if (hash.length > 0) {
    thread.markPost(hash);
  }

};

qr.removeQr = function() {
  qr.qrPanel.style.display = 'none';
};

qr.showQrBasic = function() {
  qr.qrPanel.style.display = 'block';
};

qr.showQr = function(quote) {

  qr.qrPanel.style.display = 'block';

  if (qr.qrPanel.getBoundingClientRect().top < 0) {
    qr.qrPanel.style.top = '25px';
  }

  document.getElementById('qrbody').value += '>>' + quote + '\n';

  var selectedText = window.getSelection();
  if (selectedText != '') {
    document.getElementById('qrbody').value += '>' + selectedText + '\n';
  }

  document.getElementById('fieldMessage').value = document
      .getElementById('qrbody').value;

  postCommon.updateCurrentChar();

};

qr.registerSync = function(source, destination, field, event) {

  var sourceElement = document.getElementById(source);
  var destinationElement = document.getElementById(destination);

  destinationElement[field] = sourceElement[field];

  sourceElement.addEventListener(event, function() {
    if (destinationElement) {
      destinationElement[field] = sourceElement[field];
    }
  });

  destinationElement.addEventListener(event, function() {
    sourceElement[field] = destinationElement[field];
  });

};

qr.setQr = function() {

  var flags = document.getElementById('flagsDiv') ? true : false;

  var QRshowname = document.getElementById('fieldName') ? true : false;

  var textBoard = !document.getElementById('divUpload');

  var qrhtml = '<div id="quick-reply" style="right: 25px; top: 50px;">';
  qrhtml += '<div id="post-form-inner">';
  qrhtml += '<div class="handle">';
  qrhtml += 'Quick Reply<a class="close-btn coloredIcon" style="float: right;"></a>';
  qrhtml += '</div>';
  qrhtml += '<form>'
  qrhtml += '<div class="user-info" style="display: -webkit-flex; display: flex; -webkit-flex-direction: row; flex-direction: row; width: 100%;">'
  if (QRshowname) {
    qrhtml += '<input id="qrname" type="text" maxlength="35" autocomplete="off" placeholder="Name" style="margin: 0px;">';
  }
    qrhtml += '<input id="qrsubject" type="text" maxlength="100" autocomplete="off" placeholder="Subject" style="margin: 0px;">';
  
  qrhtml += '</div>';

  qrhtml += '<div class="textarea" style="display: flex;"><textarea id="qrbody" placeholder="Comment" style="height: 9em; margin: 0px;"></textarea></div>';
  if (!api.hiddenCaptcha) {
    qrhtml += '<div class="captchaBox" style="position: relative;"><div class="captchaID" style="display: -webkit-flex; display: flex; -webkit-flex-direction: row; flex-direction: row; width: 100%;">';
    qrhtml += '<input class="reloadCaptchaButton" type="button" value="Get Captcha">';
    qrhtml += '<input type="text" class="captchaField" id="QRfieldCaptcha" placeholder="Answer"></div>';
    var parts = document.getElementsByClassName('captchaImage')[0].src
        .split('/');

    var lastPart = '/' + parts[parts.length - 1];

    qrhtml += '<div id="captchaDiv"><img src="' + lastPart +'" class="captchaImage"/><a href="/noCookieCaptcha.js" target="_blank" class="small">No cookies?</a> <span class="captchaTimer"></span></div>';
  }
 
  if (!textBoard) {
    qrhtml += '<div class="dropzone" id="dropzoneQr" style="display: -webkit-flex; display: flex; -webkit-flex-direction: row; flex-direction: row;">Files</div>'
    qrhtml += '<div id="selectedDivQr"></div>';
    qrhtml += '<tr><td class="centered" colspan="2"><input type="checkbox" ';
    qrhtml += 'id="qrcheckboxSpoiler" class="postingCheckbox">';
    qrhtml += '<label for="qrcheckboxSpoiler" class="spoilerCheckbox">Spoiler</label>';

  }

  qrhtml += '<div class="user-info" style="display: -webkit-flex; display: flex; -webkit-flex-direction: row; flex-direction: row; width: 100%;">'
  qrhtml += '<button accesskey="s" id="qrbutton" type="button">Submit</button>';
  qrhtml += '<div id="qrFormMore">Extra</div>';

  qrhtml += '<div class="hidden" id="qrExtra">';

  qrhtml += '<input id="qremail" type="text" maxlength="40" ';
  qrhtml += 'autocomplete="off" placeholder="Email">';

  qrhtml += '<input id="qrpassword" type="password" placeholder="Password">';

  if (flags) {
    qrhtml += '<tr><td colspan="2"><div id="qrFlagsDiv"></div>';
  }

  var noFlagDiv = document.getElementById('noFlagDiv');

  if (noFlagDiv) {
    qrhtml += '<input type="checkbox" ';
    qrhtml += 'id="qrcheckboxNoFlag" class="postingCheckbox">';
    qrhtml += '<label for="qrcheckboxNoFlag" class="spoilerCheckbox">';
    qrhtml += 'Don\'t show location</label>';
  }

  qrhtml += '<input type="checkbox" ';
  qrhtml += 'id="qralwaysUseBypassCheckBox" class="postingCheckbox">';
  qrhtml += '<label for="qralwaysUseBypassCheckBox" class="spoilerCheckbox">';
  qrhtml += 'Make sure I have a block bypass</label>';
  

  qr.qrPanel = document.createElement('div');
  qr.qrPanel.innerHTML = qrhtml;


  qr.qrPanel.getElementsByClassName('close-btn')[0].onclick = qr.removeQr;

  var reloadCaptchaButton = qr.qrPanel
      .getElementsByClassName('reloadCaptchaButton')[0];

  if (reloadCaptchaButton) {
    reloadCaptchaButton.onclick = captchaUtils.reloadCaptcha;
  }

  qr.qrPanel = qr.qrPanel.children[0];

  draggable.setDraggable(qr.qrPanel, qr.qrPanel
      .getElementsByClassName('handle')[0]);

  document.body.appendChild(qr.qrPanel);
  document.getElementById('qrbutton').onclick = thread.postReply;

  var extra = document.getElementById('qrExtra');
  document.getElementById('qrFormMore').onclick = function() {
    extra.classList.toggle('hidden');
  };

  qr.registerSync('fieldEmail', 'qremail', 'value', 'input');
  qr.registerSync('fieldSubject', 'qrsubject', 'value', 'input');
  qr.registerSync('fieldMessage', 'qrbody', 'value', 'input');
  document.getElementById('qrbody').addEventListener('input',
      postCommon.updateCurrentChar);
  qr.registerSync('fieldPostingPassword', 'qrpassword', 'value', 'input');
  qr.registerSync('alwaysUseBypassCheckBox', 'qralwaysUseBypassCheckBox',
      'checked', 'change');

  if (noFlagDiv) {
    qr.registerSync('checkboxNoFlag', 'qrcheckboxNoFlag', 'checked', 'change');
  }

  if (!textBoard) {

    if (api.mobile) {
      var fileBodyBody = document.getElementById('filesBody');
      /*document.getElementById('qrFilesButton').onclick = function() {
        fileBodyBody.classList.toggle('hidden');
      };*/

    }

    qr.registerSync('checkboxSpoiler', 'qrcheckboxSpoiler', 'checked',
            'change');
    postCommon.setDragAndDrop(true);

    for (var i = 0; i < selectedDiv.childNodes.length; i++) {
      var originalCell = selectedDiv.childNodes[i];
      var clonedCell = originalCell.cloneNode(true);

      clonedCell.getElementsByClassName('removeButton')[0].onclick = originalCell
          .getElementsByClassName('removeButton')[0].onclick;

      selectedDivQr.appendChild(clonedCell);
    }
  }

  if (flags) {

    document.getElementById('qrFlagsDiv').innerHTML = document
        .getElementById('flagsDiv').innerHTML.replace('flagCombobox',
        'qrFlagCombobox');

    qrFlagCombo = document.getElementById('qrFlagCombobox');

    postCommon.setFlagPreviews(qrFlagCombo)

    qr.registerSync('flagCombobox', 'qrFlagCombobox', 'value', 'change');

  }

  if (QRshowname) {
    console.log("showName")
    qr.registerSync('fieldName', 'qrname', 'value', 'input');
  }
  else {
    console.log("DontName")
  }

  if (!api.hiddenCaptcha) {

    if (api.mobile) {
      var captchaBody = document.getElementById('captchaBody');
      document.getElementById('qrCaptchaButton').onclick = function() {
        captchaBody.classList.toggle('hidden');
      };
    }

    qr.registerSync('fieldCaptcha', 'QRfieldCaptcha', 'value', 'input');
  }

};

qr.setQRReplyText = function(text) {

  var qrReplyButton = document.getElementById('qrbutton');

  if (qrReplyButton) {
    qrReplyButton.innerHTML = text;
  }

};

qr.clearQRAfterPosting = function() {

  var qrMessageField = document.getElementById('qrbody');

  if (!qrMessageField) {
    return;
  }

  document.getElementById('qrsubject').value = '';
  qrMessageField.value = '';

};

qr.setQRReplyEnabled = function(enabled) {

  var qrReplyButton = document.getElementById('qrbutton');

  if (qrReplyButton) {
    qrReplyButton.disabled = !enabled;
  }

};

qr.init();