//I didn't write this originally.
//I just tried to make it less shit.

var shouldMove = false;
var referenceContainer;
var diffX;
var diffY;
var eWi;
var eHe;
var cWi;
var cHe;
var divid;

document.onmousedown = function() {
  return !shouldMove;
};

function startMoving(evt) {

  shouldMove = true;

  evt = evt || window.event;

  var posX = evt.clientX;
  var posY = evt.clientY;
  var divTop = divid.style.top;
  var divLeft = divid.style.right;
  eWi = parseInt(divid.style.width);
  eHe = parseInt(divid.style.height);
  cWi = parseInt(document.getElementById('threadList').style.width);
  cHe = parseInt(document.getElementById('threadList').style.height);

  divTop = divTop.replace('px', '');
  divLeft = divLeft.replace('px', '');

  diffX = (window.innerWidth - posX) - divLeft;
  diffY = posY - divTop;

}

document.onmousemove = function(evt) {
  if (!shouldMove) {
    return;
  }

  evt = evt || window.event;

  var posX = evt.clientX;
  var posY = evt.clientY;
  var aX = (window.innerWidth - posX) - diffX;
  var aY = posY - diffY;

  if (aX < 0) {
    aX = 0;

  }

  if (aY < 0) {
    aY = 0;
  }

  if (aX + eWi > cWi) {
    aX = cWi - eWi;
  }

  if (aY + eHe > cHe) {
    aY = cHe - eHe;
  }

  divid.style.right = aX + 'px';
  divid.style.top = aY + 'px';

}

function showQr(quote) {

  setQr();

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
  qrhtml += 'onmousedown=\'startMoving(event);\' ';
  qrhtml += 'onmouseup=\'shouldMove = false\'><a class="close-btn"';
  qrhtml += ' onclick="document.getElementById(\'quick-reply\').remove();"></a>';
  qrhtml += 'Quick Reply</span></th> </tr>';

  if (QRshowname) {
    qrhtml += '<tr><td colspan="2"><input id="qrname" type="text" name="name"';
    qrhtml += ' maxlength="35" autocomplete="off" placeholder="Name"></td> </tr>';
  }

  qrhtml += '<tr><td colspan="2">';
  qrhtml += '<input id="qremail" type="text" name="email" maxlength="40" ';
  qrhtml += 'autocomplete="off" placeholder="Email">';
  qrhtml += '</td> </tr> ';

  qrhtml += '<tr><td colspan="2">';
  qrhtml += '<input id="qrsubject" type="text" name="subject" maxlength="100"';
  qrhtml += 'autocomplete="off" placeholder="Subject ">';
  qrhtml += '</td>';
  qrhtml += '</tr>';

  qrhtml += '<tr><td colspan="2"><textarea name="message" id="qrbody" rows="5" placeholder="Comment">';
  qrhtml += '</textarea></td></tr> ';

  qrhtml += '<tr><td colspan="2">';
  qrhtml += '<input id="qrpassword" type="text" name="password" placeholder="Password"></td></tr>';

  if (flags) {
    qrhtml += '<tr><td colspan="2"><div id="qrFlagsDiv"></div></td></tr>';
  }

  if (!textBoard) {
    qrhtml += ' <tr><td colspan="2"><div class="dropzone" id="dropzoneQr">';
    qrhtml += 'Drag files to upload or<br> click here to select them</div>';
    qrhtml += '<div id="selectedDivQr"></div></td> </tr>';

    qrhtml += '<tr><td class="centered" colspan="2"><input type="checkbox" ';
    qrhtml += 'name="spoiler" id="qrcheckboxSpoiler">';
    qrhtml += '<label for="qrcheckboxSpoiler" class="spoilerCheckbox">Spoiler</label></td> </tr>';

  }

  if (!hiddenCaptcha) {
    qrhtml += '<tr><td colspan="2"><img src="/captcha.js" class="captchaImage"/></td></tr>';

    qrhtml += '<tr><td colspan="2"><input type="button" onClick="reloadCaptcha()"';
    qrhtml += ' value="Reload"> <span class="captchaTimer"></span></td></tr>';

    qrhtml += '<tr><td><input name="captcha" type="text" class="captchaField" ';
    qrhtml += 'id="QRfieldCaptcha" placeholder="Answer"></td>';
    qrhtml += '<td><a href="/noCookieCaptcha.js" target="_blank" class="small">No cookies?</a></td></tr>';
  }

  qrhtml += '<tr> <td colspan="2" class="centered">';
  qrhtml += '<button accesskey="s" id="qrbutton" type="button" onclick="postReply()" name="post">Reply';
  qrhtml += '</td></tr>';

  qrhtml += '</tbody> </table></div></div>';

  var newDiv = document.createElement('div');
  newDiv.innerHTML = qrhtml;

  document.body.appendChild(newDiv.children[0]);

  divid = document.getElementById('quick-reply')

  registerSync('fieldEmail', 'qremail', 'value', 'input');
  registerSync('fieldSubject', 'qrsubject', 'value', 'input');
  registerSync('fieldMessage', 'qrbody', 'value', 'input');
  registerSync('fieldPostingPassword', 'qrpassword', 'value', 'input');

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