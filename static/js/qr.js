//I didn't write this originally.
//I just tried to make it less shit.

var shouldMove = false;
var referenceContainer;
var diffX;
var eWi;
var eHe;
var cWi;
var cHe;
var divid;

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

  diffX = (window.innerWidth - posX) - divLeft, diffY = posY - divTop;

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

function toggleQr() {
  if (isQrEnabled() == true) {
    console.log('Disabling QR');
    localStorage.setItem("disableqr", 'true');
  } else {
    console.log('Enabling QR');
    localStorage.removeItem("disableqr");
  }
}

function isQrEnabled() {
  return localStorage.getItem("disableqr") ? false : true;
}

function showQr(quote) {

  if (isQrEnabled()) {
    setQr();
  } else {
    return;
  }

  if (document.getElementById('quick-reply') !== null) {
    document.getElementById('qrbody').value += '>>' + quote + '\n';
  }

  var selectedText = window.getSelection();
  if (selectedText != '') {
    document.getElementById('qrbody').value += '>' + selectedText + '\n';
  }
}

function setQr() {

  if (document.getElementById('quick-reply')) {
    return;
  }

  var captcha = false;
  var flags = false;

  if (document.getElementById('captchaDiv')) {
    captcha = true;
  }

  if (document.getElementById('flagsDiv')) {
    flags = true;
  }

  var QRshowname = document.getElementById('fieldName');
  var boardName = document.getElementById('boardIdentifier').value;
  var threadNum = document.getElementById('threadIdentifier').value;

  var qrhtml = '<div id="quick-reply" style="right: 25px; top: 50px;">';
  qrhtml += '<div id="post-form-inner">';
  qrhtml += '<table class="post-table"><tbody> <tr><th colspan="2">';
  qrhtml += '<span class="handle" ';
  qrhtml += 'onmousedown=\'startMoving(event);\' ';
  qrhtml += 'onmouseup=\'shouldMove = false\'><a class="close-btn"';
  qrhtml += ' onclick="document.getElementById(\'quick-reply\').remove();">×</a>';
  qrhtml += 'Quick Reply</span></th> </tr>';

  if (QRshowname) {
    qrhtml += '<tr><td colspan="2"><input id="qrname" type="text" name="name"';
    qrhtml += ' maxlength="35" autocomplete="off" placeholder="Name"></td> </tr>';
  }

  qrhtml += '<tr><td colspan="2">';
  qrhtml += '<input id="qremail" type="text" name="email" maxlength="40" autocomplete="off" placeholder="Email">';
  qrhtml += '</td> </tr> <tr><td>';
  qrhtml += '<input id="qrsubject" type="text" name="subject" maxlength="100" autocomplete="off" placeholder="Subject ">';
  qrhtml += '</td><td class="submit">';
  qrhtml += '<button accesskey="s" id="qrbutton" type="button" onclick="postReply()" name="post" >Reply</td>';
  qrhtml += ' </tr> <tr><td colspan="2"><textarea name="message" id="qrbody" rows="5" placeholder="Comment">';
  qrhtml += '</textarea></td></tr> ';

  qrhtml += '<tr><td >';
  qrhtml += '<input id="qrpassword" type="text" name="password" placeholder="Password"></td> <td >';
  qrhtml += '<input type="checkbox" name="spoiler" id="qrcheckboxSpoiler"> <label for="checkboxSpoiler" class="spoilerCheckbox">Spoiler</label>';
  qrhtml += '</td> </tr>';

  if (flags) {
    qrhtml += '<tr><td colspan="2"><div id="qrFlagsDiv"></div></td></tr>';
  }

  qrhtml += ' <tr><td colspan="2"><div class="dropzone" id="dropzoneQr">';
  qrhtml += 'Drag files to upload or<br> click here to select them</div>';
  qrhtml += '<div id="selectedDivQr"></div></td> </tr> <tr><td colspan="2"> ';
  qrhtml += '</td> </tr>';

  if (captcha) {
    qrhtml += '<tr><td colspan="2"><img src="/captcha.js" class="captchaImage"/></td></tr>';
    qrhtml += '<tr><td colspan="2"><input type="button" onClick="reloadCaptcha()" value="Reload"> <span class="captchaTimer"></span></td></tr>';
    qrhtml += '<tr><td><input name="captcha" type="text" id="QRfieldCaptcha" placeholder="Answer"></td>';
    qrhtml += '<td><a href="/noCookieCaptcha.js" target="_blank" class="small">No cookies?</a></td></tr>';
  }

  qrhtml += '</tbody> </table></div></div>';

  var newDiv = document.createElement('div');
  newDiv.innerHTML = qrhtml;

  document.body.appendChild(newDiv.children[0]);

  divid = document.getElementById('quick-reply')

  if (flags) {

    document.getElementById('qrFlagsDiv').innerHTML = document
        .getElementById('flagsDiv').innerHTML.replace('flagCombobox',
        'qrFlagCombobox');

    var qrFlags = document.getElementById('qrFlagCombobox');
    var defaultFlags = document.getElementById('flagCombobox');

    qrFlags.value = defaultFlags.value;

    defaultFlags.addEventListener('change', function() {
      qrFlags.value = defaultFlags.value;
    });

    qrFlags.addEventListener('change', function() {
      defaultFlags.value = qrFlags.value;
    });

  }

  // Copy current vars
  if (QRshowname) {

    var qrNameField = document.getElementById('qrname');
    var defaultNameField = document.getElementById('fieldName');

    qrNameField.value = defaultNameField.value;

    defaultNameField.addEventListener('input', function(e) {
      qrNameField.value = defaultNameField.value;
    });

    qrNameField.addEventListener('input', function(e) {
      defaultNameField.value = qrNameField.value;
    });
  }

  document.getElementById('qremail').value = document
      .getElementById('fieldEmail').value;
  document.getElementById('qrsubject').value = document
      .getElementById('fieldSubject').value;
  document.getElementById('qrbody').value = document
      .getElementById('fieldMessage').value;
  document.getElementById('qrpassword').value = document
      .getElementById('fieldPostingPassword').value;
  document.getElementById('qrcheckboxSpoiler').checked = document
      .getElementById('checkboxSpoiler').checked;

  // Sync it

  document.getElementById('fieldEmail').addEventListener(
      'input',
      function(e) {
        document.getElementById('qremail').value = document
            .getElementById('fieldEmail').value;
      });

  document.getElementById('fieldSubject').addEventListener(
      'input',
      function(e) {
        document.getElementById('qrsubject').value = document
            .getElementById('fieldSubject').value;
      });

  document.getElementById('fieldMessage').addEventListener(
      'input',
      function(e) {
        document.getElementById('qrbody').value = document
            .getElementById('fieldMessage').value;
      });

  document.getElementById('fieldPostingPassword').addEventListener(
      'input',
      function(e) {
        document.getElementById('qrpassword').value = document
            .getElementById('fieldPostingPassword').value;
      });

  document.getElementById('checkboxSpoiler').addEventListener(
      'change',
      function(e) {
        document.getElementById('qrcheckboxSpoiler').checked = document
            .getElementById('checkboxSpoiler').checked;
      });

  if (captcha) {
    // Copy current vars

    var qrCaptchaField = document.getElementById('QRfieldCaptcha');
    var defaultCaptchaField = document.getElementById('fieldCaptcha');

    qrCaptchaField.value = defaultCaptchaField.value;

    // Sync it
    defaultCaptchaField.addEventListener('input', function(e) {
      qrCaptchaField.value = defaultCaptchaField.value;
    });

    // And the other way around
    qrCaptchaField.addEventListener('input', function(e) {
      defaultCaptchaField.value = qrCaptchaField.value;
    });
  }

  // And the other way around

  document.getElementById('qremail').addEventListener(
      'input',
      function(e) {
        document.getElementById('fieldEmail').value = document
            .getElementById('qremail').value;
      });

  document.getElementById('qrsubject').addEventListener(
      'input',
      function(e) {
        document.getElementById('fieldSubject').value = document
            .getElementById('qrsubject').value;
      });

  document.getElementById('qrbody').addEventListener(
      'input',
      function(e) {
        document.getElementById('fieldMessage').value = document
            .getElementById('qrbody').value;
      });

  document.getElementById('qrpassword').addEventListener(
      'input',
      function(e) {
        document.getElementById('fieldPostingPassword').value = document
            .getElementById('qrpassword').value;
      });

  document.getElementById('qrcheckboxSpoiler').addEventListener(
      'change',
      function(e) {
        document.getElementById('checkboxSpoiler').checked = document
            .getElementById('qrcheckboxSpoiler').checked;
      });

  setDragAndDrop(true);

  for (var i = 0; i < selectedDiv.childNodes.length; i++) {
    var originalCell = selectedDiv.childNodes[i];
    var clonedCell = originalCell.cloneNode(true);

    clonedCell.getElementsByClassName('removeButton')[0].onclick = originalCell
        .getElementsByClassName('removeButton')[0].onclick;

    selectedDivQr.appendChild(clonedCell);
  }

}

function setQRReplyText(text) {

  var qrReplyButton = document.getElementById('qrbutton');

  if (qrReplyButton) {
    qrReplyButton.innerHTML = text;
  }

}