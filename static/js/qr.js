//I didn't write this originally.
//I just tried to make it less shit.

var qrInfo = {}

function stopMoving() {

  if (!qrInfo.shouldMove) {
    return;
  }

  qrInfo.shouldMove = false
  lockedDrag = false

  var body = document.getElementsByTagName('body')[0];

  body.onmousedown = qrInfo.originalMouseDown;
  body.onmouseup = qrInfo.originalMouseUp;

}

function startMoving(evt) {

  if (qrInfo.shouldMove || (typeof (lockedDrag) != 'undefined') && lockedDrag) {
    return;
  }

  lockedDrag = true;

  var body = document.getElementsByTagName('body')[0];

  qrInfo.originalMouseDown = body.onmousedown;

  body.onmousedown = function() {
    return false;
  };

  qrInfo.originalMouseUp = body.onmouseup;

  body.onmouseup = function() {
    stopMoving();
  };

  qrInfo.shouldMove = true;

  evt = evt || window.event;

  var qrPanel = document.getElementById('quick-reply');

  var divTop = qrPanel.style.top;
  var divRight = qrPanel.style.right;

  divTop = +divTop.replace('px', '');
  divRight = +divRight.replace('px', '');

  qrInfo.diffX = (window.innerWidth - evt.clientX) - divRight;
  qrInfo.diffY = evt.clientY - divTop;

}

var move = function(evt) {

  if (!qrInfo.shouldMove) {
    return;
  }

  evt = evt || window.event;

  var newX = (window.innerWidth - evt.clientX) - qrInfo.diffX;
  var newY = evt.clientY - qrInfo.diffY;

  if (newX < 0) {
    newX = 0;
  }

  if (newY < 0) {
    newY = 0;
  }

  var qrPanel = document.getElementById('quick-reply');

  var upperXLimit = document.body.clientWidth - qrPanel.offsetWidth;

  if (newX > upperXLimit) {
    newX = upperXLimit;
  }

  var upperYLimit = window.innerHeight - qrPanel.offsetHeight;

  if (newY > upperYLimit) {
    newY = upperYLimit;
  }

  qrPanel.style.right = newX + 'px';
  qrPanel.style.top = newY + 'px';

};

function showQr(quote) {

  setQr();

  var body = document.getElementsByTagName('body')[0];

  body.addEventListener('mousemove', move);

  document.getElementById('qrbody').value += '>>' + quote + '\n';

  var selectedText = window.getSelection();
  if (selectedText != '') {
    document.getElementById('qrbody').value += '>' + selectedText + '\n';
    document.getElementById('fieldMessage').value += '>' + selectedText + '\n';
  }
}

function registerSync(source, destination, field, event) {

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

}

function removeQr() {
  document.getElementById('quick-reply').remove();

  var body = document.getElementsByTagName('body')[0];
  body.removeEventListener('mousemove', move);
}

