var boardUri;

if (!DISABLE_JS) {

  document.getElementById('reloadCaptchaButton').style.display = 'inline';

  var boardIdentifier = document.getElementById('boardIdentifier');

  if (boardIdentifier) {
    boardUri = boardIdentifier.value;
  }

  document.getElementById('createFormButton').style.display = 'none';
  document.getElementById('createJsButton').style.display = 'inline';

  var rangeBansDiv = document.getElementById('rangeBansDiv');

  for (var j = 0; j < rangeBansDiv.childNodes.length; j++) {
    processRangeBanCell(rangeBansDiv.childNodes[j]);
  }
}

function processRangeBanCell(cell) {

  var button = cell.getElementsByClassName('liftJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    liftBan(cell.getElementsByClassName('idIdentifier')[0].value);
  };

  cell.getElementsByClassName('liftFormButton')[0].style.display = 'none';

}

function liftBan(ban) {
  apiRequest('liftBan', {
    banId : ban
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
}

function placeRangeBan() {

  var typedCaptcha = document.getElementById('fieldCaptcha').value.trim();

  if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
    alert('Captchas are exactly 6 (24 if no cookies) characters long.');
    return;
  } else if (/\W/.test(typedCaptcha)) {
    alert('Invalid captcha.');
    return;
  }

  var typedRange = document.getElementById('rangeField').value.trim();

  var parameters = {
    captcha : typedCaptcha,
    range : typedRange
  };

  if (boardUri) {
    parameters.boardUri = boardUri;
  }

  apiRequest('placeRangeBan', parameters,
      function requestComplete(status, data) {

        if (status === 'ok') {

          location.reload(true);

        } else {
          alert(status + ': ' + JSON.stringify(data));
        }
      });

}