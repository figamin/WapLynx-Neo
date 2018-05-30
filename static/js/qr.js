//I didn't write this originally.
//I just tried to make it less shit.

var qrFlagCombo;
var qrPanel;

function removeQr() {
  qrPanel.style.display = 'none';
}

function showQr(link, quote) {

  qrPanel.style.display = 'block';

  var rect = link.getBoundingClientRect();

  var previewOrigin = {
    x : rect.right + 10 + window.scrollX,
    y : rect.top + window.scrollY
  };

  qrPanel.style.left = (previewOrigin.x + 35) + 'px';
  qrPanel.style.top = (previewOrigin.y - 5) + 'px';

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

function setQr() {

  var flags = document.getElementById('flagsDiv') ? true : false;

  var QRshowname = document.getElementById('fieldName') ? true : false;

  var textBoard = !document.getElementById('divUpload');

  var qrhtml = '<div id="quick-reply" style="right: 25px; top: 50px;">';
  qrhtml += '<div id="post-form-inner">';
  qrhtml += '<table class="post-table"><tbody> <tr><th colspan="2">';
  qrhtml += '<span class="handle">';
  qrhtml += '<a class="close-btn coloredIcon"';
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

  qrPanel = document.createElement('div');
  qrPanel.innerHTML = qrhtml;
  qrPanel = qrPanel.children[0];

  setDraggable(qrPanel, qrPanel.getElementsByClassName('handle')[0]);

  document.body.appendChild(qrPanel);

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

    qrFlagCombo = document.getElementById('qrFlagCombobox');

    setFlagPreviews(qrFlagCombo)

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

if (!DISABLE_JS) {
  setQr();

  var hash = window.location.hash.substring(1);

  if (hash.indexOf('q') === 0 && hash.length > 1) {

    hash = hash.substring(1);

    var post = document.getElementById(hash);

    if (post) {

      post.scrollIntoView();
      showQr(post.getElementsByClassName('linkQuote')[0], hash);

      markPost(hash);
    }

  } else if (hash.length > 0) {
    markPost(hash);
  }

}