function setQr() {

  if (document.getElementById('quick-reply')) {
    return;
  }

  var flags = document.getElementById('flagsDiv') ? true : false;

  var QRshowname = document.getElementById('fieldName') ? true : false;

  var textBoard = !document.getElementById('divUpload');

  var qrhtml = '<div id="quick-reply" style="right: 25px; top: 50px;">';
  qrhtml += '<div id="post-form-inner">';
  qrhtml += '<table class="post-table"><tbody> <tr><th colspan="2">';
  qrhtml += '<span class="handle" ';
  qrhtml += 'onmousedown=\'startMoving(event);\'>';
  qrhtml += '<a class="close-btn"';
  qrhtml += ' onclick=\'removeQr();\'></a>';
  qrhtml += 'Quick Reply</span></th> </tr>';

  if (QRshowname) {
    qrhtml += '<tr><td colspan="2"><input id="qrname" type="text"';
    qrhtml += ' maxlength="35" autocomplete="off" placeholder="Name"></td> </tr>';
  }

  qrhtml += '<tr><td colspan="2">';
  qrhtml += '<input id="qremail" type="text" maxlength="40" ';
  qrhtml += 'autocomplete="off" placeholder="Email">';
  qrhtml += '</td> </tr> ';

  qrhtml += '<tr><td colspan="2">';
  qrhtml += '<input id="qrsubject" type="text" maxlength="100"';
  qrhtml += 'autocomplete="off" placeholder="Subject ">';
  qrhtml += '</td>';
  qrhtml += '</tr>';

  qrhtml += '<tr><td colspan="2"><textarea id="qrbody" rows="5" placeholder="Comment">';
  qrhtml += '</textarea></td></tr> ';

  qrhtml += '<tr><td colspan="2">';
  qrhtml += '<input id="qrpassword" type="text" placeholder="Password"></td></tr>';

  var noFlagDiv = document.getElementById('noFlagDiv');

  if (noFlagDiv) {
    qrhtml += '<tr><td class="centered" colspan="2"><input type="checkbox" ';
    qrhtml += 'id="qrcheckboxNoFlag" class="postingCheckbox">';
    qrhtml += '<label for="qrcheckboxNoFlag" class="spoilerCheckbox">';
    qrhtml += 'Don\'t show location</label></td></tr>';
  }

  qrhtml += '<tr><td class="centered" colspan="2"><input type="checkbox" ';
  qrhtml += 'id="qralwaysUseBypassCheckBox" class="postingCheckbox">';
  qrhtml += '<label for="qralwaysUseBypassCheckBox" class="spoilerCheckbox">';
  qrhtml += 'Make sure I have a block bypass</label></td></tr>';

  if (flags) {
    qrhtml += '<tr><td colspan="2"><div id="qrFlagsDiv"></div></td></tr>';
  }

  if (!textBoard) {
    qrhtml += ' <tr><td colspan="2"><div class="dropzone" id="dropzoneQr">';
    qrhtml += 'Drag files to upload or<br> click here to select them</div>';
    qrhtml += '<div id="selectedDivQr"></div></td> </tr>';

    qrhtml += '<tr><td class="centered" colspan="2"><input type="checkbox" ';
    qrhtml += 'id="qrcheckboxSpoiler" class="postingCheckbox">';
    qrhtml += '<label for="qrcheckboxSpoiler" class="spoilerCheckbox">Spoiler</label></td> </tr>';

  }

  if (!hiddenCaptcha) {

    var parts = document.getElementById('captchaImage').src.split('/');

    var lastPart = '/' + parts[parts.length - 1];

    qrhtml += '<tr><td colspan="2"><img src="' + lastPart;
    qrhtml += '" class="captchaImage"/></td></tr>';

    qrhtml += '<tr><td colspan="2"><input type="button" onClick="reloadCaptcha()"';
    qrhtml += ' value="Reload"> <span class="captchaTimer"></span></td></tr>';

    qrhtml += '<tr><td><input type="text" class="captchaField" ';
    qrhtml += 'id="QRfieldCaptcha" placeholder="Answer"></td>';
    qrhtml += '<td><a href="/noCookieCaptcha.js" target="_blank" class="small">No cookies?</a></td></tr>';
  }

  qrhtml += '<tr> <td colspan="2" class="centered">';
  qrhtml += '<button accesskey="s" id="qrbutton" type="button" onclick="postReply()">Reply';
  qrhtml += '</td></tr>';

  qrhtml += '</tbody> </table></div></div>';

  var newDiv = document.createElement('div');
  newDiv.innerHTML = qrhtml;

  document.body.appendChild(newDiv.children[0]);

  registerSync('fieldEmail', 'qremail', 'value', 'input');
  registerSync('fieldSubject', 'qrsubject', 'value', 'input');
  registerSync('fieldMessage', 'qrbody', 'value', 'input');
  registerSync('fieldPostingPassword', 'qrpassword', 'value', 'input');
  registerSync('alwaysUseBypassCheckBox', 'qralwaysUseBypassCheckBox',
      'checked', 'change');

  if (noFlagDiv) {
    registerSync('checkboxNoFlag', 'qrcheckboxNoFlag', 'checked', 'change');
  }

  if (!textBoard) {
    registerSync('checkboxSpoiler', 'qrcheckboxSpoiler', 'checked', 'change');
    setDragAndDrop(true);

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

    registerSync('flagCombobox', 'qrFlagCombobox', 'value', 'change');

  }

  if (QRshowname) {
    registerSync('fieldName', 'qrname', 'value', 'input');
  }

  if (!hiddenCaptcha) {
    registerSync('fieldCaptcha', 'QRfieldCaptcha', 'value', 'input');
  }

}

function setQRReplyText(text) {

  var qrReplyButton = document.getElementById('qrbutton');

  if (qrReplyButton) {
    qrReplyButton.innerHTML = text;
  }

}

function clearQRAfterPosting() {

  var qrMessageField = document.getElementById('qrbody');

  if (!qrMessageField) {
    return;
  }

  document.getElementById('qrsubject').value = '';
  qrMessageField.value = '';

}

function setQRReplyEnabled(enabled) {

  var qrReplyButton = document.getElementById('qrbutton');

  if (qrReplyButton) {
    qrReplyButton.disabled = !enabled;
  }
}